const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const port = 3000;
// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../src/main/assets")));
// 루트 경로 처리
app.get("/", (req, res) => {
  console.log(`[INFO] GET request to /`);
  res.sendFile(path.join(__dirname, "../src/main/assets/vworld_map.html"));
});
// 프록시 엔드포인트
app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  console.log(`[INFO] GET request to /proxy with URL: ${url}`);
  if (!url) {
    console.error(`[ERROR] Missing 'url' query parameter`);
    return res.status(400).send("Missing 'url' query parameter");
  }
  try {
    const response = await axios.get(url, { responseType: "text" });
    console.log(`[SUCCESS] Proxied request to: ${url}`);
    console.log(`[DATA] Response from target: ${response.data}`); // 반환된 데이터 출력
    res.send(response.data);
  } catch (error) {
    console.error(`[ERROR] Proxy request failed for URL: ${url}`);
    console.error(error.message);
    res.status(500).send("Proxy request failed");
  }
});
 // 서버 시작
 app.listen(port, () => {
   console.log(`Proxy server running at http://localhost:${port}`);
 });