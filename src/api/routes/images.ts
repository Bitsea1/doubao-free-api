import _ from 'lodash';

import Request from '@/lib/request/Request.ts';
import Response from '@/lib/response/Response.ts';
import images from '@/api/controllers/images.ts';

// 定义图片生成请求体的类型（可选，增强类型提示）
interface ImageCompletionRequestBody {
    model: string;
    prompt: string;
    ratio: string;
    style: string;
    stream: boolean;
}

export default {
    // 接口前缀
    prefix: '/v1/images',

    // POST请求路由
    post: {
        /**
         * 文生图生成接口
         * 路径：/v1/images/generations
         * 请求体：{model, prompt, ratio, style, stream}
         */
        '/generations': async (request: Request) => {
            // 1. 扩展参数校验：image为可选字符串（URL/Base64）
            request
                .validate('body.model', _.isString)
                .validate('body.prompt', _.isString)
                .validate('body.ratio', _.isString)
                .validate('body.style', _.isString)
                .validate('body.stream', _.isBoolean)
                .validate('headers.authorization', _.isString)
                .validate('body.image', (v) => _.isUndefined(v) || _.isString(v)); // 参考图为可选字符串

            // 2. 处理Token
            const tokens = images.tokenSplit(request.headers.authorization);
            const token = _.sample(tokens);
            if (!token) {
                throw new Error('无效的Authorization Token');
            }

            // 3. 解构参数：新增image字段
            const {
                model,
                prompt,
                ratio,
                style,
                stream,
                image: referenceImage
            } = request.body as ImageCompletionRequestBody & { image?: string };

            // 4. 处理智能体ID
            const assistantId = /^[a-z0-9]{24,}$/.test(model) ? model : undefined;

            // 5. 组装参数：传递参考图
            const imageParams = {
                model,
                prompt,
                ratio,
                style,
                referenceImage // 新增参考图字段
            };

            // 6. 调用生成方法（传递referenceImage）
            if (stream) {
                const s = await images.createImageCompletionStream(imageParams, token, assistantId);
                return new Response(s, {
                    type: "text/event-stream",
                    headers: {
                        "Cache-Control": "no-cache, no-transform",
                        "Connection": "keep-alive",
                        "X-Accel-Buffering": "no"
                    }
                });
            } else {
                const result = await images.createImageCompletion(imageParams, token, assistantId);
                return new Response(result);
            }
        }
    }
};
