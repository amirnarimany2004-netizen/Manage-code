package ir.hoshdar.diag.licensemanager.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import ir.hoshdar.diag.licensemanager.ui.screens.*

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HoshdarTheme {
                // Enforce RTL for full Persian layout support
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    MainScreen(viewModel)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(viewModel: MainViewModel) {
    var selectedTab by remember { mutableStateOf(0) }
    var simDeviceId by remember { mutableStateOf("84920173") }
    var simActivationCode by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "هوشدار دیاگ • مدیریت لایسنس",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "موتور رمزنگاری خودرویی HMAC-SHA256",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF10151E)
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF10151F)
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Key, contentDescription = "تولید") },
                    label = { Text("تولید لایسنس") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Smartphone, contentDescription = "شبیه‌ساز") },
                    label = { Text("شبیه‌ساز دیاگ") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.History, contentDescription = "تاریخچه") },
                    label = { Text("تاریخچه") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Security, contentDescription = "تنظیمات") },
                    label = { Text("تنظیمات") }
                )
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues).fillMaxSize()) {
            when (selectedTab) {
                0 -> GeneratorScreen(
                    viewModel = viewModel,
                    onNavigateToSimulator = { dev, code ->
                        simDeviceId = dev
                        simActivationCode = code
                        selectedTab = 1
                    }
                )
                1 -> SimulatorScreen(
                    viewModel = viewModel,
                    initialDeviceId = simDeviceId,
                    initialCode = simActivationCode
                )
                2 -> HistoryScreen(
                    viewModel = viewModel,
                    onNavigateToSimulator = { dev, code ->
                        simDeviceId = dev
                        simActivationCode = code
                        selectedTab = 1
                    }
                )
                3 -> SettingsScreen(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun HoshdarTheme(content: @Composable () -> Unit) {
    val darkColors = darkColorScheme(
        primary = Color(0xFFF59E0B),       // Amber Gold
        onPrimary = Color(0xFF090D12),
        secondary = Color(0xFF3B82F6),     // Automotive Blue
        background = Color(0xFF090D12),
        surface = Color(0xFF121822),
        onSurface = Color(0xFFF1F5F9),
        error = Color(0xFFEF4444)
    )

    MaterialTheme(
        colorScheme = darkColors,
        content = content
    )
}
