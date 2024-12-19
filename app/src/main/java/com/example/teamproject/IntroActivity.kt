package com.example.teamproject

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.teamproject.databinding.ActivityIntroBinding
import com.example.teamproject.databinding.ActivityMainBinding

class IntroActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityIntroBinding.inflate(layoutInflater)
        setContentView(binding.root)
        window.statusBarColor = Color.parseColor("#B8660E")

        binding.startbtn.setOnClickListener {
            // MainActivity 메인화면으로 이동
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }
    }
}