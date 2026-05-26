// const axios = require('axios');

// const makeOpenAIRequest = async (prompt, type = "score") => {
//     try {
//         const isReport = type === "report";

//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: "gpt-4o-mini", // ✅ better + cheaper than 3.5
//                 messages: [
//                     {
//                         role: "system",
//                         content: isReport
//                             ? "You are a work ethic and productivity principles analyst. Provide structured markdown feedback using UK English."
//                             : "You are a strict JSON scoring engine. ONLY return valid JSON. No extra text."
//                     },
//                     { role: "user", content: prompt }
//                 ],
//                 temperature: isReport ? 0.5 : 0.2,
//                 max_tokens: isReport ? 500 : 300
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 },
//                 timeout: isReport ? 12000 : 10000 // longer timeout for report generation
//             }
//         );

//         return response.data.choices[0]?.message?.content;

//     } catch (error) {
//         console.error('OpenAI API Error:', {
//             message: error.message,
//             response: error.response?.data
//         });
//         throw error;
//     }
// };

// // =========================
// // Safe JSON Parser (IMPORTANT)
// // =========================
// const safeJSONParse = (text) => {
//     try {
//         return JSON.parse(text);
//     } catch {
//         const match = text.match(/\{[\s\S]*\}/);
//         if (match) {
//             try {
//                 return JSON.parse(match[0]);
//             } catch {}
//         }
//         return null;
//     }
// };

// // =========================
// // Netlify Handler
// // =========================
// exports.handler = async (event) => {

//     const headers = {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Headers': 'Content-Type',
//         'Access-Control-Allow-Methods': 'POST, OPTIONS'
//     };

//     // CORS preflight
//     if (event.httpMethod === 'OPTIONS') {
//         return { statusCode: 204, headers };
//     }

//     try {
//         const body = typeof event.body === 'string'
//             ? JSON.parse(event.body)
//             : event.body;

//         // =========================
//         // ✅ BATCH SCORING (NEW)
//         // =========================
//         if (body.responses) {

//             const prompt = `
// You are an expert evaluator.

// Evaluate each response based on:
// - Emotional intelligence
// - Accountability
// - Consistency
// - Growth mindset
// - Work ethic principles

// Score each response from 1 to 10, then calculate a final score out of 100.  

// Responses:
// ${JSON.stringify(body.responses, null, 2)}

// Return STRICT JSON:
// {
//   "scores": [
//     {"score": 7 }
//   ],
//   "finalScore": 78
// }
// `;

//             const raw = await makeOpenAIRequest(prompt, "score");
//             const parsed = safeJSONParse(raw);

//             if (!parsed || !parsed.finalScore) {
//                 throw new Error("Invalid scoring response");
//             }

//             return {
//                 statusCode: 200,
//                 headers,
//                 body: JSON.stringify(parsed)
//             };
//         }

//         // =========================
//         // ✅ REPORT GENERATION
//         // =========================
//         if (body.prompt) {
//             const report = await makeOpenAIRequest(body.prompt, "report");

//             return {
//                 statusCode: 200,
//                 headers,
//                 body: JSON.stringify({ report })
//             };
//         }

//         return {
//             statusCode: 400,
//             headers,
//             body: JSON.stringify({ error: "Invalid request format" })
//         };

//     } catch (error) {
//         console.error("Handler Error:", error);

//         return {
//             statusCode: 500,
//             headers,
//             body: JSON.stringify({
//                 error: "Internal server error",
//                 message: error.message
//             })
//         };
//     }
// };

const axios = require('axios');

// =========================
// OpenAI Request Helper
// =========================
const makeOpenAIRequest = async (
    prompt,
    type = "score",
    retries = 2
) => {

    const isReport = type === "report";

    try {

        const requestBody = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: isReport
                        ? "You are a work ethic and productivity principles analyst. Provide structured markdown feedback using UK English."
                        : "You are a strict JSON scoring engine. ONLY return valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: isReport ? 0.5 : 0.2,
            max_tokens: isReport ? 700 : 300
        };

        // Force valid JSON responses for scoring
        if (!isReport) {
            requestBody.response_format = {
                type: "json_object"
            };
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: isReport ? 25000 : 15000
            }
        );

        return response.data.choices[0]?.message?.content;

    } catch (error) {

        console.error("OpenAI API Error:", {
            message: error.message,
            status: error.response?.status,
            response: error.response?.data
        });

        // Retry temporary failures
        if (
            retries > 0 &&
            (
                error.code === "ECONNABORTED" ||
                error.response?.status === 429 ||
                error.response?.status >= 500
            )
        ) {
            console.log(`Retrying request... (${retries} retries left)`);

            await new Promise(resolve => setTimeout(resolve, 1000));

            return makeOpenAIRequest(
                prompt,
                type,
                retries - 1
            );
        }

        throw error;
    }
};

// =========================
// Safe JSON Parser
// =========================
const safeJSONParse = (text) => {

    try {
        return JSON.parse(text);

    } catch {

        // Extract JSON if wrapped in extra text
        const match = text?.match(/\{[\s\S]*\}/);

        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch {
                return null;
            }
        }

        return null;
    }
};

// =========================
// Netlify Function Handler
// =========================
exports.handler = async (event) => {

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // =========================
    // CORS Preflight
    // =========================
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers
        };
    }

    try {

        // =========================
        // Parse Request Body
        // =========================
        const body = typeof event.body === "string"
            ? JSON.parse(event.body)
            : event.body;

        // =========================
        // SCORE GENERATION
        // =========================
        if (body.responses) {

            // Validate responses
            if (!Array.isArray(body.responses)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: "responses must be an array"
                    })
                };
            }

            if (body.responses.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: "responses array cannot be empty"
                    })
                };
            }

            // Prevent huge token usage
            if (body.responses.length > 50) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: "Too many responses"
                    })
                };
            }

            const prompt = `
            You are an expert evaluator.
Evaluate each response based on:
- Emotional intelligence
- Accountability
- Consistency
- Growth mindset
- Work ethic principles

Instructions:
1. Score each response from 1 to 10
2. Average all scores
3. Multiply by 10
4. Return finalScore out of 100

Responses:
${JSON.stringify(body.responses)}

Return STRICT JSON ONLY in this exact format:
{
  "scores": [
    { "score": 7 }
  ],
  "finalScore": 78
}
`;

            const raw = await makeOpenAIRequest(
                prompt,
                "score"
            );

            const parsed = safeJSONParse(raw);

            // Validate AI response
            if (
                !parsed ||
                typeof parsed.finalScore !== "number" ||
                parsed.finalScore < 0 ||
                parsed.finalScore > 100 ||
                !Array.isArray(parsed.scores)
            ) {
                throw new Error("Invalid scoring response");
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(parsed)
            };
        }

        // =========================
        // REPORT GENERATION
        // =========================
        if (body.prompt) {

            if (
                typeof body.prompt !== "string" ||
                body.prompt.trim().length === 0
            ) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: "Invalid prompt"
                    })
                };
            }

            const report = await makeOpenAIRequest(
                body.prompt,
                "report"
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    report
                })
            };
        }

        // =========================
        // Invalid Request
        // =========================
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                error: "Invalid request format"
            })
        };

    } catch (error) {

        console.error("Handler Error:", {
            message: error.message,
            stack: error.stack
        });

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal server error",
                message: error.message,
                openaiStatus: error.response?.status || null
        })
};
    }
};