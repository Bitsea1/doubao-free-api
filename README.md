# 豆包 Free API - 增强版

[![](https://img.shields.io/github/license/1994qrq/2025doubao-free-api.svg)](LICENSE)
![](https://img.shields.io/github/stars/1994qrq/2025doubao-free-api.svg)
![](https://img.shields.io/github/forks/1994qrq/2025doubao-free-api.svg)

---

## 🎁 推荐服务器

**部署本项目推荐使用阿里云服务器**

🔥 **限时优惠**：200M 带宽 + 不限速 + 不限流量，仅需 **79元/年**！

👉 [**点击购买阿里云服务器（专属优惠链接）**](https://www.aliyun.com/minisite/goods?userCode=d3mvo2j1)

- ✅ 200M 超大带宽
- ✅ 不限速、不限流量
- ✅ 稳定可靠，适合部署各类应用
- ✅ 新用户专享优惠价

---

🚀 **增强版特性**：在原版基础上修复问题并新增**图文对话**功能！

## ✨ 核心特性

- ✅ **图文对话支持**：支持发送图片进行多模态对话（新增）
- ✅ **高速流式输出**：实时响应，流畅体验
- ✅ **多轮对话**：支持上下文连续对话
- ✅ **OpenAI 兼容**：完全兼容 OpenAI API 格式
- ✅ **多账号支持**：支持多个 sessionid 轮询使用
- ✅ **零配置部署**：开箱即用，无需复杂配置
- ✅ **自动清理**：自动清理会话痕迹

📖 **[查看详细使用文档](./docs/USAGE_CN.md)** - 包含 Python、Node.js、cURL 等完整示例

## 📋 目录

* [免责声明](#免责声明)
* [快速开始](#快速开始)
  * [获取 SessionID](#获取-sessionid)
  * [多账号接入](#多账号接入)
* [部署方式](#部署方式)
* [接口使用](#接口使用)
  * [文本对话](#文本对话)
  * [图文对话（新增）](#图文对话新增)
  * [流式输出](#流式输出)
  * [SessionID 存活检测](#sessionid-存活检测)
* [测试脚本](#测试脚本)
* [注意事项](#注意事项)
  * [Nginx 反代优化](#nginx-反代优化)
  * [Token 统计](#token-统计)

---

## ⚠️ 免责声明

**本项目仅供学习研究使用，请勿用于商业用途！**

- 逆向 API 存在不稳定性，建议前往 [火山引擎官方](https://www.volcengine.com/product/doubao) 付费使用正式 API
- 本项目不接受任何资金捐助和交易
- **仅限个人学习使用，禁止对外提供服务或商用**
- 使用本项目产生的任何后果由使用者自行承担

---

## 🚀 快速开始

### 获取 SessionID

1. 访问 [豆包官网](https://www.doubao.com/) 并登录账号
2. 按 `F12` 打开浏览器开发者工具
3. 进入 `Application` > `Cookies` > `https://www.doubao.com`
4. 找到 `sessionid` 字段，复制其值

![获取SessionID示例](./doc/example-0.png)

### 多账号接入

支持多个账号轮询使用，使用逗号分隔多个 sessionid：

```
Authorization: Bearer sessionid1,sessionid2,sessionid3
```

每次请求会自动从中随机选择一个可用的 sessionid。

---

## 📦 部署方式

**环境要求**：Node.js 16+

### 1. 克隆项目

```bash
git clone https://github.com/1994qrq/2025doubao-free-api.git
cd 2025doubao-free-api
```

### 2. 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

### 3. 编译构建

```bash
npm run build
```

构建完成后会生成 `dist` 目录。

### 4. 启动服务

**方式一：直接启动**

```bash
npm start
```

**方式二：使用 PM2（推荐生产环境）**

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start dist/index.js --name "doubao-free-api"

# 查看日志
pm2 logs doubao-free-api

# 重启服务
pm2 reload doubao-free-api

# 停止服务
pm2 stop doubao-free-api
```

服务默认运行在 `http://localhost:8000`

---

## 🔌 接口使用

本项目完全兼容 OpenAI API 格式，可以直接使用 OpenAI SDK 或其他兼容客户端（如 [Dify](https://dify.ai/)）接入。

### 文本对话

**接口地址**：`POST /v1/chat/completions`

**请求头**：

```http
Authorization: Bearer YOUR_SESSION_ID
Content-Type: application/json
```

**请求示例**：

```json
{
  "model": "doubao",
  "messages": [
    {
      "role": "user",
      "content": "你好，请介绍一下你自己"
    }
  ],
  "stream": false
}
```

**响应示例**：

```json
{
  "id": "397193850645250",
  "model": "doubao",
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "我叫豆包，是字节跳动开发的AI助手，可以帮你解答问题、提供建议等。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1,
    "completion_tokens": 1,
    "total_tokens": 2
  },
  "created": 1733300587
}
```

---

### 图文对话（新增）

**✨ 本版本新增功能**：支持发送图片进行多模态对话！

**支持的图片格式**：
- 图片 URL（http/https）
- Base64 编码的图片数据

**请求示例 1：使用图片 URL**

```json
{
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
  ],
  "stream": false
}
```

**请求示例 2：使用 Base64 图片**

```json
{
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
}
```

**兼容格式**：

本项目支持多种图片字段格式，以下格式均可使用：

```json
// 格式 1: image_url（OpenAI 标准格式）
{
  "type": "image_url",
  "image_url": {
    "url": "https://example.com/image.jpg"
  }
}

// 格式 2: image
{
  "type": "image",
  "image_url": "https://example.com/image.jpg"
}

// 格式 3: file
{
  "type": "file",
  "file_url": {
    "url": "https://example.com/image.jpg"
  }
}
```

---

### 流式输出

设置 `"stream": true` 启用流式响应：

```json
{
  "model": "doubao",
  "messages": [
    {
      "role": "user",
      "content": "写一首诗"
    }
  ],
  "stream": true
}
```

流式响应使用 Server-Sent Events (SSE) 格式。

---

### SessionID 存活检测

**接口地址**：`POST /token/check`

**请求示例**：

```json
{
  "token": "your_session_id_here"
}
```

**响应示例**：

```json
{
  "live": true
}
```

⚠️ **注意**：请勿频繁调用此接口（建议间隔 > 10 分钟）

---

## 🧪 测试脚本

项目提供了测试脚本，位于 `scripts/send_image_test.js`。

### 使用方法

```bash
# 设置环境变量
export SESSION_ID="your_session_id_here"
export API_BASE="http://127.0.0.1:8000"
export IMAGE_URL="https://example.com/your-image.jpg"

# 运行测试
node scripts/send_image_test.js
```

### 测试脚本说明

该脚本演示了如何：
- 发送文本消息
- 发送图片 URL
- 处理 API 响应

你可以根据需要修改脚本来测试不同的场景。

---

## 📝 注意事项

### Nginx 反代优化

如果使用 Nginx 反向代理，建议添加以下配置以优化流式输出：

```nginx
# 关闭代理缓冲
proxy_buffering off;

# 启用分块传输编码
chunked_transfer_encoding on;

# 优化 TCP 传输
tcp_nopush on;
tcp_nodelay on;

# 设置连接超时
keepalive_timeout 120;
```

### Token 统计

由于推理在豆包服务端进行，token 数量无法精确统计，API 返回的 token 数为固定值，仅供参考。

### 图片上传限制

- 单个图片最大支持 100MB
- 支持的图片格式：PNG、JPEG、GIF、WebP
- 图片会自动上传到豆包的存储服务

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

本项目基于 ISC 协议开源。

---

## 🙏 致谢

本项目基于 [LLM-Red-Team/doubao-free-api](https://github.com/LLM-Red-Team/doubao-free-api) 进行修复和增强。

---

## ⭐ Star History

如果这个项目对你有帮助，欢迎给个 Star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=1994qrq/2025doubao-free-api&type=Date)](https://star-history.com/#1994qrq/2025doubao-free-api&Date)
