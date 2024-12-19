package com.example.teamproject

import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.http.SslError
import android.os.Bundle
import android.util.Log
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.teamproject.databinding.ActivityMapBinding
import okhttp3.*
import okhttp3.logging.HttpLoggingInterceptor
import java.io.IOException
import javax.net.ssl.X509TrustManager

class MapActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMapBinding

    private lateinit var sslOkHttpClient: OkHttpClient

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMapBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // SelfSigningHelper를 통해 SSLContext 설정
        val sslHelper = SelfSigningHelper(this)
        sslOkHttpClient = OkHttpClient.Builder()
            .sslSocketFactory(
                sslHelper.sslContext.socketFactory,
                sslHelper.tmf.trustManagers[0] as X509TrustManager
            )
            .addInterceptor(HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
            .build()

        setupWebView()
        fetchAndLoadUrl()
    }

    /**
     * WebView 설정 및 클라이언트 설정
     */
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        with(binding.webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            allowContentAccess = true
            allowFileAccess = true
            cacheMode = WebSettings.LOAD_NO_CACHE
            userAgentString = "Android WebView"
        }

        binding.webView.webChromeClient = CustomWebChromeClient()
        binding.webView.webViewClient = CustomWebViewClient()
        binding.webView.addJavascriptInterface(object {
            @JavascriptInterface
            fun requestCurrentLocation() {
                setInitialLocation()
            }
        }, "AndroidBridge")
    }
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 1001 && grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "위치 권한이 허용되었습니다.", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "위치 권한이 거부되었습니다.", Toast.LENGTH_SHORT).show()
        }
    }
    /**
     * OkHttp를 통해 안전하게 URL 데이터를 가져오고 WebView에 로드
     */
    private fun fetchAndLoadUrl() {
        val request = Request.Builder()
            .url("http://10.0.2.2:3000") // HTTPS URL 로드
            .build()

        sslOkHttpClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("WebView", "Failed to load URL: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                val htmlContent = response.body?.string()
                runOnUiThread {
                    binding.webView.loadDataWithBaseURL(
                        null,
                        htmlContent ?: "",
                        "text/html",
                        "UTF-8",
                        null
                    )
                }
            }
        })
    }

    /**
     * Custom WebChromeClient: Geolocation 권한 자동 허용 및 Console 메시지 로깅
     */
    private inner class CustomWebChromeClient : WebChromeClient() {
        override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
            Log.d(
                "WebViewConsole",
                "Message: ${consoleMessage.message()} -- From line ${consoleMessage.lineNumber()} of ${consoleMessage.sourceId()}"
            )
            return true
        }

        override fun onGeolocationPermissionsShowPrompt(
            origin: String,
            callback: GeolocationPermissions.Callback
        ) {
            Log.d("WebView", "Geolocation permission requested from: $origin")
            callback.invoke(origin, true, false) // Geolocation 요청 자동 허용
        }
    }

    /**
     * Custom WebViewClient: URL 로딩 처리 및 SSL 오류 무시
     */
    private inner class CustomWebViewClient : WebViewClient() {
        // 모든 URL을 WebView 내부에서 로드
        override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
            request?.url?.let {
                Log.d("WebView", "Loading URL: $it")
                view?.loadUrl(it.toString())
            }
            return true // 모든 URL을 직접 처리
        }

        override fun onPageFinished(view: WebView?, url: String?) {
            super.onPageFinished(view, url)
            Log.d("WebView", "Page finished loading: $url")

            // 초기 위치 설정 호출
            setInitialLocation()
        }

        // SSL 오류 무시: 테스트 환경에서만 사용 (주의!)
        override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
            Log.w("WebView", "SSL Error: ${error?.toString()}")
            handler?.proceed() // SSL 오류를 무시함
        }
    }

    private fun setInitialLocation() {
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager

        if (checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            locationManager.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                1000L,
                1f
            ) { location ->
                val latitude = location.latitude
                val longitude = location.longitude

                val location = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
                if (location != null) {
                    val latitude = location.latitude
                    val longitude = location.longitude

                    binding.webView.post {
                        binding.webView.evaluateJavascript(
                            "javascript:updateMapLocation($latitude, $longitude)",
                            null
                        )
                    }
                } else {
                    Toast.makeText(this, "위치를 가져올 수 없습니다.", Toast.LENGTH_SHORT).show()
                }

                binding.webView.post {
                    binding.webView.evaluateJavascript(
                        "javascript:updateMapLocation($latitude, $longitude)",
                        { value ->
                            Log.d("WebView", "evaluateJavascript returned: $value")
                        }
                    )
                }

            }
        } else {
            requestPermissions(arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION), 1001)
        }
    }
}
