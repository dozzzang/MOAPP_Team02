package com.example.teamproject

class Message {
    var message: String? = null
    var sentBy: String? = null

    constructor(message: String?, sentBy: String?) {
        this.message = message
        this.sentBy = sentBy
    }

    constructor()

    companion object {
        var SENT_BY_ME: String = "me"
        var SENT_BY_BOT: String = "bot"
    }
}