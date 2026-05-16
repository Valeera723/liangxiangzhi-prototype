# 两相知 DeepSeek 代理说明

原型前端不会保存或暴露 DeepSeek API Key，仓库也不保存任何真实 Key。要让“合参成签”真实调用模型，请每次演示时在本地终端临时启动代理：

```bash
DEEPSEEK_API_KEY="你的 DeepSeek Key" node prototype/deepseek-proxy.mjs
```

默认接口：

- 前端请求：`http://127.0.0.1:8787/api/deepseek`
- 上游接口：`https://api.deepseek.com/chat/completions`
- 默认模型：`deepseek-v4-pro`

可选覆盖：

```bash
PORT=8788 DEEPSEEK_MODEL="deepseek-v4-pro" DEEPSEEK_API_KEY="你的 DeepSeek Key" node prototype/deepseek-proxy.mjs
```

如果换端口，需要在浏览器控制台执行：

```js
window.LIANGXIANGZHI_API_URL = "http://127.0.0.1:8788/api/deepseek";
```

发送给 LLM 的内容只包括：

- 双相面相术语摘要与非身份化测量分值。
- 关系类型。
- 用户输入的问题与需求。
- 关系问诊回答。

不会发送原始照片、MediaPipe 原始点阵、人脸模板或可还原身份的特征。

演示结束后直接关闭代理进程即可；不要把 Key 写入项目文件或提交到 GitHub。
