// Netlify Function: AI proxy (OpenAI)
// Reads OPENAI_API_KEY from env. Do NOT commit keys.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing OPENAI_API_KEY env var" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const userPrompt = (body.prompt || "").trim();
  const context = (body.context || "").trim();

  if (!userPrompt) {
    return { statusCode: 400, body: JSON.stringify({ error: "prompt is required" }) };
  }

  // Safety/system guardrails
  const systemPrompt = `
You are a concise, supportive, non-medical assistant for GLP-1 users.
- Do NOT give dosing, prescriptions, or medical advice.
- No diagnosis. Use "educational", "patterns", "talk to your clinician".
- Keep answers short, stepwise, and practical.
- If safety concerns appear, say: "Please contact your clinician or local emergency services."
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(context ? [{ role: "system", content: `Context: ${context}` }] : []),
    { role: "user", content: userPrompt },
  ];

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.4,
        max_tokens: 400,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: text }) };
    }

    const data = await resp.json();
    const answer = data.choices?.[0]?.message?.content || "Sorry, no response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

