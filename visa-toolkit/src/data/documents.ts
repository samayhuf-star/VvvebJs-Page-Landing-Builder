export type Purpose = 'tourist' | 'business' | 'student';
export type DocItem = { id: string; title: string; hint?: string };

export const PURPOSES: { id: Purpose; label: string; icon: string }[] = [
  { id: 'tourist', label: 'Tourism', icon: 'sunny' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'student', label: 'Study', icon: 'school' },
];

export const BASE_DOCS: DocItem[] = [
  { id: 'passport', title: 'Valid passport', hint: 'Valid 6+ months beyond your stay, with 2 blank pages.' },
  { id: 'form', title: 'Completed application form', hint: 'Signed and consistent with your passport details.' },
  { id: 'photos', title: 'Passport-size photos', hint: 'Recent, white background, to the country’s size spec.' },
  { id: 'funds', title: 'Proof of funds', hint: 'Last 3–6 months of bank statements.' },
  { id: 'insurance', title: 'Travel insurance', hint: 'Medical cover for the whole trip.' },
  { id: 'ties', title: 'Proof of ties to home', hint: 'Employer letter, approved leave, property or family documents.' },
];

export const PURPOSE_DOCS: Record<Purpose, DocItem[]> = {
  tourist: [
    { id: 'itinerary', title: 'Day-by-day itinerary' },
    { id: 'hotel', title: 'Accommodation bookings', hint: 'Hotel reservations or host invitation.' },
    { id: 'flights', title: 'Return / onward flight booking' },
  ],
  business: [
    { id: 'invite', title: 'Invitation letter from host company' },
    { id: 'cover', title: 'Employer cover letter', hint: 'Role, purpose, who pays for the trip.' },
    { id: 'registration', title: 'Company registration documents' },
    { id: 'flights', title: 'Return / onward flight booking' },
  ],
  student: [
    { id: 'admission', title: 'Admission / enrolment letter' },
    { id: 'tuition', title: 'Tuition payment receipt' },
    { id: 'transcripts', title: 'Academic transcripts & certificates' },
    { id: 'sponsor', title: 'Sponsor / scholarship documents' },
  ],
};

/** Destination-specific extras. */
export const DEST_DOCS: Record<string, DocItem[]> = {
  schengen: [
    { id: 'sch-ins', title: 'Schengen medical insurance', hint: 'Minimum €30,000 coverage across all Schengen states.' },
    { id: 'sch-appt', title: 'Consulate / VFS appointment confirmation' },
  ],
  uk: [
    { id: 'uk-ref', title: 'GOV.UK application reference' },
    { id: 'uk-bio', title: 'Biometrics appointment confirmation' },
  ],
  usa: [
    { id: 'us-ds160', title: 'DS-160 confirmation page' },
    { id: 'us-fee', title: 'Visa fee payment receipt' },
    { id: 'us-int', title: 'Interview appointment letter' },
  ],
  canada: [
    { id: 'ca-bio', title: 'Biometrics instruction letter / receipt' },
    { id: 'ca-app', title: 'Application confirmation number' },
  ],
  australia: [
    { id: 'au-imm', title: 'ImmiAccount application reference' },
    { id: 'au-health', title: 'Health examination (if staying 3+ months)' },
  ],
  japan: [
    { id: 'jp-vjw', title: 'Visit Japan Web QR code', hint: 'Register before arrival for faster immigration.' },
  ],
  'south-korea': [
    { id: 'kr-keta', title: 'K-ETA approval (if applicable)' },
  ],
  china: [
    { id: 'cn-booking', title: 'Flight & hotel booking proof', hint: 'Often requested at the visa centre and on arrival.' },
  ],
  uae: [
    { id: 'ae-host', title: 'Hotel booking or host’s Emirates ID copy' },
  ],
  singapore: [
    { id: 'sg-sgac', title: 'SG Arrival Card (within 3 days of arrival)' },
  ],
  thailand: [
    { id: 'th-tdac', title: 'Thailand Digital Arrival Card (TDAC)' },
    { id: 'th-funds', title: 'Proof of funds (~THB 20,000 per person)' },
  ],
  malaysia: [
    { id: 'my-mdac', title: 'Malaysia Digital Arrival Card (MDAC)' },
  ],
  vietnam: [
    { id: 'vn-evisa', title: 'Printed e-Visa approval letter' },
  ],
  india: [
    { id: 'in-evisa', title: 'e-Visa approval (ETA) printout' },
    { id: 'in-yf', title: 'Yellow fever certificate (if arriving from an affected country)' },
  ],
};

export const docsFor = (destId: string, purpose: Purpose): DocItem[] => {
  const seen = new Set<string>();
  return [...BASE_DOCS, ...PURPOSE_DOCS[purpose], ...(DEST_DOCS[destId] ?? [])].filter((d) => (seen.has(d.id) ? false : (seen.add(d.id), true)));
};
