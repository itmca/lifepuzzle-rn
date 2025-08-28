package io.itmca.lifepuzzle

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.splashview.SplashView
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashView.showSplashView(this)
    super.onCreate(savedInstanceState)
    handleShareIntent(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    intent?.let { handleShareIntent(it) }
  }

  private fun handleShareIntent(intent: Intent?) {
    if (intent == null) return

    val action = intent.action
    val type = intent.type

    if (Intent.ACTION_SEND == action && type != null && type.startsWith("image/")) {
      val imageUri: Uri? = intent.getParcelableExtra(Intent.EXTRA_STREAM)
      imageUri?.let {
        val module = (application as MainApplication).reactNativeHost.reactInstanceManager.currentReactContext
                    ?.getNativeModule(LPShareModule::class.java)
        if (module != null) {
          module.setSharedImageUri(it.toString())
        } else {
          pendingSingleImageUri = it.toString()
          pendingMultipleImageUris = null
        }
      }
    } else if (Intent.ACTION_SEND_MULTIPLE == action && type != null && type.startsWith("image/")) {
      val imageUris: ArrayList<Uri>? = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM)
      imageUris?.let { uris ->
        val uriStrings = uris.map { it.toString() }
        val module = (application as MainApplication).reactNativeHost.reactInstanceManager.currentReactContext
                    ?.getNativeModule(LPShareModule::class.java)
        if (module != null) {
          module.setSharedImageUris(uriStrings)
        } else {
          pendingMultipleImageUris = uriStrings
          pendingSingleImageUri = null
        }
      }
    }
  }


  override fun getMainComponentName(): String = "lifepuzzle"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  fun processPendingShareData(): Pair<String?, List<String>?> {
    val result = Pair(pendingSingleImageUri, pendingMultipleImageUris)
    pendingSingleImageUri = null
    pendingMultipleImageUris = null
    return result
  }

  companion object {
    private var pendingSingleImageUri: String? = null
    private var pendingMultipleImageUris: List<String>? = null
    
    fun hasPendingShareData(): Boolean {
      return pendingSingleImageUri != null || pendingMultipleImageUris != null
    }
  }
}
