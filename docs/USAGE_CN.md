# 使用指南

## 目录

- [基础使用](#基础使用)
- [图文对话示例](#图文对话示例)
- [Python 示例](#python-示例)
- [Node.js 示例](#nodejs-示例)
- [cURL 示例](#curl-示例)
- [常见问题](#常见问题)

---

## 基础使用

### 1. 获取 SessionID

1. 访问 [豆包官网](https://www.doubao.com/)
2. 登录你的账号
3. 按 F12 打开开发者工具
4. 进入 Application > Cookies
5. 找到 `sessionid` 并复制

### 2. 启动服务

```bash
npm install
npm run build
npm start
```

服务将在 `http://localhost:8000` 启动。

---

## 图文对话示例

### 使用图片 URL

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_ID" \
  -d '{
    "model": "doubao",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "这张图片里有什么？"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/image.jpg"
            }
          }
        ]
      }
    ]
  }'
```

### 使用 Base64 图片

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_ID" \
  -d '{
    "model": "doubao",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "请描述这张图片"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            }
          }
        ]
      }
    ]
  }'
```

---

## Python 示例

### 安装依赖

```bash
pip install openai
```

### 文本对话

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_SESSION_ID",
    base_url="http://localhost:8000/v1"
)

response = client.chat.completions.create(
    model="doubao",
    messages=[
        {"role": "user", "content": "你好，请介绍一下你自己"}
    ]
)

print(response.choices[0].message.content)
```

### 图文对话

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_SESSION_ID",
    base_url="http://localhost:8000/v1"
)

response = client.chat.completions.create(
    model="doubao",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "这张图片里有什么？"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/image.jpg"
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

### 流式输出

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_SESSION_ID",
    base_url="http://localhost:8000/v1"
)

stream = client.chat.completions.create(
    model="doubao",
    messages=[
        {"role": "user", "content": "写一首关于春天的诗"}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

---

## Node.js 示例

### 安装依赖

```bash
npm install axios
```

### 文本对话

```javascript
const axios = require('axios');

async function chat() {
  const response = await axios.post('http://localhost:8000/v1/chat/completions', {
    model: 'doubao',
    messages: [
      { role: 'user', content: '你好，请介绍一下你自己' }
    ]
  }, {
    headers: {
      'Authorization': 'Bearer YOUR_SESSION_ID',
      'Content-Type': 'application/json'
    }
  });

  console.log(response.data.choices[0].message.content);
}

chat();
```

### 图文对话

```javascript
const axios = require('axios');

async function chatWithImage() {
  const response = await axios.post('http://localhost:8000/v1/chat/completions', {
    model: 'doubao',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '这张图片里有什么？'
          },
          {
            type: 'image_url',
            image_url: {
              url: 'https://example.com/image.jpg'
            }
          }
        ]
      }
    ]
  }, {
    headers: {
      'Authorization': 'Bearer YOUR_SESSION_ID',
      'Content-Type': 'application/json'
    }
  });

  console.log(response.data.choices[0].message.content);
}

chatWithImage();
```

---

## cURL 示例

### 文本对话

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_ID" \
  -d '{
    "model": "doubao",
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }'
```

### 流式输出

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_ID" \
  -d '{
    "model": "doubao",
    "messages": [
      {
        "role": "user",
        "content": "写一首诗"
      }
    ],
    "stream": true
  }'
```

---

## 常见问题

### Q: SessionID 在哪里获取？

A: 登录豆包官网后，在浏览器开发者工具的 Cookies 中找到 `sessionid` 字段。

### Q: 支持哪些图片格式？

A: 支持 PNG、JPEG、GIF、WebP 格式，单个图片最大 100MB。

### Q: 可以同时发送多张图片吗？

A: 可以，在 `content` 数组中添加多个 `image_url` 对象即可。

### Q: SessionID 会过期吗？

A: 会的，过期后需要重新登录豆包官网获取新的 SessionID。

### Q: 如何使用多个账号？

A: 在 Authorization 头中使用逗号分隔多个 SessionID：
```
Authorization: Bearer sessionid1,sessionid2,sessionid3
```

### Q: 图片上传失败怎么办？

A: 检查：
1. 图片 URL 是否可访问
2. 图片大小是否超过 100MB
3. 图片格式是否支持
4. SessionID 是否有效

### Q: 可以部署到公网吗？

A: 可以，但请注意：
1. 仅供个人学习使用
2. 不要对外提供服务
3. 注意服务器安全配置

---

## 更多示例

查看 `scripts/send_image_test.js` 获取完整的测试示例。

