# 两相知原型

一个面向抖音小程序方向的关系合参原型。流程为：上传甲乙两张照片，浏览器本地完成面部点阵取象，先生成双相小记和 FBTI 面相人格类型，再根据关系类型、用户卡点和可选问诊回答生成合参建议。

## 项目结构

- `prototype/index.html`：静态交互原型，直接打开即可预览。
- `prototype/deepseek-proxy.mjs`：本地 DeepSeek 代理，避免在前端暴露 API Key。
- `prototype/README-deepseek.md`：DeepSeek 代理启动说明。
- `assets/`：水墨古图与视觉素材。
- `two-xiangzhi-prd.md`：产品方案与合规边界。
- `generation-playbook.md`：面相取象、面相人格和合参生成逻辑手册。
- `CODEX_HANDOFF.md`：给后续 Codex/同事继续开发的接力说明。

## 本地预览

最简单方式：

```bash
open prototype/index.html
```

如果右侧 Preview 更适合访问本地服务，可以在仓库根目录运行：

```bash
python3 -m http.server 5173
```

然后打开：

```text
http://127.0.0.1:5173/prototype/index.html
```

## 启用 DeepSeek 合参

快速面相合参不调用大模型。只有用户选择回答问诊题后，才会请求本地代理。

仓库不保存任何 DeepSeek API Key。每次演示都在本地终端临时传入新的 Key：

```bash
DEEPSEEK_API_KEY="你的 DeepSeek Key" node prototype/deepseek-proxy.mjs
```

前端默认请求：

```text
http://127.0.0.1:8787/api/deepseek
```

不要把真实 API Key 写入任何项目文件，也不要提交 `.env`。

## 重要边界

- 不做身份识别、人脸库比对、颜值评分、人格定论、命运判断。
- 照片只用于本次娱乐化相学象意解析，不长期保存。
- 面相输出只描述眉、眼、鼻、口、颌等走势和象意，不贬低个人。
- 合参建议使用“象意/倾向/可能卡点”语气，不输出决定性关系结论。
- 对明星/公众人物关系，只给边界、情绪安放和理性支持建议。

## 当前版本重点

- 中国风水墨界面。
- 进入页竖排古籍引文与古图。
- 本地面部点阵识别动效。
- 双相小记：古法术语 + 实测入相。
- FBTI 面相人格：以五官识别结果匹配幽默但不贬低的相格人格。
- 匹配人物只作为象意参照，不作真实长相或人格断言。
- 关系类型固定为：情侣、上下级、伙伴、明星、暧昧、同事（同门）。
- 用户可选择快速合参，或回答选择题后调用 DeepSeek 合参。
