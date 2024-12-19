package com.example.teamproject

import android.content.Context
import java.io.InputStream
import java.security.KeyStore
import java.security.SecureRandom
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManagerFactory
import javax.net.ssl.X509TrustManager

class SelfSigningHelper(context: Context) {
    lateinit var tmf: TrustManagerFactory
    lateinit var sslContext: SSLContext

    init {
        try {
            val cf = CertificateFactory.getInstance("X.509")
            val ca: Certificate

            // 인증서 파일 로드
            context.resources.openRawResource(R.raw.safemap_go_kr).use { caInput ->
                ca = cf.generateCertificate(caInput)
            }

            // KeyStore 초기화
            val keyStore = KeyStore.getInstance(KeyStore.getDefaultType()).apply {
                load(null, null)
                setCertificateEntry("ca", ca)
            }

            // TrustManager 초기화
            tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm()).apply {
                init(keyStore)
            }

            // SSLContext 설정
            sslContext = SSLContext.getInstance("TLS").apply {
                init(null, tmf.trustManagers, SecureRandom())
            }

        } catch (e: Exception) {
            throw RuntimeException("Failed to initialize SSLContext", e)
        }
    }
}
