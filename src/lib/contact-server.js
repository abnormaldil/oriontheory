/**
 * Server-side handling for the contact forms: validation and the email
 * message. Used by /api/contact (a Vercel Function). Kept free of any
 * transport so it can be tested on its own.
 */
import { contactForms, LIMITS, CONTACT_TO } from '../data/contact-forms.js';

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Collapse anything that could break a mail header. */
const oneLine = (s) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim();

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Safe attachment file name: keep letters, digits, dot, dash, underscore. */
const safeName = (name, i) => {
  const cleaned = String(name || '').replace(/[^\w.\-]+/g, '_').replace(/^\.+/, '').slice(-80);
  return cleaned || `attachment-${i + 1}`;
};

/**
 * Validate a submitted FormData against its form definition.
 * @param {FormData} data
 * @returns {Promise<{ ok: true, form: any, values: Record<string,string>, files: {filename:string, contentType:string, content: Buffer}[] }
 *   | { ok: false, status: number, message: string, errors?: Record<string,string>, spam?: boolean }>}
 */
export async function validateSubmission(data) {
  const form = contactForms.find((f) => f.id === data.get('topic'));
  if (!form) return { ok: false, status: 400, message: 'Please choose a topic.' };

  // Spam filters: a hidden field people never fill, and a minimum time on the form.
  if (String(data.get('nickname') ?? '').trim() !== '') return { ok: false, status: 200, spam: true, message: 'ok' };
  const started = Number(data.get('started'));
  if (Number.isFinite(started) && started > 0 && Date.now() - started < LIMITS.minSeconds * 1000) {
    return { ok: false, status: 200, spam: true, message: 'ok' };
  }

  /** @type {Record<string,string>} */
  const errors = {};
  /** @type {Record<string,string>} */
  const values = {};
  const files = [];
  let total = 0;

  for (const field of form.fields) {
    if (field.type === 'files') {
      const list = data.getAll(field.name).filter((f) => typeof f === 'object' && f && 'arrayBuffer' in f && f.size > 0);
      if (list.length > (field.max ?? 4)) {
        errors[field.name] = `Please attach no more than ${field.max} files.`;
        continue;
      }
      for (const [i, file] of list.entries()) {
        const type = (file.type || '').toLowerCase();
        if (!(field.accept ?? []).includes(type)) {
          errors[field.name] = `“${oneLine(file.name)}” isn’t a supported file type.`;
          break;
        }
        total += file.size;
        files.push({ filename: safeName(file.name, i), contentType: type, content: Buffer.from(await file.arrayBuffer()) });
      }
      continue;
    }

    const raw = data.get(field.name);
    const value = typeof raw === 'string' ? raw.trim() : '';

    if (field.type === 'checkbox') {
      if (field.required && !value) errors[field.name] = 'Please confirm this to continue.';
      values[field.name] = value ? 'Yes' : 'No';
      continue;
    }
    if (!value) {
      if (field.required) errors[field.name] = 'Please fill this in.';
      continue;
    }
    const max = field.type === 'textarea' ? LIMITS.textareaMax : LIMITS.textMax;
    if (value.length > max) errors[field.name] = `Please keep this under ${max} characters.`;
    else if (field.type === 'email' && !EMAIL_RE.test(value)) errors[field.name] = 'Please enter a valid email address.';
    else if (field.type === 'url' && !/^https?:\/\/\S+\.\S+/i.test(value)) errors[field.name] = 'Please enter a full web address, starting with https://';
    else if (field.type === 'select' && !(field.options ?? []).includes(value)) errors[field.name] = 'Please choose one of the options.';
    values[field.name] = value;
  }

  if (total > LIMITS.maxTotalBytes) {
    errors.attachments = 'The attachments are too large together. Please attach fewer or smaller files.';
  }
  if (Object.keys(errors).length) {
    return { ok: false, status: 422, message: 'Please check the highlighted fields.', errors };
  }
  return { ok: true, form, values, files };
}

/**
 * Build the email for a valid submission.
 * @param {{ form: any, values: Record<string,string>, files: any[] }} sub
 * @param {{ from: string, ip?: string, userAgent?: string, page?: string }} meta
 */
export function buildMessage({ form, values, files }, meta) {
  const who = values.name || values.email || 'Anonymous';
  const summary = form.summaryFields.map((k) => values[k]).filter(Boolean).join(' · ');
  const subject = oneLine(`[Orion Theory] ${form.subject}${summary ? ` — ${summary}` : ''} — ${who}`).slice(0, 180);

  const rows = form.fields
    .filter((f) => f.type !== 'files')
    .map((f) => ({ label: f.label, value: values[f.name] ?? '' }))
    .filter((r) => r.value !== '');
  const attachmentsLine = files.length ? `${files.length} attached: ${files.map((f) => f.filename).join(', ')}` : 'None';

  const text = [
    `New ${form.name.toLowerCase()} from oriontheory.store`,
    '',
    ...rows.map((r) => `${r.label}\n${r.value}\n`),
    `Attachments\n${attachmentsLine}`,
    '',
    '—',
    `Sent ${new Date().toUTCString()}${meta.page ? ` from ${meta.page}` : ''}`,
    values.email ? 'Reply to this email to answer the sender directly.' : 'The sender did not leave an email address.',
  ].join('\n');

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f2f2f4;font-family:Arial,Helvetica,sans-serif;color:#0b0b0f">
<table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="padding:20px 24px;background:#0b0b0f;color:#ffffff">
<div style="font-size:13px;opacity:.75">oriontheory.store · contact form</div>
<div style="font-size:22px;font-weight:bold;margin-top:4px">${escapeHtml(form.name)}</div>
${summary ? `<div style="font-size:14px;margin-top:4px;color:#ffc93d">${escapeHtml(summary)}</div>` : ''}
</td></tr>
${rows
  .map(
    (r) => `<tr><td style="padding:14px 24px;border-bottom:1px solid #e7e7eb">
<div style="font-size:12px;color:#62626c;font-weight:bold">${escapeHtml(r.label)}</div>
<div style="font-size:15px;line-height:1.5;margin-top:4px;white-space:pre-wrap">${escapeHtml(r.value)}</div></td></tr>`,
  )
  .join('')}
<tr><td style="padding:14px 24px;border-bottom:1px solid #e7e7eb">
<div style="font-size:12px;color:#62626c;font-weight:bold">Attachments</div>
<div style="font-size:15px;margin-top:4px">${escapeHtml(attachmentsLine)}</div></td></tr>
<tr><td style="padding:14px 24px;font-size:12px;color:#62626c">Sent ${escapeHtml(new Date().toUTCString())}.
${values.email ? 'Reply to this email to answer the sender directly.' : 'The sender did not leave an email address.'}</td></tr>
</table></body></html>`;

  return {
    from: { name: 'Orion Theory website', address: meta.from },
    to: CONTACT_TO,
    ...(values.email ? { replyTo: { name: oneLine(values.name || values.email), address: values.email } } : {}),
    subject,
    text,
    html,
    attachments: files,
    headers: { 'X-Orion-Form': form.id },
  };
}
