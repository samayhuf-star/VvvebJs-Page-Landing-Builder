export type Fee = {
  label: string;
  display: string;
  usd: number;
  processing: string;
  days: number;
  validity: string;
};

export type DestFees = { standard: Fee; eta?: Fee; evisa?: Fee; voa?: Fee };

/** Approximate government fees (tourist, single applicant). Service-centre / agent fees are extra. */
export const FEES: Record<string, DestFees> = {
  schengen: { standard: { label: 'Schengen Type C visa', display: '€90', usd: 98, processing: '15 days (up to 45)', days: 15, validity: 'Up to 90 days' } },
  uk: {
    standard: { label: 'Standard Visitor visa', display: '£127', usd: 170, processing: '~3 weeks', days: 21, validity: '6 months' },
    eta: { label: 'UK ETA', display: '£16', usd: 21, processing: 'Minutes – 3 days', days: 3, validity: '2 years, multi-entry' },
  },
  usa: {
    standard: { label: 'B-1/B-2 visitor visa', display: '$185', usd: 185, processing: '2–12 weeks (interview wait)', days: 45, validity: 'Up to 10 years' },
    eta: { label: 'ESTA', display: '$40', usd: 40, processing: 'Usually < 72 hours', days: 3, validity: '2 years, multi-entry' },
  },
  canada: {
    standard: { label: 'Visitor visa (TRV)', display: 'CAD 100', usd: 73, processing: '2–4 weeks', days: 21, validity: 'Up to 10 years' },
    eta: { label: 'eTA', display: 'CAD 7', usd: 5, processing: 'Minutes – days', days: 1, validity: '5 years' },
  },
  australia: {
    standard: { label: 'Visitor visa (600)', display: 'AUD ~200', usd: 130, processing: '2–4 weeks', days: 21, validity: '3–12 months' },
    eta: { label: 'ETA (601)', display: 'AUD 20', usd: 13, processing: '~24 hours', days: 1, validity: '12 months' },
    evisa: { label: 'eVisitor (651)', display: 'Free', usd: 0, processing: '~24 hours', days: 1, validity: '12 months' },
  },
  japan: { standard: { label: 'Tourist visa (single)', display: '¥3,000', usd: 20, processing: '~5 working days', days: 5, validity: '15–90 days' } },
  'south-korea': { standard: { label: 'Short-term visa (C-3)', display: '~₩50,000', usd: 36, processing: '5–10 working days', days: 8, validity: 'Up to 90 days' } },
  china: { standard: { label: 'L tourist visa', display: 'From ~$30', usd: 60, processing: '4 working days', days: 4, validity: '30–90 days' } },
  uae: {
    standard: { label: 'Tourist visa', display: '~AED 350', usd: 95, processing: '1–5 days', days: 3, validity: '30–60 days' },
    evisa: { label: 'Tourist e-visa', display: '~AED 350', usd: 95, processing: '1–5 days', days: 3, validity: '30–60 days' },
  },
  singapore: { standard: { label: 'Visit visa (via agent)', display: 'SGD 30', usd: 22, processing: '3–5 working days', days: 4, validity: '30 days' } },
  thailand: {
    standard: { label: 'Tourist visa (TR)', display: '฿2,000', usd: 55, processing: '~5 working days', days: 5, validity: '60 days' },
    evisa: { label: 'Thailand e-Visa', display: '฿2,000', usd: 55, processing: '~5 working days', days: 5, validity: '60 days' },
  },
  malaysia: { standard: { label: 'eVisa', display: '~$25', usd: 25, processing: '2–5 working days', days: 4, validity: '30 days' }, evisa: { label: 'eVisa', display: '~$25', usd: 25, processing: '2–5 working days', days: 4, validity: '30 days' } },
  vietnam: { standard: { label: 'e-Visa', display: '$25', usd: 25, processing: '~3 working days', days: 3, validity: 'Up to 90 days' }, evisa: { label: 'e-Visa (single/multi)', display: '$25 / $50', usd: 25, processing: '~3 working days', days: 3, validity: 'Up to 90 days' } },
  india: { standard: { label: 'Tourist visa (embassy)', display: '~$80', usd: 80, processing: '1–3 weeks', days: 10, validity: 'Up to 10 years' }, evisa: { label: 'e-Tourist visa', display: '$10–$80', usd: 25, processing: '3–5 days', days: 4, validity: '30 days – 5 years' } },
};
