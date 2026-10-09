package ir.hoshdar.diag.licensemanager.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.unit.dp
import ir.hoshdar.diag.licensemanager.ui.MainViewModel

@Composable
fun HistoryScreen(
    viewModel: MainViewModel,
    onNavigateToSimulator: (String, String) -> Unit
) {
    val context = LocalContext.current
    val licenses by viewModel.licenseHistory.collectAsState()
    var searchQuery by remember { mutableStateOf("") }

    val filtered = licenses.filter {
        searchQuery.isBlank() || it.customerName.contains(searchQuery, ignoreCase = true) ||
                it.deviceId.contains(searchQuery) || it.activationCode.contains(searchQuery)
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "تاریخچه لایسنس‌های صادر شده (${licenses.size})",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            if (licenses.isNotEmpty()) {
                IconButton(onClick = { viewModel.clearAllHistory() }) {
                    Icon(Icons.Default.DeleteSweep, contentDescription = "پاکسازی", tint = Color(0xFFEF4444))
                }
            }
        }

        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("جستجو در مشتریان، کد دستگاه یا کد...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        if (filtered.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(
                    text = if (licenses.isEmpty()) "هیچ لایسنسی ثبت نشده است." else "رکوردی یافت نشد.",
                    color = Color.Gray
                )
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filtered, key = { it.id }) { license ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF131924)),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = license.customerName,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Badge(containerColor = Color(0xFFF59E0B)) {
                                    Text(license.tierTitleFa, color = Color.Black, fontWeight = FontWeight.Bold)
                                }
                            }

                            Text(
                                text = "شناسه سخت‌افزار: ${license.deviceId}",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFF94A3B8)
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "کد: ${license.activationCode}",
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFF59E0B)
                                )

                                Row {
                                    IconButton(
                                        onClick = {
                                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                            clipboard.setPrimaryClip(ClipData.newPlainText("Code", license.activationCode))
                                            Toast.makeText(context, "کپی شد", Toast.LENGTH_SHORT).show()
                                        }
                                    ) {
                                        Icon(Icons.Default.ContentCopy, contentDescription = null, tint = Color.LightGray)
                                    }

                                    IconButton(
                                        onClick = { onNavigateToSimulator(license.deviceId, license.activationCode) }
                                    ) {
                                        Icon(Icons.Default.PlayArrow, contentDescription = "تست", tint = Color(0xFF10B981))
                                    }

                                    IconButton(
                                        onClick = { viewModel.deleteLicense(license) }
                                    ) {
                                        Icon(Icons.Default.Delete, contentDescription = null, tint = Color(0xFFEF4444))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
