/**
 * Privacy Policy and Terms & Conditions — DRAFT FRAMEWORK (content.md §10–11).
 *
 * These are not legal advice and are not final. Bracketed items render as
 * highlighted placeholders, and `note` blocks render as visible "Publisher note"
 * callouts so nobody mistakes the draft for a finished policy.
 *
 * Inline syntax inside strings:
 *   [[text]]   → highlighted placeholder, rendered as “[text]”
 *   **text**   → bold
 *   `text`     → code
 *   {{link:/path|label}} → internal link
 */

import { legal, verifiedEmail } from './site';

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  intro: { label: string; value: string }[];
  draftNotice: string;
  sections: LegalSection[];
}

const privacyContact = legal.privacyEmail ?? verifiedEmail();
const generalContact = verifiedEmail();

const field = (value: string | null, placeholder: string) =>
  value ? value : `[[${placeholder}]]`;

const formatDate = (iso: string | null, placeholder: string) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : `[[${placeholder}]]`;

export const privacyPolicy: LegalDocument = {
  title: 'Privacy Policy',
  intro: [
    { label: 'Last updated', value: formatDate(legal.privacyLastUpdated, 'Insert actual publication date') },
    { label: 'Applies to', value: 'Orion Theory website and the Orion Theory apps identified below.' },
    { label: 'Privacy contact', value: field(privacyContact, 'Insert verified privacy email') },
  ],
  draftNotice:
    'This policy must be tailored to actual practices. Do not publish statements about collection, advertising, analytics, children, deletion, retention, or third-party vendors without verifying them against the app build and SDK configuration. The Play Console Data safety form must match the actual app and this policy.',
  sections: [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      blocks: [
        {
          type: 'p',
          text: 'Orion Theory (“we,” “us,” or “our”) develops and publishes mobile apps and games. This Privacy Policy explains how information may be handled when you visit `oriontheory.store` or use an Orion Theory app.',
        },
      ],
    },
    {
      id: 'scope',
      heading: 'Scope',
      blocks: [
        {
          type: 'p',
          text: 'This policy applies to the Orion Theory website and the apps expressly listed here: [[list currently released apps; currently none, or add What Flag when released]]. A third-party platform such as Google Play may also process information under its own policies.',
        },
      ],
    },
    {
      id: 'information-we-collect',
      heading: 'Information we collect',
      blocks: [
        {
          type: 'note',
          text: '**Complete this section only after confirming the actual product behavior.** Describe applicable categories, for example:',
        },
        {
          type: 'list',
          items: [
            'Information a user chooses to send through support or contact forms.',
            'App or device information collected by the app or integrated SDKs.',
            'Diagnostics, crash reports, analytics, advertising identifiers, or purchase information, if applicable.',
            'Information stored locally on the device.',
            'Information collected through website logs, cookies, or analytics, if applicable.',
          ],
        },
        {
          type: 'note',
          text: 'If the app does not collect a category, say so only after checking the app and its SDKs. Explain whether data is required or optional.',
        },
        {
          type: 'note',
          text: 'Website facts to verify with your host before publishing: as built, this website sets no cookies, loads no analytics or advertising scripts, serves its fonts from its own domain, and has no contact form (contact happens by email). Your hosting provider may still keep server logs such as IP addresses and request times — [[confirm the hosting provider’s logging and retention]].',
        },
      ],
    },
    {
      id: 'how-we-use-information',
      heading: 'How we use information',
      blocks: [
        {
          type: 'note',
          text: 'Describe the real purposes, which may include operating the app, responding to support requests, maintaining security, diagnosing errors, improving features, complying with legal obligations, or delivering ads—only where applicable.',
        },
        { type: 'p', text: '[[Insert verified purposes for each category of information]]' },
      ],
    },
    {
      id: 'sharing-and-service-providers',
      heading: 'Sharing and service providers',
      blocks: [
        {
          type: 'note',
          text: 'Identify the actual third-party SDKs and service providers and explain what they receive and why. Include relevant links to their privacy policies. Do not use a generic “we may share with partners” statement as a substitute for naming material providers.',
        },
        { type: 'p', text: '[[List actual service providers and SDKs, what they receive, why, and links to their privacy policies]]' },
      ],
    },
    {
      id: 'advertising-and-analytics',
      heading: 'Advertising and analytics',
      blocks: [
        {
          type: 'p',
          text: '[[Include only if used.]] Explain the advertising/analytics technologies, identifiers, personalization behavior, and available controls. If the app is child-directed or may include children, carefully verify applicable requirements and SDK suitability.',
        },
      ],
    },
    {
      id: 'data-retention',
      heading: 'Data retention',
      blocks: [
        {
          type: 'note',
          text: 'Explain how long each category is retained and the criteria used to determine retention. State what happens when a user requests deletion, where deletion is available.',
        },
        { type: 'p', text: '[[Insert retention periods and deletion process]]' },
      ],
    },
    {
      id: 'data-security',
      heading: 'Data security',
      blocks: [
        {
          type: 'note',
          text: 'Describe reasonable technical and organizational measures without promising absolute security.',
        },
        { type: 'p', text: '[[Describe actual security measures]]' },
      ],
    },
    {
      id: 'childrens-privacy',
      heading: 'Children’s privacy',
      blocks: [
        {
          type: 'note',
          text: 'State the actual intended audience and practices. Do not claim the app is “not directed to children” or “safe for all ages” without checking the app’s content, store target audience, advertising SDKs, and applicable rules. Explain how a parent/guardian can contact you about a child’s information if relevant.',
        },
        { type: 'p', text: '[[State the verified target audience and children’s privacy practices]]' },
      ],
    },
    {
      id: 'your-choices-and-rights',
      heading: 'Your choices and rights',
      blocks: [
        {
          type: 'note',
          text: 'Explain applicable access, correction, deletion, objection, consent withdrawal, or other rights based on the jurisdictions served and the data actually processed. Provide a working contact route.',
        },
        { type: 'p', text: '[[Describe applicable rights and how to exercise them]]' },
      ],
    },
    {
      id: 'international-transfers',
      heading: 'International transfers',
      blocks: [
        {
          type: 'p',
          text: '[[If information is transferred internationally, explain the relevant destinations and safeguards where required.]]',
        },
      ],
    },
    {
      id: 'third-party-links',
      heading: 'Third-party links',
      blocks: [
        {
          type: 'p',
          text: 'The website or app may link to third-party services. Their privacy practices are governed by their own policies.',
        },
      ],
    },
    {
      id: 'changes-to-this-policy',
      heading: 'Changes to this policy',
      blocks: [
        {
          type: 'p',
          text: 'We may update this policy as our services or legal obligations change. The updated date will be shown above.',
        },
        {
          type: 'note',
          text: 'Explain how material changes are communicated if that is part of your actual process.',
        },
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      blocks: [
        {
          type: 'p',
          text: `For privacy questions or requests: **${field(privacyContact, 'verified privacy email')}**`,
        },
        {
          type: 'p',
          text: `Publisher name/address: **${field(legal.publisherIdentity, 'insert accurate legal or business identity details if required')}**`,
        },
      ],
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  title: 'Terms & Conditions',
  intro: [
    { label: 'Last updated', value: formatDate(legal.termsLastUpdated, 'Insert actual publication date') },
    { label: 'Publisher', value: 'Orion Theory' },
    { label: 'Contact', value: field(generalContact, 'Insert verified contact email') },
  ],
  draftNotice:
    'Have this reviewed for the jurisdictions and app features involved. Replace bracketed items and ensure the terms match the app, Play Store listing, and any paid features.',
  sections: [
    {
      id: 'agreement',
      heading: 'Agreement',
      blocks: [
        {
          type: 'p',
          text: 'These Terms & Conditions govern access to the Orion Theory website and apps. By accessing or using a service, you agree to these terms. If you do not agree, do not use that service.',
        },
      ],
    },
    {
      id: 'about-orion-theory',
      heading: 'About Orion Theory',
      blocks: [
        {
          type: 'p',
          text: 'Orion Theory develops and publishes mobile apps and games. The apps and features available may change over time. The relevant app’s store listing and in-app notices may provide additional information.',
        },
      ],
    },
    {
      id: 'eligibility',
      heading: 'Eligibility',
      blocks: [
        {
          type: 'p',
          text: 'Use the services only if you are legally able to agree to these terms. If you are a minor, use the services with any required parent or guardian involvement.',
        },
        {
          type: 'note',
          text: 'Add precise age requirements only after verifying the app’s audience and applicable law.',
        },
      ],
    },
    {
      id: 'license-to-use',
      heading: 'License to use',
      blocks: [
        {
          type: 'p',
          text: 'Subject to these terms, Orion Theory grants you a limited, personal, non-exclusive, non-transferable, revocable license to use the app for its intended purpose. You may not copy, modify, distribute, reverse engineer, or misuse the service except where applicable law permits or Orion Theory gives written permission.',
        },
      ],
    },
    {
      id: 'acceptable-use',
      heading: 'Acceptable use',
      blocks: [
        { type: 'p', text: 'You agree not to:' },
        {
          type: 'list',
          items: [
            'Use the service unlawfully or interfere with its operation or security.',
            'Attempt unauthorized access to systems or other users’ information.',
            'Distribute malware, abuse support channels, or infringe intellectual-property rights.',
            'Misrepresent your identity or use the service to harm others.',
          ],
        },
      ],
    },
    {
      id: 'intellectual-property',
      heading: 'Intellectual property',
      blocks: [
        {
          type: 'p',
          text: 'The apps, website, branding, software, and original content are owned by Orion Theory or its licensors and are protected by applicable laws. Third-party names, marks, and content remain the property of their respective owners.',
        },
      ],
    },
    {
      id: 'app-availability-and-updates',
      heading: 'App availability and updates',
      blocks: [
        {
          type: 'p',
          text: 'We may update, change, suspend, or discontinue features or an app, subject to applicable law and platform requirements. We do not promise uninterrupted availability.',
        },
      ],
    },
    {
      id: 'ads-purchases-and-subscriptions',
      heading: 'Ads, purchases, and subscriptions',
      blocks: [
        {
          type: 'p',
          text: '[[Include only if applicable.]] Describe whether the app contains ads, in-app purchases, or subscriptions, how purchases are handled through Google Play, and where cancellation/refund rules are found.',
        },
        {
          type: 'note',
          text: 'Do not claim the app is ad-supported or offers purchases until confirmed.',
        },
      ],
    },
    {
      id: 'user-feedback',
      heading: 'User feedback',
      blocks: [
        {
          type: 'p',
          text: 'If you send suggestions or feedback, you grant Orion Theory permission to use that feedback to improve its services without obligation to you, to the extent permitted by law.',
        },
        {
          type: 'note',
          text: 'Do not include a broad rights grant for user content unless the app actually accepts user content.',
        },
      ],
    },
    {
      id: 'disclaimers',
      heading: 'Disclaimers',
      blocks: [
        {
          type: 'p',
          text: 'To the extent permitted by law, services are provided “as is” and “as available.” Nothing in these terms excludes rights or remedies that cannot legally be excluded.',
        },
      ],
    },
    {
      id: 'limitation-of-liability',
      heading: 'Limitation of liability',
      blocks: [
        {
          type: 'p',
          text: 'To the extent permitted by applicable law, Orion Theory will not be liable for indirect or consequential losses arising from use of the service.',
        },
        {
          type: 'note',
          text: 'Any limitation must be adapted to applicable consumer law and must not exclude liability that cannot legally be excluded.',
        },
      ],
    },
    {
      id: 'suspension-or-termination',
      heading: 'Suspension or termination',
      blocks: [
        {
          type: 'p',
          text: 'We may suspend or terminate access where reasonably necessary for security, legal compliance, misuse, or service discontinuation, subject to applicable law.',
        },
      ],
    },
    {
      id: 'changes-to-these-terms',
      heading: 'Changes to these terms',
      blocks: [
        {
          type: 'p',
          text: 'We may update these terms. The current version and update date will be published at {{link:/terms|oriontheory.store/terms}}.',
        },
        {
          type: 'note',
          text: 'Explain notice for material changes if a notice process is actually used.',
        },
      ],
    },
    {
      id: 'governing-law-and-disputes',
      heading: 'Governing law and disputes',
      blocks: [
        {
          type: 'p',
          text: '**[[Insert a legally reviewed governing-law and dispute-resolution clause appropriate to the publisher’s actual location and users.]]**',
        },
        { type: 'note', text: 'Do not leave this as an unreviewed guess.' },
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      blocks: [
        {
          type: 'p',
          text: `For questions about these terms: **${field(generalContact, 'verified contact email')}**`,
        },
        {
          type: 'p',
          text: `Publisher identity/address: **${field(legal.publisherIdentity, 'insert accurate details where required')}**`,
        },
      ],
    },
  ],
};
