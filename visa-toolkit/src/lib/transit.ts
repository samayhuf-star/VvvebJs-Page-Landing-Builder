import { destById } from '@/data/countries';
import { hubFor, isEligible } from '@/data/transit';
import { visaFor } from './visa';

export type TransitVerdict = 'clear' | 'check' | 'visa';

export type TransitResult = {
  verdict: TransitVerdict;
  headline: string;
  steps: string[];
  note: string;
};

export function checkTransit(passport: string, hubId: string, leaveAirport: boolean, hours: number): TransitResult | null {
  const hub = hubFor(hubId);
  const dest = destById(hubId);
  if (!hub || !dest) return null;
  const entry = visaFor(passport, hubId);

  if (entry.status === 'citizen') {
    return { verdict: 'clear', headline: 'No transit visa needed', steps: ['You are a citizen — you can pass through freely.'], note: hub.airsideNote };
  }

  if (!leaveAirport) {
    if (hub.sameAsEntry) {
      if (entry.status === 'free') return { verdict: 'clear', headline: 'No visa needed', steps: ['Your passport is exempt even when connecting.'], note: hub.airsideNote };
      if (entry.status === 'eta') return { verdict: 'check', headline: 'Authorisation needed', steps: [`Obtain the ${dest.name} online travel authorisation before you fly — it is required even for connections.`], note: hub.airsideNote };
      return { verdict: 'visa', headline: 'Transit visa required', steps: [`Apply for the ${hub.airsideVisaName} before travel.`, 'Airlines usually refuse boarding without it.'], note: hub.airsideNote };
    }
    if (hub.airsideVisa.includes(passport)) {
      return { verdict: 'visa', headline: 'Airport transit visa required', steps: [`Apply for the ${hub.airsideVisaName} before you fly.`, 'Allow 2–4 weeks and keep your onward ticket ready.'], note: hub.airsideNote };
    }
    return { verdict: 'clear', headline: 'No transit visa needed', steps: ['Stay airside: follow “Transfers / Connecting flights” signs.', 'Keep your onward boarding pass handy.'], note: hub.airsideNote };
  }

  // Leaving the airport (or re-checking bags / separate tickets) means clearing immigration.
  const sp = hub.stopover;
  if (sp && hours <= sp.hours && isEligible(sp.eligible, passport) && entry.status !== 'free') {
    return { verdict: 'check', headline: `Eligible: ${sp.name}`, steps: [sp.note, `Your layover (${hours} h) is within the ${sp.hours}-hour limit.`], note: 'Rules for stopover programmes differ per airport and nationality.' };
  }
  if (entry.status === 'free') {
    return { verdict: 'clear', headline: 'You can enter visa-free', steps: [`You will clear ${dest.name} immigration — your passport is exempt.`, entry.stay ? `Permitted stay: ${entry.stay}.` : ''].filter(Boolean), note: entry.note ?? hub.airsideNote };
  }
  if (entry.status === 'eta' || entry.status === 'evisa' || entry.status === 'voa') {
    return { verdict: 'check', headline: 'Entry authorisation needed', steps: [entry.note ?? 'Obtain the required entry authorisation before you fly.'], note: hub.airsideNote };
  }
  return { verdict: 'visa', headline: 'Visa required to leave the airport', steps: [entry.note ?? 'Apply for a visa before you travel.', 'Or stay airside if your tickets are connected and no bag re-check is needed.'], note: hub.airsideNote };
}
