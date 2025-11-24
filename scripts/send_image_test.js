import axios from "axios";

// Configuration
const API_BASE = process.env.API_BASE || "http://127.0.0.1:8000";
const SESSION_ID = process.env.SESSION_ID || "YOUR_SESSION_ID_HERE";
// Use external image URL to avoid base64 issues
const IMAGE_URL = process.env.IMAGE_URL ||
  "https://picsum.photos/800/600"; 

async function main() {
  const messages = [
    { role: "user", content: "你好，豆包！现在几点？" }
  ];

  const payload = { model: "doubao", messages, stream: false };
  const headers = {
    Authorization: `Bearer ${SESSION_ID}`,
    "Content-Type": "application/json",
  };

  const { data, status } = await axios.post(
    `${API_BASE}/v1/chat/completions`,
    payload,
    { headers, timeout: 300000 }
  );

  console.log("HTTP", status);
  console.log(JSON.stringify(data, null, 2));
  const answer = data?.choices?.[0]?.message?.content;
  if (answer) console.log("Answer:", answer);
}

main().catch((err) => {
  console.error("Request failed:", err?.response?.status, err?.response?.data || err?.message);
  process.exit(1);
});


