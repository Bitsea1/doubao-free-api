# Doubao AI Free 服务

[![](https://img.shields.io/github/license/llm-red-team/doubao-free-api.svg)](LICENSE)
![](https://img.shields.io/github/stars/llm-red-team/doubao-free-api.svg)
![](https://img.shields.io/github/forks/llm-red-team/doubao-free-api.svg)
![](https://img.shields.io/docker/pulls/vinlic/doubao-free-api.svg)

支持高速流式输出、支持多轮对话、支持联网搜索、支持文生图（已支持）、支持图生图（已支持）、支持图文解读（已支持），零配置部署，多路token支持，自动清理会话痕迹。

与OpenAI接口完全兼容。

## 目录

* [免责声明](#免责声明)
* [接入准备](#接入准备)
  * [智能体接入](#智能体接入)
  * [多账号接入](#多账号接入)
* [Docker部署](#Docker部署)
  * [Docker-compose部署](#Docker-compose部署)
* [Render部署](#Render部署)
* [Vercel部署](#Vercel部署)
* [原生部署](#原生部署)
* [推荐使用客户端](#推荐使用客户端)
* [接口列表](#接口列表)
  * [对话补全](#对话补全)
  * [图文对话补全](#图文对话补全)
  * [文生图](#文生图)
  * [图生图](#图生图)
  * [sessionid存活检测](#sessionid存活检测)
* [注意事项](#注意事项)
  * [Nginx反代优化](#Nginx反代优化)
  * [Token统计](#Token统计)
* [Star History](#star-history)
  
## 免责声明

**逆向API是不稳定的，建议前往火山引擎官方 https://www.volcengine.com/product/doubao 付费使用API，避免封禁的风险。**

**本组织和个人不接受任何资金捐助和交易，此项目是纯粹研究交流学习性质！**

**仅限自用，禁止对外提供服务或商用，避免对官方造成服务压力，否则风险自担！**

**仅限自用，禁止对外提供服务或商用，避免对官方造成服务压力，否则风险自担！**

**仅限自用，禁止对外提供服务或商用，避免对官方造成服务压力，否则风险自担！**

## 接入准备

从 [豆包](https://www.doubao.com/) 获取sessionid

进入豆包登录账号，然后F12打开开发者工具，从Application > Cookies中找到`sessionid`的值，这将作为Authorization的Bearer Token值：`Authorization: Bearer sessionid`

![example0](./doc/example-0.png)

### 多账号接入

你可以通过提供多个账号的sessionid并使用`,`拼接提供：

`Authorization: Bearer sessionid1,sessionid2,sessionid3`

每次请求服务会从中挑选一个。

## Docker部署

请准备一台具有公网IP的服务器并将8000端口开放。

拉取镜像并启动服务

```shell
docker run -it -d --init --name doubao-free-api -p 8000:8000 -e TZ=Asia/Shanghai vinlic/doubao-free-api:latest
```

查看服务实时日志

```shell
docker logs -f doubao-free-api
```

重启服务

```shell
docker restart doubao-free-api
```

停止服务

```shell
docker stop doubao-free-api
```

### Docker-compose部署

```yaml
version: '3'

services:
  doubao-free-api:
    container_name: doubao-free-api
    image: bitsea19/doubao-free-api:latest
    restart: always
    ports:
      - "8000:8000"
    environment:
      - TZ=Asia/Shanghai
```

### Render部署

**注意：部分部署区域可能无法连接豆包，如容器日志出现请求超时或无法连接，请切换其他区域部署！**
**注意：免费账户的容器实例将在一段时间不活动时自动停止运行，这会导致下次请求时遇到50秒或更长的延迟，建议查看[Render容器保活](https://github.com/LLM-Red-Team/free-api-hub/#Render%E5%AE%B9%E5%99%A8%E4%BF%9D%E6%B4%BB)**

1. fork本项目到你的github账号下。

2. 访问 [Render](https://dashboard.render.com/) 并登录你的github账号。

3. 构建你的 Web Service（New+ -> Build and deploy from a Git repository -> Connect你fork的项目 -> 选择部署区域 -> 选择实例类型为Free -> Create Web Service）。

4. 等待构建完成后，复制分配的域名并拼接URL访问即可。

### Vercel部署

**注意：Vercel免费账户的请求响应超时时间为10秒，但接口响应通常较久，可能会遇到Vercel返回的504超时错误！**

请先确保安装了Node.js环境。

```shell
npm i -g vercel --registry http://registry.npmmirror.com
vercel login
git clone https://github.com/Bitsea1/doubao-free-api
cd doubao-free-api
vercel --prod
```

## 原生部署

请准备一台具有公网IP的服务器并将8000端口开放。

请先安装好Node.js环境并且配置好环境变量，确认node命令可用。

安装依赖

```shell
npm i
```

安装PM2进行进程守护

```shell
npm i -g pm2
```

编译构建，看到dist目录就是构建完成

```shell
npm run build
```

启动服务

```shell
pm2 start dist/index.js --name "doubao-free-api"
```

查看服务实时日志

```shell
pm2 logs doubao-free-api
```

重启服务

```shell
pm2 reload doubao-free-api
```

停止服务

```shell
pm2 stop doubao-free-api
```

## 推荐使用客户端

使用以下二次开发客户端接入free-api系列项目更快更简单，支持文档/图像上传！

由 [Clivia](https://github.com/Yanyutin753/lobe-chat) 二次开发的LobeChat [https://github.com/Yanyutin753/lobe-chat](https://github.com/Yanyutin753/lobe-chat)

由 [时光@](https://github.com/SuYxh) 二次开发的ChatGPT Web [https://github.com/SuYxh/chatgpt-web-sea](https://github.com/SuYxh/chatgpt-web-sea)

## 接口列表

目前支持与openai兼容的 `/v1/chat/completions` 接口，可自行使用与openai或其他兼容的客户端接入接口，或者使用 [dify](https://dify.ai/) 等线上服务接入使用。

### 对话补全

对话补全接口，与openai的 [chat-completions-api](https://platform.openai.com/docs/guides/text-generation/chat-completions-api) 兼容。

**POST /v1/chat/completions**

header 需要设置 Authorization 头部：

```
Authorization: Bearer [sessionid]
```

请求数据：
```json
{
    // 固定使用doubao
    "model": "doubao",
    // 目前多轮对话基于消息合并实现，某些场景可能导致能力下降且受单轮最大token数限制
    // 如果您想获得原生的多轮对话体验，可以传入首轮消息获得的id，来接续上下文
    // "conversation_id": "397193850580994",
    "messages": [
        {
            "role": "user",
            "content": "你叫什么？"
        }
    ],
    // 如果使用SSE流请设置为true，默认false
    "stream": false
}
```

响应数据：
```json
{
    // 如果想获得原生多轮对话体验，此id，你可以传入到下一轮对话的conversation_id来接续上下文
    "id": "397193850645250",
    "model": "doubao",
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "我叫豆包呀，能陪你聊天、帮你答疑解惑呢。"
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
### 图文对话补全
图文对话补全接口，与openai的 [chat-completions-api](https://platform.openai.com/docs/guides/text-generation/chat-completions-api) 兼容。

**POST /v1/chat/completions**

✨ 图文功能：支持发送图片进行多模态对话！

**请求数据（图片请求）：**
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

**请求数据（Base64请求）：**
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

### 兼容格式：
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

**响应数据**：
```json
{
    // 如果想获得原生多轮对话体验，此id，你可以传入到下一轮对话的conversation_id来接续上下文
    "id": "397193850645250",
    "model": "doubao",
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "我叫豆包呀，能陪你聊天、帮你答疑解惑呢。"
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

### 文生图

**POST** `/v1/images/generations`

**请求参数**:
```json
{
    "model": "Seedream 4.0", //模型
    "prompt": "机器猫", //提示词
    "ratio": "1:1", //比例
    "style": "卡通", //风格
    "stream": false //流式输出
}
```

**响应数据**：
```json
{
    "id": "30868724412460802",
    "model": "Seedream 4.0",
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "我将根据参考图生成一张1:1比例的卡通风格图片。\n\n以下是为你生成的图片：\n",
                "images": [
                    "https://p3-flow-imagex-sign/1.jpg",
                ]
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 1,
        "completion_tokens": 1,
        "total_tokens": 2
    },
    "created": 1763985148
}
```

### 图生图

**POST** `/v1/images/generations`

**请求参数**:
```json
{
    "model": "Seedream 4.0", //模型
    "prompt": "机器猫", //提示词
    "image": "https://example.com/image.jpg",
    "ratio": "1:1", //比例
    "style": "卡通", //风格
    "stream": false //流式输出
}
```

**响应数据**：
```json
{
    "id": "30868724412460802",
    "model": "Seedream 4.0",
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "我将根据参考图生成一张1:1比例的卡通风格图片。以下是为你生成的图片：",
                "images": [
                    "https://p3-flow-imagex-sign/1.jpg",
                ]
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 1,
        "completion_tokens": 1,
        "total_tokens": 2
    },
    "created": 1763985148
}
```

### sessionid存活检测

检测sessionid是否存活，如果存活live未true，否则为false，请不要频繁（小于10分钟）调用此接口。

**POST /token/check**

请求数据：
```json
{
    "token": "6750e5af32eb15976..."
}
```

响应数据：
```json
{
    "live": true
}
```

## 注意事项

### Nginx反代优化

如果您正在使用Nginx反向代理doubao-free-api，请添加以下配置项优化流的输出效果，优化体验感。

```nginx
# 关闭代理缓冲。当设置为off时，Nginx会立即将客户端请求发送到后端服务器，并立即将从后端服务器接收到的响应发送回客户端。
proxy_buffering off;
# 启用分块传输编码。分块传输编码允许服务器为动态生成的内容分块发送数据，而不需要预先知道内容的大小。
chunked_transfer_encoding on;
# 开启TCP_NOPUSH，这告诉Nginx在数据包发送到客户端之前，尽可能地发送数据。这通常在sendfile使用时配合使用，可以提高网络效率。
tcp_nopush on;
# 开启TCP_NODELAY，这告诉Nginx不延迟发送数据，立即发送小数据包。在某些情况下，这可以减少网络的延迟。
tcp_nodelay on;
# 设置保持连接的超时时间，这里设置为120秒。如果在这段时间内，客户端和服务器之间没有进一步的通信，连接将被关闭。
keepalive_timeout 120;
```

### Token统计

由于推理侧不在doubao-free-api，因此token不可统计，将以固定数字返回。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=LLM-Red-Team/doubao-free-api&type=Date)](https://star-history.com/#LLM-Red-Team/doubao-free-api&Date)
