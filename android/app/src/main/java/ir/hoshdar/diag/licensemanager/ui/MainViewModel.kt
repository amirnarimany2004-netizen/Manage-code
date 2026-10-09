package ir.hoshdar.diag.licensemanager.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import ir.hoshdar.diag.licensemanager.crypto.HmacCryptoEngine
import ir.hoshdar.diag.licensemanager.data.AppDatabase
import ir.hoshdar.diag.licensemanager.data.LicenseEntity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val dao = AppDatabase.getDatabase(application).licenseDao()

    val licenseHistory: StateFlow<List<LicenseEntity>> = dao.getAllLicenses()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val masterSecretKey = MutableStateFlow(HmacCryptoEngine.DEFAULT_MASTER_KEY)

    fun generateLicense(
        customerName: String,
        customerPhone: String,
        deviceId: String,
        tierCode: String,
        tierTitleFa: String,
        format: String,
        durationLabelFa: String,
        createdAtShamsi: String,
        expiresAt: String
    ): String {
        val key = masterSecretKey.value
        val code = if (format == "8DIGIT") {
            HmacCryptoEngine.generate8DigitActivationCode(deviceId, tierCode, key)
        } else {
            HmacCryptoEngine.generate16BlockActivationCode(deviceId, tierCode, key)
        }

        val entity = LicenseEntity(
            customerName = customerName.ifBlank { "مشتری آزاد" },
            customerPhone = customerPhone,
            deviceId = HmacCryptoEngine.cleanDeviceCode(deviceId),
            tierCode = tierCode,
            tierTitleFa = tierTitleFa,
            format = format,
            activationCode = code,
            durationLabelFa = durationLabelFa,
            createdAtShamsi = createdAtShamsi,
            expiresAt = expiresAt
        )

        viewModelScope.launch {
            dao.insertLicense(entity)
        }

        return code
    }

    fun deleteLicense(entity: LicenseEntity) {
        viewModelScope.launch {
            dao.deleteLicense(entity)
        }
    }

    fun clearAllHistory() {
        viewModelScope.launch {
            dao.deleteAllLicenses()
        }
    }

    fun updateMasterKey(newKey: String) {
        masterSecretKey.value = newKey
    }
}
