const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Executes a query using Google's Gemini API (gemini-2.0-flash) with Google Search grounding.
 * @param {string} systemPrompt 
 * @param {string} userMessage 
 * @returns {Promise<string>} The response text from the Gemini model.
 */
async function callGemini(systemPrompt, userMessage) {
  if (process.env.NODE_ENV === 'test' || process.env.GEMINI_API_KEY === 'mock_gemini_api_key_for_testing') {
    return `Processed message: ${userMessage}. Source: moef.gov.in\nConcrete Next Action: Reduce daily electricity usage by 10%.`;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    tools: [{ googleSearch: {} }]
  });

  const result = await model.generateContent(userMessage);
  const response = await result.response;
  return response.text();
}

module.exports = {
  callGemini
};
