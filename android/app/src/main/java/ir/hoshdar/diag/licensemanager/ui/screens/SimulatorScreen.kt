package ir.hoshdar.diag.licensemanager.ui.screens

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ir.hoshdar.diag.licensemanager.crypto.HmacCryptoEngine
import ir.hoshdar.diag.licensemanager.ui.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SimulatorScreen(
    viewModel: MainViewModel,
    initialDeviceId: String = "84920173",
    initialCode: String = ""
) {
    var deviceId by remember { mutableStateOf(initialDeviceId) }
    var enteredCode by remember { mutableStateOf(initialCode) }
    var validationResult by remember { mutableStateOf<Boolean?>(null) }
    var activatedTierName by remember { mutableStateOf("") }

    val masterKey by viewModel.masterSecretKey.collectAsState()

    fun verify() {
        val cleanDev = HmacCryptoEngine.cleanDeviceCode(deviceId)
        val codeClean = enteredCode.trim().replace("-", "")

        val tiers = listOf(
            "DPRO" to "دیاگ تخصصی خودرو (DPRO)",
            "REMAP" to "ریمپ و تیونینگ ECU (REMAP)",
            "FLEET" to "پایش ناوگان (FLEET)",
            "LFT" to "نسخه نامحدود طلایی (LFT)"
        )

        for ((tierCode, title) in tiers) {
            val exp8 = HmacCryptoEngine.generate8DigitActivationCode(cleanDev, tierCode, masterKey)
            val exp16 = HmacCryptoEngine.generate16BlockActivationCode(cleanDev, tierCode, masterKey).replace("-", "")

            if (codeClean == exp8 || codeClean.equals(exp16, ignoreCase = true)) {
                validationResult = true
                activatedTierName = title
                return
            }
        }
        validationResult = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131924)),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "شبیه‌ساز فعالسازی نرم‌افزار کاربر نهایی",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Text(
                    text = "شناسه سخت‌افزار دیاگ کاربر:",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF94A3B8)
                )

                OutlinedTextField(
                    value = deviceId,
                    onValueChange = { deviceId = it; validationResult = null },
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = LocalTextStyle.current.copy(
                        textAlign = TextAlign.Center,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                Text(
                    text = "کد فعالسازی دریافتی از پشتیبانی:",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF94A3B8)
                )

                OutlinedTextField(
                    value = enteredCode,
                    onValueChange = { enteredCode = it; validationResult = null },
                    placeholder = { Text("کد فعالسازی ۸ یا ۱۶ رقمی...") },
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = LocalTextStyle.current.copy(
                        textAlign = TextAlign.Center,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                Button(
                    onClick = { verify() },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().height(48.dp)
                ) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = Color(0xFF090D12))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("بررسی و فعالسازی لایسنس", color = Color(0xFF090D12), fontWeight = FontWeight.Bold)
                }
            }
        }

        // Live Result Box
        validationResult?.let { isValid ->
            if (isValid) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0D1D15)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(2.dp, Color(0xFF10B981), RoundedCornerShape(16.dp))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = Color(0xFF10B981),
                            modifier = Modifier.size(36.dp)
                        )
                        Column {
                            Text(
                                text = "فعالسازی با موفقیت انجام شد!",
                                fontWeight = FontWeight.Black,
                                color = Color(0xFF10B981)
                            )
                            Text(
                                text = "سطح دسترسی: $activatedTierName",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White
                            )
                        }
                    }
                }
            } else {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF261214)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(2.dp, Color(0xFFEF4444), RoundedCornerShape(16.dp))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            Icons.Default.Error,
                            contentDescription = null,
                            tint = Color(0xFFEF4444),
                            modifier = Modifier.size(36.dp)
                        )
                        Column {
                            Text(
                                text = "کد فعالسازی نامعتبر است!",
                                fontWeight = FontWeight.Black,
                                color = Color(0xFFEF4444)
                            )
                            Text(
                                text = "کد وارد شده با این شناسه سخت‌افزار تطابق ندارد.",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}
