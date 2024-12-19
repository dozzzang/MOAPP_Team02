package com.example.teamproject

import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.text.Html
import android.view.MenuItem
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.teamproject.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.parseColor("#B8660E")
        val binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        // 툴바 초기화
        setSupportActionBar(binding.toolbar)
        supportActionBar?.title=""

        binding.chatbtn.setOnClickListener {
            val intent = Intent(this, ChatActivity::class.java)
            startActivity(intent)
        }
        binding.mapbtn.setOnClickListener {
            val intent = Intent(this, MapActivity::class.java)
            startActivity(intent)
        }
        binding.callbtn.setOnClickListener {
            try {
                // 전화 다이얼 화면을 여는 Intent 생성
                val intent = Intent(Intent.ACTION_DIAL).apply {
                    data = Uri.parse("tel:112")
                }

                // 이 Intent를 처리할 수 있는 앱이 있는지 확인
                val packageManager = packageManager
                val activities = packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)

                if (activities.isNotEmpty()) {
                    // 처리할 앱이 있다면 다이얼 화면을 열기
                    startActivity(intent)
                } else {
                    // 처리할 앱이 없다면 사용자에게 알림
                    showNoDialerAppToast()
                }
            } catch (e: Exception) {
                // 예외가 발생하면 사용자에게 알림
                showNoDialerAppToast()
            }
        }
    }
    private fun showNoDialerAppToast() {
        Toast.makeText(this, "전화 다이얼을 처리할 수 있는\n앱이 없습니다.", Toast.LENGTH_LONG).show()
    }

}
