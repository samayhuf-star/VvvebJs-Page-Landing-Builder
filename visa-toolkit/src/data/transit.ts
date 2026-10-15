import { expand } from './countries';

export type TransitHub = {
  id: string; // matches a destination id
  /** Passports that need a visa for even airside transit. */
  airsideVisa: string[];
  airsideVisaName: string;
  /** Airside transit follows the entry rules (no exemption) — e.g. USA & Canada. */
  sameAsEntry?: boolean;
  airsideNote: string;
  /** Visa-free city stop-over programme. */
  stopover?: { hours: number; eligible: string[]; name: string; note: string };
};

const RICH = ['US', 'GB', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'SA', 'BR', 'MX', 'RU', '@EU'];

export const TRANSIT_HUBS: TransitHub[] = [
  {
    id: 'schengen',
    airsideVisa: ['BD', 'NG', 'PK'],
    airsideVisaName: 'Airport Transit Visa (ATV)',
    airsideNote: 'Staying airside, most travellers don’t need a visa. Individual member states can add nationalities to the ATV list — confirm with your airline.',
  },
  {
    id: 'uk',
    airsideVisa: ['IN', 'BD', 'NG', 'PK'],
    airsideVisaName: 'Direct Airside Transit visa (DATV)',
    airsideNote: 'No UK ETA is needed if you stay airside. Several other nationalities also need a DATV — check GOV.UK.',
  },
  {
    id: 'usa',
    airsideVisa: [],
    airsideVisaName: 'Transit (C-1) visa',
    sameAsEntry: true,
    airsideNote: 'The US has no airside transit: even connecting passengers must hold a visa or an approved ESTA (Canadians excepted).',
  },
  {
    id: 'canada',
    airsideVisa: [],
    airsideVisaName: 'Visitor / transit visa',
    sameAsEntry: true,
    airsideNote: 'Most travellers need an eTA or visa even when connecting. A Transit Without Visa programme covers some passengers heading to/from the US.',
  },
  {
    id: 'uae',
    airsideVisa: [],
    airsideVisaName: 'Transit visa',
    airsideNote: 'Airside transit in Dubai / Abu Dhabi is visa-free for everyone.',
    stopover: { hours: 96, eligible: ['*'], name: '48 / 96-hour transit visa', note: 'Your airline can arrange a 48- or 96-hour transit visa when you book. Fees apply.' },
  },
  {
    id: 'singapore',
    airsideVisa: [],
    airsideVisaName: 'Transit visa',
    airsideNote: 'Changi airside transit is visa-free for nearly all nationalities, with an onward ticket. Rare exceptions apply.',
  },
  {
    id: 'china',
    airsideVisa: [],
    airsideVisaName: 'Transit visa',
    airsideNote: 'Airside transit is allowed at major hubs for most passengers.',
    stopover: { hours: 240, eligible: RICH, name: '240-hour visa-free transit', note: 'Needs an onward ticket to a third country/region and you must enter via an eligible port.' },
  },
  {
    id: 'japan',
    airsideVisa: [],
    airsideVisaName: 'Transit visa',
    airsideNote: 'Airside transit is generally visa-free at Narita, Haneda and Kansai for connecting passengers.',
  },
  {
    id: 'south-korea',
    airsideVisa: [],
    airsideVisaName: 'Transit visa',
    airsideNote: 'Airside transit at Incheon is visa-free for most passengers.',
  },
  {
    id: 'india',
    airsideVisa: ['PK'],
    airsideVisaName: 'Airport transit visa',
    airsideNote: 'Short airside connections (under ~24 h) at major airports are generally allowed without a visa.',
  },
  {
    id: 'thailand',
    airsideVisa: [],
    airsideVisaName: 'Transit visa',
    airsideNote: 'Airside transit at Bangkok is visa-free; leaving the airport follows the normal entry rules.',
  },
  {
    id: 'malaysia',
    airsideVisa: [],
    airsideVisaName: 'Transit visa',
    airsideNote: 'Airside transit at KLIA is visa-free for most passengers.',
  },
];

export const hubFor = (id: string | null) => TRANSIT_HUBS.find((h) => h.id === id) ?? null;
export const isEligible = (eligible: string[], passport: string) => eligible.includes('*') || expand(eligible).includes(passport);

export const LAYOVER_OPTIONS = [4, 8, 12, 24, 48, 96, 240];
