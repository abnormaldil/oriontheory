/**
 * Contact forms — one definition shared by the /contact page (to render each
 * form) and the /api/contact function (to validate and email it).
 *
 * Field types: text, email, url, select, textarea, checkbox, files.
 * Reserved field names (used by the form itself): topic, started, nickname.
 * To add a field, add it here; the page and the email pick it up automatically.
 */

/** Where every form is delivered. */
export const CONTACT_TO = 'oriontheoryconnect@gmail.com';

export const LIMITS = {
  /** Vercel Functions accept request bodies up to 4.5 MB; keep a safe margin. */
  maxTotalBytes: 4 * 1024 * 1024,
  /** Images larger than this (or than maxImageSide) are shrunk in the browser before upload. */
  compressAboveBytes: 900 * 1024,
  maxImageSide: 2000,
  textareaMax: 5000,
  textMax: 200,
  /** Seconds a person needs at least to fill in a form (simple spam filter). */
  minSeconds: 3,
};

export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];

const name = { name: 'name', label: 'Your name', type: 'text', required: true, autocomplete: 'name' };
const email = {
  name: 'email',
  label: 'Your email',
  type: 'email',
  required: true,
  autocomplete: 'email',
  hint: 'We’ll reply to this address.',
};
const product = (extra = []) => ({
  name: 'product',
  label: 'Which product?',
  type: 'select',
  required: true,
  options: ['What Flag', ...extra, 'Something else'],
});
const device = {
  name: 'device',
  label: 'Device',
  type: 'text',
  placeholder: 'e.g. Samsung Galaxy A54',
  autocomplete: 'off',
};
const androidVersion = { name: 'androidVersion', label: 'Android version', type: 'text', placeholder: 'e.g. Android 14' };
const appVersion = {
  name: 'appVersion',
  label: 'App version',
  type: 'text',
  placeholder: 'Optional',
  hint: 'Shown in the game’s settings, if you can find it.',
};
const screenshots = (max = 4) => ({
  name: 'attachments',
  label: 'Screenshots',
  type: 'files',
  max,
  accept: IMAGE_TYPES,
  hint: `Up to ${max} images. Large screenshots are shrunk automatically.`,
});

/** @typedef {{ name: string, label: string, type: string, required?: boolean, options?: string[],
 *   placeholder?: string, hint?: string, autocomplete?: string, rows?: number, max?: number,
 *   accept?: string[], wide?: boolean }} ContactField */

/** @type {{ id: string, name: string, subject: string, intro: string, color: string,
 *   summaryFields: string[], fields: ContactField[] }[]} */
export const contactForms = [
  {
    id: 'app-support',
    name: 'App support',
    subject: 'App support',
    intro: 'Which app, what you were trying to do, and your device and operating-system version.',
    color: 'var(--cobalt)',
    summaryFields: ['product'],
    fields: [
      name,
      email,
      product(),
      device,
      androidVersion,
      appVersion,
      {
        name: 'message',
        label: 'What were you trying to do, and what happened?',
        type: 'textarea',
        required: true,
        rows: 6,
        wide: true,
      },
      screenshots(4),
    ],
  },
  {
    id: 'bug-report',
    name: 'Bug report',
    subject: 'Bug report',
    intro: 'What happened, what you expected, and the steps that make it happen again.',
    color: 'var(--tomato)',
    summaryFields: ['product', 'device'],
    fields: [
      name,
      email,
      product(),
      { ...device, required: true },
      { ...androidVersion, required: true },
      appVersion,
      {
        name: 'frequency',
        label: 'How often does it happen?',
        type: 'select',
        required: true,
        options: ['Every time', 'Sometimes', 'It happened once'],
      },
      {
        name: 'steps',
        label: 'Steps to make it happen',
        type: 'textarea',
        required: true,
        rows: 5,
        placeholder: '1. Open the game\n2. …',
        wide: true,
      },
      { name: 'expected', label: 'What did you expect to happen?', type: 'textarea', required: true, rows: 3 },
      { name: 'actual', label: 'What happened instead?', type: 'textarea', required: true, rows: 3 },
      screenshots(4),
    ],
  },
  {
    id: 'feedback',
    name: 'Feedback or suggestion',
    subject: 'Feedback',
    intro: 'Which app or page it’s about, and what would make it better for you.',
    color: 'var(--mint)',
    summaryFields: ['area', 'kind'],
    fields: [
      { ...name, required: false, label: 'Your name', placeholder: 'Optional' },
      {
        ...email,
        required: false,
        placeholder: 'Optional',
        hint: 'Leave it blank if you don’t need a reply.',
      },
      {
        name: 'area',
        label: 'What is it about?',
        type: 'select',
        required: true,
        options: ['What Flag', 'This website', 'Something else'],
      },
      {
        name: 'kind',
        label: 'Type of feedback',
        type: 'select',
        required: true,
        options: ['An idea', 'Something to improve', 'Something I liked', 'Something else'],
      },
      { name: 'message', label: 'Your feedback', type: 'textarea', required: true, rows: 6, wide: true },
      screenshots(4),
    ],
  },
  {
    id: 'privacy',
    name: 'Privacy or data request',
    subject: 'Privacy or data request',
    intro: 'The app involved and what you’d like us to do. Please don’t send passwords.',
    color: 'var(--sun)',
    summaryFields: ['request', 'product'],
    fields: [
      name,
      email,
      product(['This website']),
      {
        name: 'request',
        label: 'What would you like us to do?',
        type: 'select',
        required: true,
        options: [
          'Tell me what data you hold about me',
          'Delete my data',
          'Correct my data',
          'Answer a question about privacy',
          'Something else',
        ],
      },
      {
        name: 'details',
        label: 'Details',
        type: 'textarea',
        required: true,
        rows: 6,
        hint: 'Please don’t include passwords, payment details or ID documents.',
        wide: true,
      },
      {
        name: 'confirm',
        label: 'I am the person this request is about, or their parent or guardian.',
        type: 'checkbox',
        required: true,
        wide: true,
      },
    ],
  },
  {
    id: 'business',
    name: 'Business enquiry',
    subject: 'Business enquiry',
    intro: 'Who you are, your organisation, and what you’d like to discuss.',
    color: 'var(--fg)',
    summaryFields: ['organisation', 'enquiry'],
    fields: [
      name,
      email,
      { name: 'organisation', label: 'Organisation', type: 'text', required: true, autocomplete: 'organization' },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'https://', autocomplete: 'url' },
      {
        name: 'enquiry',
        label: 'What is it about?',
        type: 'select',
        required: true,
        options: ['Partnership', 'Publishing', 'Press or media', 'Advertising', 'Something else'],
      },
      { name: 'message', label: 'Your message', type: 'textarea', required: true, rows: 6, wide: true },
      {
        ...screenshots(3),
        label: 'Attachments',
        accept: [...IMAGE_TYPES, 'application/pdf'],
        hint: 'Up to 3 images or PDFs.',
      },
    ],
  },
];

/** Accept attribute for a file field, including extensions for picky pickers. */
export function acceptAttr(field) {
  const ext = { 'image/png': '.png', 'image/jpeg': '.jpg,.jpeg', 'image/webp': '.webp', 'image/gif': '.gif', 'image/heic': '.heic', 'image/heif': '.heif', 'application/pdf': '.pdf' };
  return [...(field.accept ?? []), ...(field.accept ?? []).map((t) => ext[t]).filter(Boolean)].join(',');
}
