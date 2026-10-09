package ir.hoshdar.diag.licensemanager.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "licenses")
data class LicenseEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val customerName: String,
    val customerPhone: String,
    val deviceId: String,
    val tierCode: String,
    val tierTitleFa: String,
    val format: String,
    val activationCode: String,
    val durationLabelFa: String,
    val createdAtShamsi: String,
    val expiresAt: String,
    val status: String = "active"
)
