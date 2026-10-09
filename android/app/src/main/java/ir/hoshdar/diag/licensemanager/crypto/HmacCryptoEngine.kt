package ir.hoshdar.diag.licensemanager.crypto

import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

object HmacCryptoEngine {
    const val DEFAULT_MASTER_KEY = "HOSHDAR_DIAG_MASTER_SECRET_KEY_2026_AUTOMOTIVE"

    fun cleanDeviceCode(raw: String): String {
        val digits = raw.filter { it.isDigit() }
        return if (digits.length >= 8) digits.takeLast(8) else digits.padStart(8, '0')
    }

    fun generate8DigitActivationCode(
        deviceId: String,
        tierCode: String,
        secretKey: String = DEFAULT_MASTER_KEY
    ): String {
        val cleanDevice8 = cleanDeviceCode(deviceId)
        val payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:$cleanDevice8:$tierCode:HMAC_SHA256"
        val hex = hmacSha256Hex(secretKey, payload)
        val first12 = hex.substring(0, 12)
        val parsedVal = first12.toLong(16)
        val eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L)
        return eightDigit.toString()
    }

    fun generate16BlockActivationCode(
        deviceId: String,
        tierCode: String,
        secretKey: String = DEFAULT_MASTER_KEY
    ): String {
        val cleanDevice8 = cleanDeviceCode(deviceId)
        val payload = "HOSHDAR_DIAG_ACTIVATION_16BLOCK_V2:$cleanDevice8:$tierCode:HMAC_SHA256"
        val hex = hmacSha256Hex(secretKey, payload)
        val first16 = hex.substring(0, 16).uppercase()
        return "\${first16.substring(0, 4)}-\${first16.substring(4, 8)}-\${first16.substring(8, 12)}-\${first16.substring(12, 16)}"
    }

    private fun hmacSha256Hex(key: String, message: String): String {
        val mac = Mac.getInstance("HmacSHA256")
        val keySpec = SecretKeySpec(key.toByteArray(Charsets.UTF_8), "HmacSHA256")
        mac.init(keySpec)
        val hash = mac.doFinal(message.toByteArray(Charsets.UTF_8))
        return hash.joinToString("") { "%02x".format(it) }
    }
}
