# Codex 接力说明

这份说明给下一位同事和她的 Codex 使用。目标是让她 clone 仓库后，可以直接在右侧 Preview 辅助下继续迭代。

## 1. 给同事 Codex 的复制指令

把下面这段整体复制给 Codex：

```text
请你接手这个 GitHub 仓库继续开发《两相知》原型。

仓库地址：https://github.com/Valeera723/liangxiangzhi-prototype.git

请按以下方式开始：
1. 先 clone 仓库并阅读 README.md、CODEX_HANDOFF.md、two-xiangzhi-prd.md、generation-playbook.md。
2. 打开 prototype/index.html 作为主要原型页面；如果 Preview 不能直接打开 file 页面，就在仓库根目录运行 python3 -m http.server 5173，然后在右侧 Preview 打开 http://127.0.0.1:5173/prototype/index.html。
3. 当前原型是静态 HTML/CSS/JS，不需要 npm install。
4. 如果要测试大模型合参，每次演示都使用环境变量临时启动代理：DEEPSEEK_API_KEY="你的 Key" node prototype/deepseek-proxy.mjs。不要把 Key 写入任何文件或提交。
5. 开发时保持产品边界：不做身份识别、人脸库比对、颜值评分、人格定论、命运判断；不输出贬低、恐吓、决定性关系结论。
6. 修改前先理解现有流程：上传甲乙照片 -> 本地面部点阵取象 -> 双相小记 -> 询问是否问诊 -> 选择关系 -> 输入卡点和需求 -> 可选选择题 -> 合参成签。
7. 每次改完都检查 prototype/index.html 是否能正常打开，并搜索确认没有真实 API Key、没有旧版类型命名、没有前台技术日志式文案。

接下来请先帮我检查当前原型，并根据我新的需求继续迭代。你可以一边修改代码，一边用右侧 Preview 辅助验收。
```

## 2. 当前实现入口

- 主页面：`prototype/index.html`
- DeepSeek 代理：`prototype/deepseek-proxy.mjs`
- DeepSeek 使用说明：`prototype/README-deepseek.md`
- 产品说明：`two-xiangzhi-prd.md`
- 生成逻辑：`generation-playbook.md`

## 3. 预览方式

方式 A：直接打开静态文件。

```bash
open prototype/index.html
```

方式 B：用本地静态服务打开，适合 Codex Preview。

```bash
python3 -m http.server 5173
```

Preview URL：

```text
http://127.0.0.1:5173/prototype/index.html
```

## 4. DeepSeek 代理

只在用户选择“回答几问”并完成问诊后调用。快速面相合参只走本地规则。

```bash
DEEPSEEK_API_KEY="你的 DeepSeek Key" node prototype/deepseek-proxy.mjs
```

不要提交真实 Key。`.env` 和 `.env.*` 已经被 `.gitignore` 忽略；推荐每次演示只在终端临时传入新的 Key。

## 5. 必守安全边界

- 不识别具体身份。
- 不做人脸库或历史人物真实匹配。
- 不保存原始照片、人脸模板或可还原身份的特征。
- 不做颜值、人格、忠诚、出轨、疾病、寿命、财运判断。
- 不说“克”“命定”“必须分手”“此人不可信”“面相不好”等结论。
- 匹配人物只作为 FBTI 面相人格的象意参照，不声称用户长得像某位历史人物。

## 6. 当前 FBTI 面相人格

- 腹黑太傅：贾诩参照。
- 咸鱼丞相：曹参参照。
- 戏精军师：陈平参照。
- 腹黑御史：张汤参照。
- 卷王将军：霍去病参照。
- 吃瓜枭雄：曹操参照。
- 社牛镖师：秦琼参照。
- 社恐刺客：聂政参照。
- 摸鱼翰林：嵇康参照。
- 养生方丈：孙思邈参照。
- 开挂状元：王勃参照。
- 吃货员外：苏东坡参照。
- 锦鲤善人：郭子仪参照。
- 扎心判官：汲黯参照。

## 7. 提交前检查

```bash
node --check prototype/deepseek-proxy.mjs
node -e "const fs=require('fs'); const html=fs.readFileSync('prototype/index.html','utf8'); const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); scripts.forEach(src=>new Function(src)); console.log('index scripts ok');"
rg -n "sk-[A-Za-z0-9]{16,}|DEEPSEEK_API_KEY=\"sk-" .
rg -n "面相 MBTI|cartoon|卡通" prototype/index.html prototype/deepseek-proxy.mjs
```
