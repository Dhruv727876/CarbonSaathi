const { callGemini } = require('./geminiService');
const fetch = require('node-fetch');

/**
 * Parses raw text from AI model responses into structural JSON.
 * @param {string} text - Raw output from model.
 * @returns {object} Structured response content.
 */
function parseAIOutput(text) {
  const sources = [];
  if (text.toLowerCase().includes('moef.gov.in')) sources.push('moef.gov.in');
  if (text.toLowerCase().includes('mnre.gov.in')) sources.push('mnre.gov.in');
  if (sources.length === 0) sources.push('beeindia.gov.in');

  const lines = text.split('\n');
  const suggestedAction = lines.length > 1 ? lines[lines.length - 1] : "Review your carbon footprint daily.";

  return {
    responseText: text,
    suggestedAction: suggestedAction.replace('Concrete Next Action:', '').replace(/\*\*/g, '').trim(),
    sources
  };
}

/**
 * Fallback Gemma query caller using NVIDIA NIM API.
 * @param {string} systemPrompt 
 * @param {string} userMessage 
 * @returns {Promise<string>} Raw output text.
 */
async function callGemma(systemPrompt, userMessage) {
  if (!process.env.NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY is not configured in the environment.');
  }

  if (process.env.NODE_ENV === 'test' || process.env.NVIDIA_API_KEY === 'mock_nvidia_api_key_for_testing') {
    return `Processed message: ${userMessage}. Source: moef.gov.in\nConcrete Next Action: Reduce daily electricity usage by 10%.`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "google/gemma-4-31b-it",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NVIDIA API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Error generating response.';
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('AI_TIMEOUT');
    }
    throw err;
  }
}

/**
 * High-reliability AI orchestration calling Gemini with a fallback to NVIDIA/Gemma.
 * @param {string} systemPrompt 
 * @param {string} userMessage 
 * @returns {Promise<object>} Structured response object.
 */
async function callAI(systemPrompt, userMessage) {
  let rawText;
  try {
    rawText = await callGemini(systemPrompt, userMessage);
  } catch (err) {
    console.warn('Gemini failed, falling back to NVIDIA:', err.message);
    rawText = await callGemma(systemPrompt, userMessage);
  }
  return parseAIOutput(rawText);
}

module.exports = {
  callAI
};
