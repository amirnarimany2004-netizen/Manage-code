package ir.hoshdar.diag.licensemanager.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ir.hoshdar.diag.licensemanager.ui.MainViewModel
import kotlin.random.Random

data class TierItem(val code: String, val titleFa: String, val color: Color)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GeneratorScreen(
    viewModel: MainViewModel,
    onNavigateToSimulator: (String, String) -> Unit
) {
    val context = LocalContext.current
    var customerName by remember { mutableStateOf("تعمیرگاه تخصصی کارن") }
    var customerPhone by remember { mutableStateOf("09121234567") }
    var deviceId by remember { mutableStateOf("84920173") }

    val tiers = remember {
        listOf(
            TierItem("DPRO", "دیاگ تخصصی (DPRO)", Color(0xFF3B82F6)),
            TierItem("REMAP", "ریمپ و تیونینگ (REMAP)", Color(0xFFEC4899)),
            TierItem("FLEET", "پایش ناوگان (FLEET)", Color(0xFF10B981)),
            TierItem("LFT", "نسخه نامحدود طلایی (LFT)", Color(0xFFF59E0B))
        )
    }
    var selectedTier by remember { mutableStateOf(tiers[0]) }
    var format by remember { mutableStateOf("8DIGIT") }
    var duration by remember { mutableStateOf("۱ ساله") }

    var generatedCode by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Customer Name
        OutlinedTextField(
            value = customerName,
            onValueChange = { customerName = it },
            label = { Text("نام مشتری / تعمیرگاه") },
            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        // Customer Phone
        OutlinedTextField(
            value = customerPhone,
            onValueChange = { customerPhone = it },
            label = { Text("شماره تماس مشتری") },
            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        // Device ID with Random Generator
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "شناسه دستگاه (کد ۸ رقمی سخت‌افزار):",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold
                )
                TextButton(
                    onClick = {
                        deviceId = Random.nextLong(10000000L, 99999999L).toString()
                        generatedCode = null
                    }
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("کد تصادفی")
                }
            }

            OutlinedTextField(
                value = deviceId,
                onValueChange = {
                    val filtered = it.filter { ch -> ch.isDigit() }.take(8)
                    deviceId = filtered
                    generatedCode = null
                },
                modifier = Modifier.fillMaxWidth(),
                textStyle = LocalTextStyle.current.copy(
                    textAlign = TextAlign.Center,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFF59E0B)
                ),
                shape = RoundedCornerShape(12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )
        }

        // Tiers Dropdown / Selection
        Text(
            text = "انتخاب سطح دسترسی و پکیج:",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold
        )

        tiers.forEach { tier ->
            val isSelected = selectedTier.code == tier.code
            Card(
                onClick = { selectedTier = tier; generatedCode = null },
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelected) Color(0xFF1E2633) else Color(0xFF121822)
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = if (isSelected) 2.dp else 1.dp,
                        color = if (isSelected) Color(0xFFF59E0B) else Color(0xFF1E2633),
                        shape = RoundedCornerShape(12.dp)
                    )
            ) {
                Row(
                    modifier = Modifier.padding(14.dp).fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = tier.titleFa,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) Color(0xFFF59E0B) else Color.White
                    )
                    Badge(containerColor = tier.color) {
                        Text(tier.code, color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Format Selector
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = format == "8DIGIT",
                onClick = { format = "8DIGIT"; generatedCode = null },
                label = { Text("۸ رقمی استاندارد") },
                modifier = Modifier.weight(1f)
            )
            FilterChip(
                selected = format == "16BLOCK",
                onClick = { format = "16BLOCK"; generatedCode = null },
                label = { Text("۱۶ کاراکتری بلوکی") },
                modifier = Modifier.weight(1f)
            )
        }

        // Generate Action Button
        Button(
            onClick = {
                val code = viewModel.generateLicense(
                    customerName = customerName,
                    customerPhone = customerPhone,
                    deviceId = deviceId,
                    tierCode = selectedTier.code,
                    tierTitleFa = selectedTier.titleFa,
                    format = format,
                    durationLabelFa = duration,
                    createdAtShamsi = "۱۴۰۵/۰۷/۱۸",
                    expiresAt = "۱۴۰۶/۰۷/۱۸"
                )
                generatedCode = code
            },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(52.dp)
        ) {
            Icon(Icons.Default.Security, contentDescription = null, tint = Color(0xFF090D12))
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "تولید کد فعالسازی دیاگ",
                fontWeight = FontWeight.Black,
                color = Color(0xFF090D12)
            )
        }

        // Result Card
        generatedCode?.let { code ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF171F2C)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(2.dp, Color(0xFFF59E0B), RoundedCornerShape(16.dp))
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "کد فعالسازی معتبر صادر شده:",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF94A3B8)
                    )

                    Text(
                        text = code,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFFF59E0B),
                            letterSpacing = 4.sp
                        )
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = {
                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                clipboard.setPrimaryClip(ClipData.newPlainText("License Code", code))
                                Toast.makeText(context, "کد فعالسازی کپی شد", Toast.LENGTH_SHORT).show()
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("کپی کد")
                        }

                        OutlinedButton(
                            onClick = {
                                val shareIntent = Intent().apply {
                                    action = Intent.ACTION_SEND
                                    putExtra(Intent.EXTRA_TEXT, "کد فعالسازی دیاگ هوشدار برای سخت‌افزار $deviceId: $code")
                                    type = "text/plain"
                                }
                                context.startActivity(Intent.createChooser(shareIntent, "ارسال کد"))
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("ارسال")
                        }

                        Button(
                            onClick = { onNavigateToSimulator(deviceId, code) },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("تست", color = Color.White)
                        }
                    }
                }
            }
        }
    }
}
