export interface LicenseTier {
  id: string;
  code: string;
  titleFa: string;
  titleEn: string;
  badgeColor: string;
  descriptionFa: string;
  features: string[];
}

export const LICENSE_TIERS: LicenseTier[] = [
  {
    id: 'dpro',
    code: 'DPRO',
    titleFa: 'دیاگ تخصصی خودرو (DPRO)',
    titleEn: 'Diagnostic Pro',
    badgeColor: '#3b82f6', // Cobalt blue
    descriptionFa: 'عیب‌یابی پیشرفته تمامی یونیت‌ها، خواندن و پاک کردن کد خطاها، تست عملگرها و پارامترخوانی زنده',
    features: ['خواندن و پاک کردن خطاهای ECU/ABS/Airbag', 'تست عملگرهای موتور و بدنه', 'پارامترهای زنده گرافیکی و عددی']
  },
  {
    id: 'remap',
    code: 'REMAP',
    titleFa: 'ریمپ و تیونینگ ECU (REMAP)',
    titleEn: 'ECU Remap & Tuning',
    badgeColor: '#ec4899', // Pink / Magenta
    descriptionFa: 'تیونینگ حرفه‌ای، تنظیم جداول سوخت و جرقه‌زنی، حذف محدودیت سرعت و کات‌آف رگباری',
    features: ['ویرایش جداول سوخت و جرقه‌زنی پاشش', 'تنظیم دمای روشن شدن فن خنک‌کننده', 'حذف سنسورهای میل‌سوپاپ و اکسیژن دوم']
  },
  {
    id: 'fleet',
    code: 'FLEET',
    titleFa: 'مدیریت و پایش ناوگان (FLEET)',
    titleEn: 'Fleet Diagnostics',
    badgeColor: '#10b981', // Emerald
    descriptionFa: 'پایش ناوگان، رهگیری مصرف سوخت، عیب‌یابی دوره‌ای و ثبت گزارشات دوره‌ای کارکرد خودرو',
    features: ['پایش بلادرنگ سنسورها و مصرف سوخت', 'لاگ‌گیری آنلاین وضعیت سلامت قطعات', 'گزارش‌گیری جامع جهت مدیریت ناوگان']
  },
  {
    id: 'lft',
    code: 'LFT',
    titleFa: 'نسخه نامحدود طلایی (LFT)',
    titleEn: 'Lifetime Ultimate All-In-One',
    badgeColor: '#f59e0b', // Amber gold
    descriptionFa: 'پکیج جامع طلایی با فعالسازی تمامی ماژول‌های دیاگ، ریمپ، تعریف سوییچ و آپدیت‌های مادام‌العمر',
    features: ['دسترسی کامل به تمام پکیج‌های دیاگ و ریمپ', 'تعریف سوییچ و کد سوییچ ایموبلایزر', 'پشتیبانی ویژه و بدون تاریخ انقضا']
  }
];

export interface DurationOption {
  id: string;
  labelFa: string;
  days: number;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { id: '1M', labelFa: '۱ ماهه (آزمایشی / دوره‌ای)', days: 30 },
  { id: '6M', labelFa: '۶ ماهه (نیم‌سال)', days: 180 },
  { id: '1Y', labelFa: '۱ ساله (استاندارد سالانه)', days: 365 },
  { id: 'LIFETIME', labelFa: 'مادام‌العمر (بدون انقضا)', days: -1 }
];

export const DEFAULT_MASTER_KEY = "HOSHDAR_DIAG_MASTER_SECRET_KEY_2026_AUTOMOTIVE";

/**
 * Calculates HMAC-SHA256 hex string using Web Crypto API
 */
export async function calculateHmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates an exact 8-digit activation code using the mathematical specification:
 * 1. Payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:{cleanDevice8}:{tierCode}:HMAC_SHA256"
 * 2. HMAC-SHA256 with Master Secret Key
 * 3. Hex string
 * 4. Parse first 12 hex characters as BigInt / Long
 * 5. eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L)
 */
export async function generate8DigitActivationCode(
  deviceId: string,
  tierCode: string,
  secretKey: string = DEFAULT_MASTER_KEY
): Promise<string> {
  const cleanDevice8 = cleanDeviceCode(deviceId);
  const payload = `HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:${cleanDevice8}:${tierCode}:HMAC_SHA256`;
  const hex = await calculateHmacSha256Hex(secretKey, payload);
  const first12 = hex.substring(0, 12);
  const parsedVal = BigInt('0x' + first12);
  const modVal = parsedVal % 90000000n;
  const eightDigit = 10000000n + (modVal >= 0n ? modVal : -modVal);
  return eightDigit.toString();
}

/**
 * Generates a 16-character structured block activation code (e.g. ABCD-EFGH-IJKL-MNOP)
 */
export async function generate16BlockActivationCode(
  deviceId: string,
  tierCode: string,
  secretKey: string = DEFAULT_MASTER_KEY
): Promise<string> {
  const cleanDevice8 = cleanDeviceCode(deviceId);
  const payload = `HOSHDAR_DIAG_ACTIVATION_16BLOCK_V2:${cleanDevice8}:${tierCode}:HMAC_SHA256`;
  const hex = await calculateHmacSha256Hex(secretKey, payload);
  const first16 = hex.substring(0, 16).toUpperCase();
  // Format as 4 blocks of 4 chars
  return `${first16.substring(0, 4)}-${first16.substring(4, 8)}-${first16.substring(8, 12)}-${first16.substring(12, 16)}`;
}

/**
 * Cleans a device code to ensure an exact 8-digit string
 */
export function cleanDeviceCode(input: string): string {
  const digitsOnly = input.replace(/\D/g, '');
  if (!digitsOnly) return '84920173';
  return digitsOnly.slice(-8).padStart(8, '0');
}

/**
 * Validates an activation code against a device code and tier
 */
export async function verifyActivationCode(
  deviceId: string,
  enteredCode: string,
  secretKey: string = DEFAULT_MASTER_KEY
): Promise<{
  isValid: boolean;
  tier?: LicenseTier;
  matchedFormat?: '8DIGIT' | '16BLOCK';
  errorReason?: string;
}> {
  const cleanCode = enteredCode.trim().replace(/\s+/g, '').toUpperCase();
  const cleanDevice8 = cleanDeviceCode(deviceId);

  if (!cleanCode) {
    return { isValid: false, errorReason: 'کد فعالسازی وارد نشده است.' };
  }

  // Test against each tier
  for (const tier of LICENSE_TIERS) {
    // 8-digit check
    const expected8 = await generate8DigitActivationCode(cleanDevice8, tier.code, secretKey);
    if (cleanCode === expected8) {
      return {
        isValid: true,
        tier,
        matchedFormat: '8DIGIT'
      };
    }

    // 16-block check (compare with and without dashes)
    const expected16 = await generate16BlockActivationCode(cleanDevice8, tier.code, secretKey);
    const expected16NoDash = expected16.replace(/-/g, '');
    const cleanCodeNoDash = cleanCode.replace(/-/g, '');

    if (cleanCode === expected16 || cleanCodeNoDash === expected16NoDash) {
      return {
        isValid: true,
        tier,
        matchedFormat: '16BLOCK'
      };
    }
  }

  return {
    isValid: false,
    errorReason: 'کد وارد شده با شناسه دستگاه و کلید امنیتی تطابق ندارد یا معتبر نیست.'
  };
}
