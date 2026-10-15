export type Country = { code: string; name: string; flag: string };

/** Passports a traveller can pick (nationality). */
export const PASSPORTS: Country[] = [
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
];

export type Destination = {
  id: string;
  name: string;
  flag: string;
  /** Passport codes that are "citizens" of this destination. */
  citizens: string[];
  airports: string;
};

export const DESTINATIONS: Destination[] = [
  { id: 'schengen', name: 'Schengen Area', flag: '🇪🇺', citizens: ['DE', 'FR', 'IT', 'ES'], airports: 'FRA · CDG · AMS · MAD · FCO' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', citizens: ['GB'], airports: 'LHR · LGW · MAN' },
  { id: 'usa', name: 'United States', flag: '🇺🇸', citizens: ['US'], airports: 'JFK · LAX · ATL · ORD · MIA' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', citizens: ['CA'], airports: 'YYZ · YVR · YUL' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', citizens: ['AU'], airports: 'SYD · MEL · BNE' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', citizens: ['JP'], airports: 'NRT · HND · KIX' },
  { id: 'south-korea', name: 'South Korea', flag: '🇰🇷', citizens: ['KR'], airports: 'ICN · GMP' },
  { id: 'china', name: 'China', flag: '🇨🇳', citizens: ['CN'], airports: 'PEK · PVG · CAN' },
  { id: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', citizens: ['AE'], airports: 'DXB · AUH' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', citizens: ['SG'], airports: 'SIN' },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', citizens: [], airports: 'BKK · DMK · HKT' },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', citizens: [], airports: 'KUL' },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', citizens: [], airports: 'SGN · HAN' },
  { id: 'india', name: 'India', flag: '🇮🇳', citizens: ['IN'], airports: 'DEL · BOM · BLR' },
];

export const byCode = (code: string | null) => PASSPORTS.find((p) => p.code === code) ?? null;
export const destById = (id: string | null) => DESTINATIONS.find((d) => d.id === id) ?? null;

/** Group tokens usable inside rule lists. */
export const GROUPS: Record<string, string[]> = {
  '@EU': ['DE', 'FR', 'IT', 'ES'],
};

export const expand = (codes: string[]) => codes.flatMap((c) => GROUPS[c] ?? [c]);
