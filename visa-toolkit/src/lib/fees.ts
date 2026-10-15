import { DESTINATIONS } from '@/data/countries';
import { Fee, FEES } from '@/data/fees';
import { StatusKey, visaFor } from './visa';

export type FeeRow = { id: string; name: string; flag: string; status: StatusKey; fee: Fee | null };

const FREE: Fee = { label: 'No visa fee', display: 'Free', usd: 0, processing: 'None — just arrive', days: 0, validity: '' };

export function feeRows(passport: string): FeeRow[] {
  return DESTINATIONS.map((d) => {
    const info = visaFor(passport, d.id);
    const f = FEES[d.id];
    let fee: Fee | null = null;
    if (info.status === 'citizen') fee = null;
    else if (info.status === 'free') fee = { ...FREE, validity: info.stay ?? '' };
    else if (info.status === 'required') fee = f?.standard ?? null;
    else fee = f?.[info.status] ?? f?.standard ?? null;
    return { id: d.id, name: d.name, flag: d.flag, status: info.status, fee };
  });
}
