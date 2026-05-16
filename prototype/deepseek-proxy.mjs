import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 8787);
const API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";
const ENDPOINT = process.env.DEEPSEEK_ENDPOINT || "https://api.deepseek.com/chat/completions";

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function compactFace(faceSummary = []) {
  return faceSummary.map((face) => ({
    title: face.title,
    engine: face.engine,
    style: face.style,
    faceType: face.faceType,
    measurements: face.measurements,
    evidence: face.evidence,
    terms: face.terms,
    profile: face.profile,
  }));
}

function buildPrompt(payload) {
  return [
    "请基于以下结构化信息生成一份《两相知》合参成签报告。",
    "",
    "关系类型：",
    payload.relation || "未填写",
    "",
    "提问者遇到的问题：",
    payload.problem || "未填写",
    "",
    "提问者最想得到的建议：",
    payload.need || "未填写",
    "",
    "双相面相摘要：",
    JSON.stringify(compactFace(payload.faceSummary), null, 2),
    "",
    "F-BTI 类型关系：",
    JSON.stringify(payload.facePairing || {}, null, 2),
    "",
    "关系问诊回答：",
    JSON.stringify(payload.answers || [], null, 2),
    "",
    "请只返回 json / JSON，不要 Markdown。字段必须为：",
    "signName, leadText, combinedText, reasonText, adviceText, iceText, basisText。",
    "",
    "JSON 示例：",
    JSON.stringify(
      {
        signName: "山泽互照签",
        leadText: "一句总断，古法术语只点到为止。",
        combinedText: "先说甲乙 F-BTI 类型，再说两类之间的温和关系。",
        reasonText: "用日常语言说明矛盾为什么形成。",
        adviceText: "给出具体、生活化、可执行的建议。",
        iceText: "一句可直接发送的破冰话。",
        basisText: "说明参考了哪些面相术语、问诊回答与自述问题。",
      },
      null,
      2,
    ),
  ].join("\n");
}

const systemPrompt = [
  "你是《两相知》的合参成签引擎。",
  "你会把本地面部点阵测量、古籍相法术语、F-BTI 类型、关系类型、提问者自述问题与问诊回答，合成为一份文化娱乐化关系反思报告。",
  "重要边界：",
  "1. 不做身份识别、人脸库比对、颜值评分、命运判断、疾病/寿命/财运/忠诚/出轨判断。",
  "2. 不输出贬低性、决定性或恐吓性结论；禁止说必须分手、此人克你、对方不可信、面相不好。",
  "3. 面相只作为象意入口，不能把面部特征当作人格或关系事实。",
  "4. 对明星/公众人物关系，重点给边界、情绪安放、理性支持建议，不鼓励私联、跟踪、骚扰或侵犯隐私。",
  "5. 输出要有少量古籍气质，但不要堆砌文言；古法术语要概括精炼，建议必须具体、日常、低风险、可执行。",
  "6. 语气为“象意/倾向/可能卡点”，避免绝对化。",
  "7. 必须使用 F-BTI 类型名与类型关系名，但不要说相克、克制、命中注定。",
].join("\n");

createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== "POST" || request.url !== "/api/deepseek") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  if (!API_KEY) {
    sendJson(response, 500, {
      error: "Missing DEEPSEEK_API_KEY. Start with: DEEPSEEK_API_KEY=... node prototype/deepseek-proxy.mjs",
    });
    return;
  }

  try {
    const rawBody = await readBody(request);
    const payload = JSON.parse(rawBody || "{}");
    const upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildPrompt(payload) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.72,
        max_tokens: 1800,
        stream: false,
        thinking: { type: "disabled" },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      sendJson(response, upstream.status, {
        error: data.error?.message || data.message || "DeepSeek API error",
        details: data,
      });
      return;
    }

    const content = data.choices?.[0]?.message?.content || "{}";
    let report;
    try {
      report = JSON.parse(content);
    } catch (error) {
      report = {
        signName: "临水照心签",
        leadText: "模型返回了非 JSON 文本，已转为摘要展示。",
        combinedText: content,
        reasonText: "请检查模型输出格式或降低提示复杂度。",
        adviceText: "先以一件具体问题开口，不在同一轮对话里清算全部旧账。",
        iceText: "我想把这件事讲清楚，不是为了争输赢，是想让我们少一点误会。",
        basisText: "DeepSeek 返回非 JSON，代理已兜底。",
      };
    }

    sendJson(response, 200, {
      report,
      model: data.model || MODEL,
      usage: data.usage,
    });
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Proxy error",
    });
  }
}).listen(PORT, () => {
  console.log(`DeepSeek proxy listening on http://127.0.0.1:${PORT}/api/deepseek`);
});
