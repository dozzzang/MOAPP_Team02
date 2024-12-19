package com.example.teamproject

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.text.Html
import android.view.MenuItem
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
    }

}