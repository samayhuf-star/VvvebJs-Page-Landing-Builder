import { expand } from './countries';

export type Status = 'free' | 'eta' | 'evisa' | 'voa' | 'required';

export type Rule = {
  who: string[];
  status: Status;
  stay?: string;
  note?: string;
  /** Policy changes often — show a "double-check" hint. */
  verify?: boolean;
};

export type DestRules = { rules: Rule[]; fallback: Omit<Rule, 'who'> };

const r = (who: string[], status: Status, stay?: string, note?: string, verify = false): Rule => ({ who, status, stay, note, verify });

/**
 * INDICATIVE data for a demo/MVP. Immigration rules change frequently — every
 * result in the UI links users to official sources. Swap this file for an API
 * later without touching any screen.
 */
export const VISA_RULES: Record<string, DestRules> = {
  schengen: {
    rules: [
      r(['@EU'], 'free', 'No limit', 'EU citizens can live, work and travel freely in the Schengen Area.'),
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'BR', 'MX'], 'free', '90 days in any 180', 'The EU’s ETIAS travel authorisation is planned for visa-exempt travellers and the Entry/Exit System registers biometrics at the border — check what is live before you fly.', true),
    ],
    fallback: { status: 'required', stay: 'Up to 90 days in any 180', note: 'Apply for a Schengen short-stay (Type C) visa at the consulate of your main destination, usually 15 days up to 6 months before travel.' },
  },
  uk: {
    rules: [
      r(['US', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'SA', 'BR', 'MX', '@EU'], 'eta', 'Up to 6 months', 'Apply for a UK Electronic Travel Authorisation (ETA) in the UK ETA app before you travel.', true),
    ],
    fallback: { status: 'required', stay: 'Up to 6 months', note: 'Apply online for a Standard Visitor visa and book a biometrics appointment.' },
  },
  usa: {
    rules: [
      r(['CA'], 'free', 'Up to 6 months', 'Canadian citizens do not need a visa or ESTA for tourism, but carry your passport.'),
      r(['GB', 'AU', 'NZ', 'JP', 'KR', 'SG', '@EU'], 'eta', 'Up to 90 days', 'Apply for ESTA under the Visa Waiver Program at least 72 hours before departure.', true),
    ],
    fallback: { status: 'required', stay: 'Set by the border officer', note: 'Apply for a B-1/B-2 visitor visa: DS-160 form, fee payment and a consular interview.' },
  },
  canada: {
    rules: [
      r(['US'], 'free', 'Up to 6 months', 'US citizens do not need a visa or eTA.'),
      r(['GB', 'AU', 'NZ', 'JP', 'KR', 'SG', '@EU'], 'eta', 'Up to 6 months', 'You need an eTA when flying to Canada (not needed when entering by land or sea).'),
    ],
    fallback: { status: 'required', stay: 'Up to 6 months', note: 'Apply for a Temporary Resident Visa (visitor visa) online; biometrics are usually required.' },
  },
  australia: {
    rules: [
      r(['NZ'], 'free', 'Indefinite', 'New Zealanders receive a Special Category Visa on arrival.'),
      r(['US', 'CA', 'JP', 'KR', 'SG'], 'eta', 'Up to 3 months per visit', 'Apply for an Electronic Travel Authority (subclass 601) in the Australian ETA app.'),
      r(['GB', '@EU'], 'evisa', 'Up to 3 months per visit', 'Apply for a free eVisitor (subclass 651) online before you travel.'),
    ],
    fallback: { status: 'required', stay: '3–12 months', note: 'Apply for a Visitor visa (subclass 600) online via ImmiAccount.' },
  },
  japan: {
    rules: [
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'KR', 'SG', 'MX', '@EU'], 'free', 'Up to 90 days', 'Complete Visit Japan Web before arrival to speed up immigration and customs.'),
    ],
    fallback: { status: 'required', stay: '15–90 days', note: 'Apply through the Japanese embassy/consulate or an accredited agency. A few nationalities can use the eVISA.' },
  },
  'south-korea': {
    rules: [
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'SG', 'AE', 'SA', 'BR', 'MX', 'TR', 'ZA', '@EU'], 'free', 'Up to 90 days', 'K-ETA is currently waived for many nationalities — confirm the latest waiver status before you travel.', true),
    ],
    fallback: { status: 'required', stay: 'Up to 90 days', note: 'Apply for a short-term (C-3) visa at a Korean embassy or via the Korea Visa Portal.' },
  },
  china: {
    rules: [
      r(['@EU', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'SA', 'BR', 'MX', 'RU'], 'free', 'Up to 30 days', 'China’s unilateral visa-free policy for tourism and business changes often — confirm the current country list.', true),
    ],
    fallback: { status: 'required', stay: '30–90 days', note: 'Apply for an L (tourist) visa at a Chinese Visa Application Service Centre. Policy for UK, Canadian and some other passports has been changing — double-check.', verify: true },
  },
  uae: {
    rules: [
      r(['SA'], 'free', 'GCC citizens', 'GCC nationals enter with an ID card or passport.'),
      r(['CN'], 'free', 'Up to 30 days', undefined),
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'RU', 'MX', '@EU'], 'free', 'Up to 90 days', 'Visa on arrival is granted automatically — keep your onward ticket and hotel details handy.'),
    ],
    fallback: { status: 'evisa', stay: '30–60 days', note: 'Apply for a tourist visa online (ICP portal, your airline or a UAE-licensed agent). Some nationalities need extra documents.' },
  },
  singapore: {
    rules: [
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'KR', 'AE', 'SA', 'BR', 'MX', 'TR', 'RU', 'CN', 'ID', 'PH', 'ZA', '@EU'], 'free', '30–90 days', 'Submit the SG Arrival Card online within 3 days before you arrive.'),
    ],
    fallback: { status: 'required', stay: 'Up to 30 days', note: 'Apply for a Visit Visa via a Singapore-registered agent or the ICA online service.' },
  },
  thailand: {
    rules: [
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'SA', 'BR', 'MX', 'RU', 'IN', 'CN', 'ZA', 'PH', 'ID', 'TR', '@EU'], 'free', 'Up to 60 days', 'Thailand has been reviewing the visa-exempt stay length — confirm the current limit. Submit the Thailand Digital Arrival Card (TDAC) before landing.', true),
    ],
    fallback: { status: 'evisa', stay: '30–60 days', note: 'Apply for a Thailand e-Visa online at least a few weeks before travel.' },
  },
  malaysia: {
    rules: [
      r(['CN', 'IN'], 'free', 'Up to 30 days', 'Time-limited visa waiver for Chinese and Indian passports — confirm the end date. Complete the MDAC arrival card.', true),
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'SA', 'BR', 'MX', 'TR', 'RU', 'ZA', 'PH', 'ID', '@EU'], 'free', 'Up to 90 days', 'Complete the Malaysia Digital Arrival Card (MDAC) within 3 days before you arrive.'),
    ],
    fallback: { status: 'evisa', stay: '30 days', note: 'Apply for a Malaysia eVisa online before travel.' },
  },
  vietnam: {
    rules: [
      r(['GB', 'JP', 'KR', '@EU'], 'free', 'Up to 45 days', 'Visa-exemption has been extended for selected countries — confirm the end date.', true),
    ],
    fallback: { status: 'evisa', stay: 'Up to 90 days', note: 'Apply for a Vietnam e-Visa at the official government portal (usually ~3 working days).' },
  },
  india: {
    rules: [
      r(['PK', 'BD', 'CN'], 'required', '—', 'You must apply for a regular visa at an Indian mission; the e-Visa is not available for your passport.', true),
      r(['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'SA', 'BR', 'MX', 'RU', 'ZA', 'PH', 'ID', 'TR', 'EG', 'NG', '@EU'], 'evisa', '30 days – 5 years', 'Apply for an India e-Visa at least 4 days before arrival; you must arrive at a designated airport.'),
    ],
    fallback: { status: 'required', stay: '—', note: 'Apply at the nearest Indian mission or visa centre.' },
  },
};

export type VisaInfo = {
  status: Status | 'citizen';
  stay?: string;
  note?: string;
  verify?: boolean;
};

export function lookup(passport: string, destId: string, citizens: string[]): VisaInfo {
  if (citizens.includes(passport)) {
    return { status: 'citizen', stay: 'Unlimited', note: 'You are a citizen of this destination. Carry a valid passport or national ID.' };
  }
  const data = VISA_RULES[destId];
  if (!data) return { status: 'required', note: 'No data for this destination yet.' };
  const rule = data.rules.find((x) => expand(x.who).includes(passport));
  return rule ?? { ...data.fallback };
}
