const OpenAI = require('openai');
const { buildSystemPrompt } = require('../utils/promptBuilder');

// Initialize with environment variable validation
const apiKey = process.env.NVIDIA_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
}) : null;

async function executeGemmaQuery(message, personaId) {
  if (!openai) {
    throw new Error('NVIDIA_API_KEY is not configured in the environment.');
  }

  const systemInstruction = buildSystemPrompt(personaId);

  // Upgraded to Gemma 4 (31B Dense Instruction-Tuned)
  const completion = await openai.chat.completions.create({
    model: 'google/gemma-4-31b-it',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: message }
    ],
    temperature: 0.2, // Slightly lowered for Gemma 4's high-precision reasoning
    max_tokens: 500,
  });

  const text = completion.choices[0]?.message?.content || 'Error generating response.';
  
  // Extract sources heuristically based on strict prompt requirements
  const sources = [];
  if (text.includes('moef.gov.in')) sources.push('moef.gov.in');
  if (text.includes('mnre.gov.in')) sources.push('mnre.gov.in');
  if (sources.length === 0) sources.push('beeindia.gov.in'); // Fallback trusted source

  // Parse the output to separate the action (heuristically based on our strict prompt)
  const lines = text.split('\n');
  const suggestedAction = lines.length > 1 ? lines[lines.length - 1] : "Review your daily emissions tracker.";

  return {
    responseText: text,
    suggestedAction: suggestedAction.replace('Concrete Next Action:', '').replace(/\*\*/g, '').trim(),
    sources
  };
}

module.exports = { executeGemmaQuery };
