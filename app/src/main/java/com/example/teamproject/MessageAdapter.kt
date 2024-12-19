package com.example.teamproject

import android.R
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.teamproject.databinding.ChatItemBinding


class MessageAdapter(private var messageList: List<Message>) :
    RecyclerView.Adapter<MessageAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ChatItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val message = messageList[position]
        with(holder.binding) {
            if (message.sentBy == Message.SENT_BY_ME) {
                leftChatView.visibility = View.GONE
                rightChatView.visibility = View.VISIBLE
                rightChatTv.text = message.message
            } else {
                rightChatView.visibility = View.GONE
                leftChatView.visibility = View.VISIBLE
                leftChatTv.text = message.message
            }
        }
    }

    override fun getItemCount(): Int {
        return messageList.size
    }

    inner class ViewHolder(val binding: ChatItemBinding) : RecyclerView.ViewHolder(binding.root)
}