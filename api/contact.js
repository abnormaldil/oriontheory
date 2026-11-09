/**
 * POST /api/contact — Vercel Function that emails contact-form submissions
 * to oriontheoryconnect@gmail.com through Gmail SMTP.
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   GMAIL_USER          Gmail address that sends the message (default: oriontheoryconnect@gmail.com)
 *   GMAIL_APP_PASSWORD  16-character Google "app password" for that account (required)
 *   CONTACT_DRY_RUN=1   Optional, for testing: build the email but don't send it
 */
import nodemailer from 'nodemailer';
import { validateSubmission, buildMessage } from '../src/lib/contact-server.js';
import { CONTACT_TO } from '../src/data/contact-forms.js';

// Best-effort rate limit per warm instance: 5 submissions per IP per 10 minutes.
const recent = new Map();
const WINDOW_MS = 10 * 60 * 1000;
function rateLimited(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > 5;
}

/** Browsers posting without JavaScript get a page, everything else gets JSON. */
function reply(request, status, body) {
  const wantsHtml = (request.headers.get('accept') ?? '').includes('text/html') && !request.headers.get('x-requested-with');
  if (wantsHtml) {
    const to = body.ok ? '/contact/sent' : '/contact/not-sent';
    return new Response(null, { status: 303, headers: { Location: to } });
  }
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return reply(request, 429, { ok: false, message: 'Too many messages in a short time. Please try again in a few minutes.' });
  }

  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 4.4 * 1024 * 1024) {
    return reply(request, 413, { ok: false, message: 'The message is too large. Please attach fewer or smaller files.' });
  }

  let data;
  try {
    data = await request.formData();
  } catch {
    return reply(request, 400, { ok: false, message: 'We couldn’t read the form. Please try again.' });
  }

  const result = await validateSubmission(data);
  if (!result.ok) {
    // Spam is answered as if it succeeded, so bots learn nothing.
    if (result.spam) return reply(request, 200, { ok: true });
    return reply(request, result.status, { ok: false, message: result.message, errors: result.errors });
  }

  const user = process.env.GMAIL_USER || CONTACT_TO;
  const pass = (process.env.GMAIL_APP_PASSWORD ?? '').replace(/\s+/g, '');
  const dryRun = process.env.CONTACT_DRY_RUN === '1';
  const message = buildMessage(result, { from: user, page: request.headers.get('referer') ?? undefined });

  if (dryRun) {
    return reply(request, 200, {
      ok: true,
      dryRun: true,
      subject: message.subject,
      replyTo: message.replyTo ?? null,
      attachments: message.attachments.map((a) => ({ filename: a.filename, type: a.contentType, bytes: a.content.length })),
      text: message.text,
    });
  }
  if (!pass) {
    console.error('contact: GMAIL_APP_PASSWORD is not set');
    return reply(request, 503, {
      ok: false,
      message: `The form isn’t available right now. Please email us at ${CONTACT_TO}.`,
    });
  }

  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    await transport.sendMail(message);
    return reply(request, 200, { ok: true });
  } catch (error) {
    console.error('contact: send failed', error?.code ?? '', error?.responseCode ?? '', error?.message ?? error);
    return reply(request, 502, {
      ok: false,
      message: `Your message couldn’t be sent just now. Please try again, or email us at ${CONTACT_TO}.`,
    });
  }
}

export function GET() {
  return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
}
