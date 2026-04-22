const axios = require('axios');

const makeOpenAIRequest = async (prompt, type = "score") => {
    try {
        const isReport = type === "report";

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o-mini", // ✅ better + cheaper than 3.5
                messages: [
                    {
                        role: "system",
                        content: isReport
                            ? "You are a work ethic and productivity principles analyst. Provide structured markdown feedback using UK English."
                            : "You are a strict JSON scoring engine. ONLY return valid JSON. No extra text."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: isReport ? 0.5 : 0.2,
                max_tokens: isReport ? 800 : 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: isReport ? 20000 : 12000
            }
        );

        return response.data.choices[0]?.message?.content;

    } catch (error) {
        console.error('OpenAI API Error:', {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// =========================
// Safe JSON Parser (IMPORTANT)
// =========================
const safeJSONParse = (text) => {
    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch {}
        }
        return null;
    }
};

// =========================
// Netlify Handler
// =========================
exports.handler = async (event) => {

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        const body = typeof event.body === 'string'
            ? JSON.parse(event.body)
            : event.body;

        // =========================
        // ✅ BATCH SCORING (NEW)
        // =========================
        if (body.responses) {

            const prompt = `
You are an expert evaluator.

Evaluate each response based on:
- Emotional intelligence
- Accountability
- Consistency
- Growth mindset
- Work ethic principles

Score each response from 1 to 10, then calculate a final score out of 100.  

Responses:
${JSON.stringify(body.responses, null, 2)}

Return STRICT JSON:
{
  "scores": [
    { "questionIndex": 0, "score": 7 }
  ],
  "finalScore": 78
}
`;

            const raw = await makeOpenAIRequest(prompt, "score");
            const parsed = safeJSONParse(raw);

            if (!parsed || !parsed.finalScore) {
                throw new Error("Invalid scoring response");
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(parsed)
            };
        }

        // =========================
        // ✅ REPORT GENERATION
        // =========================
        if (body.prompt) {
            const report = await makeOpenAIRequest(body.prompt, "report");

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ report })
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Invalid request format" })
        };

    } catch (error) {
        console.error("Handler Error:", error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal server error",
                message: error.message
            })
        };
    }
};