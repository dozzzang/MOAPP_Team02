package com.example.teamproject

import android.R
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.teamproject.databinding.ActivityChatBinding
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import org.json.JSONException
import org.json.JSONObject
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.Request
import okhttp3.Response
import org.json.JSONArray
import java.io.IOException


class ChatActivity : AppCompatActivity() {

    private lateinit var binding: ActivityChatBinding
    private val messageList: MutableList<Message> = mutableListOf()
    private lateinit var messageAdapter: MessageAdapter
    private val client: OkHttpClient = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.recyclerView.setHasFixedSize(true)
        val manager = LinearLayoutManager(this).apply { stackFromEnd = true }
        binding.recyclerView.layoutManager = manager

        messageAdapter = MessageAdapter(messageList)
        binding.recyclerView.adapter = messageAdapter

        binding.btnSend.setOnClickListener {
            val question = binding.etMsg.text.toString().trim()
            if (question.isNotEmpty()) {
                addToChat(question, Message.SENT_BY_ME)
                binding.etMsg.text.clear()
                callAPI(question)
                binding.tvWelcome.visibility = View.GONE
            }
        }
    }

    private fun addToChat(message: String, sentBy: String) {
        runOnUiThread {
            messageList.add(Message(message, sentBy))
            messageAdapter.notifyDataSetChanged()
            binding.recyclerView.smoothScrollToPosition(messageAdapter.itemCount - 1)
        }
    }

    private fun addResponse(response: String) {
        runOnUiThread {
            if (messageList.isNotEmpty() && messageList.last().sentBy == Message.SENT_BY_BOT && messageList.last().message == "답변 작성 중...") {
                messageList.removeAt(messageList.size - 1)
            }
            addToChat(response, Message.SENT_BY_BOT)
        }
    }

    private fun callAPI(question: String) {
        messageList.add(Message("답변 작성 중...", Message.SENT_BY_BOT))

        val messages = JSONArray().apply {
            put(JSONObject().apply {
                put("role", "system")
                put("content", "당신은 따뜻하고 공감적인 상담자입니다. 피해자가 힘들었던 상황을 털어놓을 때, 위로의 말을 건네고 그들의 감정을 있는 그대로 존중해주세요. 피해자가 위로받고 안전함을 느낄 수 있도록 도와주세요.너무 길게 말하지 마세요.")
            })
            put(JSONObject().apply {
                put("role", "user")
                put("content", question)
            })
        }

        val requestBody = JSONObject().apply {
            put("model", "gpt-4")
            put("messages", messages)
        }.toString()

        val body = RequestBody.create(JSON, requestBody)
        val request = Request.Builder()
            .url("https://api.openai.com/v1/chat/completions")
            .header("Authorization", "Bearer $MY_SECRET_KEY")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                addResponse("Failed to load response due to ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    try {
                        val responseBody = response.body?.string() ?: ""
                        val jsonObject = JSONObject(responseBody)
                        val result = jsonObject.getJSONArray("choices")
                            .getJSONObject(0)
                            .getJSONObject("message")
                            .getString("content")
                        addResponse(result.trim())
                    } catch (e: JSONException) {
                        addResponse("Error parsing response")
                        e.printStackTrace()
                    }
                } else {
                    addResponse("Failed to load response: ${response.body?.string()}")
                }
            }
        })
    }

    companion object {
        val JSON: MediaType = "application/json; charset=utf-8".toMediaType()
        private const val MY_SECRET_KEY = "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"
    }
}
