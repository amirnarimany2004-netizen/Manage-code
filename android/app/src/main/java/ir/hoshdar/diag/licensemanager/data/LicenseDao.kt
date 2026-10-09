package ir.hoshdar.diag.licensemanager.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface LicenseDao {
    @Query("SELECT * FROM licenses ORDER BY id DESC")
    fun getAllLicenses(): Flow<List<LicenseEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLicense(license: LicenseEntity): Long

    @Delete
    suspend fun deleteLicense(license: LicenseEntity)

    @Query("DELETE FROM licenses")
    suspend fun deleteAllLicenses()
}
