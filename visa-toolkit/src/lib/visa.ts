import { destById, DESTINATIONS } from '@/data/countries';
import { lookup, Status, VisaInfo } from '@/data/visaRules';

export type StatusKey = Status | 'citizen';

export const STATUS_META: Record<StatusKey, { label: string; headline: string; color: string; icon: string; rank: number }> = {
  citizen: { label: 'Citizen', headline: 'You’re a citizen', color: '#34D4A0', icon: 'home', rank: 0 },
  free: { label: 'Visa-free', headline: 'No visa needed', color: '#34D4A0', icon: 'checkmark-circle', rank: 1 },
  voa: { label: 'Visa on arrival', headline: 'Visa on arrival', color: '#B07CFF', icon: 'airplane', rank: 2 },
  eta: { label: 'eTA / ESTA', headline: 'Online authorisation needed', color: '#6C8CFF', icon: 'phone-portrait', rank: 3 },
  evisa: { label: 'e-Visa', headline: 'Apply for an e-Visa', color: '#FFB547', icon: 'laptop', rank: 4 },
  required: { label: 'Visa required', headline: 'Visa required', color: '#FF6B8B', icon: 'document-text', rank: 5 },
};

export function visaFor(passport: string, destId: string): VisaInfo {
  const dest = destById(destId);
  return lookup(passport, destId, dest?.citizens ?? []);
}

export function summaryFor(passport: string) {
  return DESTINATIONS.map((d) => ({ dest: d, info: visaFor(passport, d.id) })).sort(
    (a, b) => STATUS_META[a.info.status].rank - STATUS_META[b.info.status].rank,
  );
}
