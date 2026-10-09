export function getKotlinValidatorCode(masterKey: string): string {
  return `package ir.hoshdar.diag.security

import java.math.BigInteger
import java.security.MessageDigest
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

/**
 * سامانه اعتبارسنجی لایسنس دیاگ خودرویی هوشدار
 * Hoshdar Diag Automotive Software License Validator
 */
object HoshdarLicenseValidator {

    // کلید امنیتی مادر (Master Secret Key)
    private const val MASTER_SECRET_KEY = "${masterKey}"

    enum class LicenseTier(val code: String, val titleFa: String) {
        DPRO("DPRO", "دیاگ تخصصی خودرو"),
        REMAP("REMAP", "ریمپ و تیونینگ ECU"),
        FLEET("FLEET", "پایش ناوگان خودرویی"),
        LFT("LFT", "نسخه نامحدود طلایی (Lifetime)")
    }

    data class ValidationResult(
        val isValid: Boolean,
        val tier: LicenseTier? = null,
        val format: String? = null,
        val message: String
    )

    /**
     * اعتبارسنجی کد فعالسازی ۸ رقمی یا ۱۶ کاراکتری وارد شده توسط کاربر
     */
    fun validateLicense(deviceId: String, enteredCode: String): ValidationResult {
        val cleanDevice = cleanDeviceCode(deviceId)
        val normalizedCode = enteredCode.trim().replace("-", "").uppercase()

        if (cleanDevice.length != 8) {
            return ValidationResult(false, null, null, "شناسه دستگاه نامعتبر است (باید ۸ رقمی باشد)")
        }

        for (tier in LicenseTier.values()) {
            // ۱. بررسی فرمت عددی ۸ رقمی
            val expected8Digit = generate8DigitCode(cleanDevice, tier.code)
            if (normalizedCode == expected8Digit) {
                return ValidationResult(true, tier, "8DIGIT", "فعالسازی موفقیت‌آمیز پکیج \${tier.titleFa}")
            }

            // ۲. بررسی فرمت ۱۶ کاراکتری بلوکی
            val expected16Block = generate16BlockCode(cleanDevice, tier.code).replace("-", "")
            if (normalizedCode == expected16Block) {
                return ValidationResult(true, tier, "16BLOCK", "فعالسازی موفقیت‌آمیز پکیج \${tier.titleFa}")
            }
        }

        return ValidationResult(false, null, null, "کد فعالسازی وارد شده برای این سخت‌افزار دیاگ نامعتبر است")
    }

    /**
     * محاسبه فرمول کد ۸ رقمی با HMAC-SHA256
     */
    fun generate8DigitCode(cleanDevice8: String, tierCode: String): String {
        val payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:$cleanDevice8:$tierCode:HMAC_SHA256"
        val hex = hmacSha256(MASTER_SECRET_KEY, payload)
        val first12Hex = hex.substring(0, 12)
        val parsedVal = first12Hex.toLong(16)
        val eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L)
        return eightDigit.toString()
    }

    /**
     * محاسبه فرمول کد ۱۶ کاراکتری
     */
    fun generate16BlockCode(cleanDevice8: String, tierCode: String): String {
        val payload = "HOSHDAR_DIAG_ACTIVATION_16BLOCK_V2:$cleanDevice8:$tierCode:HMAC_SHA256"
        val hex = hmacSha256(MASTER_SECRET_KEY, payload)
        val first16 = hex.substring(0, 16).uppercase()
        return "\${first16.substring(0, 4)}-\${first16.substring(4, 8)}-\${first16.substring(8, 12)}-\${first16.substring(12, 16)}"
    }

    private fun cleanDeviceCode(raw: String): String {
        val digits = raw.filter { it.isDigit() }
        return if (digits.length >= 8) digits.takeLast(8) else digits.padStart(8, '0')
    }

    private fun hmacSha256(key: String, data: String): String {
        val sha256Hmac = Mac.getInstance("HmacSHA256")
        val secretKeySpec = SecretKeySpec(key.toByteArray(Charsets.UTF_8), "HmacSHA256")
        sha256Hmac.init(secretKeySpec)
        val hash = sha256Hmac.doFinal(data.toByteArray(Charsets.UTF_8))
        return hash.joinToString("") { "%02x".format(it) }
    }
}`;
}

export function getJavaValidatorCode(masterKey: string): string {
  return `package ir.hoshdar.diag.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class HoshdarLicenseValidator {

    private static final String MASTER_SECRET_KEY = "${masterKey}";

    public static boolean verify(String deviceId, String enteredCode, String tierCode) {
        String cleanDevice = deviceId.replaceAll("\\\\D", "");
        if (cleanDevice.length() > 8) cleanDevice = cleanDevice.substring(cleanDevice.length() - 8);
        while (cleanDevice.length() < 8) cleanDevice = "0" + cleanDevice;

        String expected8 = generate8DigitCode(cleanDevice, tierCode);
        String normalizedCode = enteredCode.trim().replaceAll("-", "").toUpperCase();
        return normalizedCode.equals(expected8);
    }

    public static String generate8DigitCode(String cleanDevice8, String tierCode) {
        try {
            String payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:" + cleanDevice8 + ":" + tierCode + ":HMAC_SHA256";
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(MASTER_SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            String first12 = hex.substring(0, 12);
            long parsedVal = Long.parseLong(first12, 16);
            long eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L);
            return String.valueOf(eightDigit);
        } catch (Exception e) {
            throw new RuntimeException("Crypto calculation error", e);
        }
    }
}`;
}
