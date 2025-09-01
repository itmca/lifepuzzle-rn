package io.itmca.lifepuzzle

import android.net.Uri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.module.annotations.ReactModule
import com.lifepuzzle.sharemodule.NativeLPShareModuleSpec
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.UUID

@ReactModule(name = LPShareModule.NAME)
class LPShareModule(reactContext: ReactApplicationContext) : NativeLPShareModuleSpec(reactContext) {

    companion object {
        const val NAME = "LPShareModule"
        
        private var sharedImageUri: String? = null
        private var sharedImageUris: List<String>? = null
        
        fun setSharedUri(uri: String?) {
            sharedImageUri = uri
        }
        
        fun setSharedUris(uris: List<String>?) {
            sharedImageUris = uris
        }
        
        fun getSharedUri(): String? = sharedImageUri
        fun getSharedUris(): List<String>? = sharedImageUris
        
        fun clearSharedData() {
            sharedImageUri = null
            sharedImageUris = null
        }
    }

    private val reactContext = reactContext

    init {
        if (MainActivity.hasPendingShareData()) {
            val currentActivity = reactContext.currentActivity as? MainActivity
            val (pendingUri, pendingUris) = currentActivity?.processPendingShareData() ?: Pair(null, null)
            
            when {
                pendingUri != null -> setSharedImageUri(pendingUri)
                pendingUris != null -> setSharedImageUris(pendingUris)
            }
        }
    }

    override fun getName(): String = NAME

    @ReactMethod
    override fun sendSharedData(eventName: String, data: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }

    @ReactMethod
    override fun testMethod(promise: Promise) {
        promise.resolve("ShareModule is working!")
    }

    @ReactMethod
    override fun getSharedData(promise: Promise) {
        if (MainActivity.hasPendingShareData()) {
            val currentActivity = reactContext.currentActivity as? MainActivity
            val (pendingUri, pendingUris) = currentActivity?.processPendingShareData() ?: Pair(null, null)
            
            when {
                pendingUri != null -> setSharedImageUri(pendingUri)
                pendingUris != null -> setSharedImageUris(pendingUris)
            }
        }
        
        val sharedUri = getSharedUri()
        val sharedUris = getSharedUris()
        val result = Arguments.createMap()
        
        if (sharedUri != null) {
            result.putString("type", "single")
            result.putString("uri", sharedUri)
            clearSharedData()
        } else if (sharedUris != null) {
            result.putString("type", "multiple") 
            val uriArray = Arguments.createArray()
            sharedUris.forEach { uri ->
                uriArray.pushString(uri)
            }
            result.putArray("uriList", uriArray)
            // 첫 번째 이미지의 uri도 함께 제공
            if (sharedUris.isNotEmpty()) {
                result.putString("uri", sharedUris[0])
            }
            clearSharedData()
        } else {
            result.putNull("type")
        }
        
        promise.resolve(result)
    }

    fun setSharedImageUri(uri: String) {
        try {
            val sourceUri = Uri.parse(uri)
            val inputStream: InputStream? = reactContext.contentResolver.openInputStream(sourceUri)
            
            inputStream?.use { stream ->
                val tempFile = createTempImageFile()
                val outputStream = FileOutputStream(tempFile)
                outputStream.use { output ->
                    stream.copyTo(output)
                }
                val tempUri = "file://${tempFile.absolutePath}"
                setSharedUri(tempUri)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            setSharedUri(null)
        }
    }

    fun setSharedImageUris(uris: List<String>) {
        try {
            val tempUris = mutableListOf<String>()
            uris.forEach { uriString ->
                val sourceUri = Uri.parse(uriString)
                val inputStream: InputStream? = reactContext.contentResolver.openInputStream(sourceUri)
                
                inputStream?.use { stream ->
                    val tempFile = createTempImageFile()
                    val outputStream = FileOutputStream(tempFile)
                    outputStream.use { output ->
                        stream.copyTo(output)
                    }
                    tempUris.add("file://${tempFile.absolutePath}")
                }
            }
            setSharedUris(tempUris)
        } catch (e: Exception) {
            e.printStackTrace()
            setSharedUris(null)
        }
    }

    private fun createTempImageFile(): File {
        val tempDir = File(reactContext.cacheDir, "shared_images")
        if (!tempDir.exists()) {
            tempDir.mkdirs()
        }
        val fileName = "shared_image_${UUID.randomUUID()}.jpg"
        return File(tempDir, fileName)
    }
}
