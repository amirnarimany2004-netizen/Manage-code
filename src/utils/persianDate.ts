/**
 * Converts a Gregorian Date to Persian Shamsi (Solar Hijri) Date string
 */
export function toPersianDateString(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Calculates Persian expiration date from now + days
 */
export function calculateExpirationDate(days: number): { iso: string; shamsi: string } {
  if (days < 0) {
    return { iso: 'LIFETIME', shamsi: 'مادام‌العمر (بدون محدودیت)' };
  }
  const date = new Date();
  date.setDate(date.getDate() + days);
  return {
    iso: date.toISOString(),
    shamsi: toPersianDateString(date)
  };
}
