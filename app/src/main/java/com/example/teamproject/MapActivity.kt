package com.example.teamproject

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.teamproject.databinding.ActivityMainBinding
import com.example.teamproject.databinding.ActivityMapBinding

class MapActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMapBinding

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMapBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // WebView 설정
        binding.webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            allowFileAccess = true
        }

        // WebViewClient 설정
        binding.webView.webViewClient = WebViewClient()

        // WebChromeClient 설정
        binding.webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.d("WebView", "Console: ${consoleMessage.message()}")
                return true
            }
        }

        // HTML 파일 로드
        binding.webView.loadUrl("file:///android_asset/vworld_map.html")
    }
}