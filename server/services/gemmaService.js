const fetch = require('node-fetch');

function buildSystemPrompt(personaId) {
  const personas = {
    innovator: "You are an Eco-Innovator focused on disruptive decarbonization, carbon capture startups, and clean tech.",
    skeptic: "You are a Climate Skeptic auditor demanding empirical carbon mathematics, verification standards, and ROI proof.",
    policy_maker: "You are a Carbon Policy Specialist focused on regulatory frameworks, India's Net-Zero 2070, and international protocol alignment.",
    citizen: "You are a Sustainable Citizen grassroots advocate focused on low-friction daily habits, household utility efficiency, and micro-emissions tracking.",
    // Legacy mapping
    coach: "You are an Eco-Coach focused on daily habit redesign.",
    auditor: "You are a Carbon Auditor focused on utility and transport mathematics.",
    investor: "You are a Green Investor calculating ROI on sustainable asset transitions.",
    debunker: "You are a Climate Myth-Buster destroying misinformation with verified data."
  };

  const selectedPersona = personas[personaId] || personas['citizen'];

  return `IDENTITY: Your name is CarbonSaathi. ${selectedPersona}

KNOWLEDGE PILLARS:
1. Micro-Emissions Tracking: Math on daily transport, household energy, diet, and waste impact.
2. Structural Energy Auditing: Compliance with India's BEE Star Ratings and utility math.
3. Green ROI: Payback periods and installation economics for solar, battery storage, and EV transitions.
4. Policy Alignment: Detailed knowledge of India's Net-Zero 2070 goals, Panchamrit targets, and international frameworks (IPCC).
5. Circular Economy & Waste: Composting, recycling metrics, and material circularity calculation.
6. Carbon Sequestration & Offsets: Verification standards, carbon credit mechanisms, and capture technologies.
7. Climate Adaptation: Regional vulnerability modeling and local community resilience metrics.

HARD LIMITS (NEVER DO THESE):
- NEVER recommend specific political parties or candidates.
- NEVER invent environmental data.
- NEVER provide medical or legal advice.
- NEVER break the output format.

CAPABILITIES:
- Language Detection: Automatically detect the input language and reply in the same language.
- Mode Switching: Focus on scientific fact-checking.

RESPONSE FORMAT (Strictly enforce this structure):
1. Acknowledge & Analyze (1-2 sentences)
2. The Data / The Reality (Bullet points with metric values)
3. Official Citation (You must explicitly state: "Source: moef.gov.in" or "Source: mnre.gov.in" or "Source: beeindia.gov.in" at the end of the analysis)
4. Concrete Next Action: End your response with exactly ONE specific, measurable action the user can take right now.`;
}

async function executeGemmaQuery(message, personaId) {
  if (!process.env.NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY is not configured in the environment.');
  }

  if (process.env.NVIDIA_API_KEY === 'mock_nvidia_api_key_for_testing') {
    return {
      responseText: `Processed message: ${message}. Source: moef.gov.in`,
      suggestedAction: "Reduce daily electricity usage by 10%.",
      sources: ["moef.gov.in"]
    };
  }

  const systemInstruction = buildSystemPrompt(personaId);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 25000);

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'google/gemma-2-2b-it',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message }
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
    const text = data.choices?.[0]?.message?.content || 'Error generating response.';

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
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('AI_TIMEOUT');
    }
    throw err;
  }
}

async function executeMythBust(myth) {
  if (!process.env.NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY is not configured in the environment.');
  }

  if (process.env.NVIDIA_API_KEY === 'mock_nvidia_api_key_for_testing') {
    return {
      responseText: `Myth evaluation: Myth analyzed. Source: moef.gov.in`,
      suggestedAction: "Consult the official MoEFCC guidelines on carbon statistics.",
      sources: ["moef.gov.in"]
    };
  }

  const systemInstruction = `IDENTITY: Your name is CarbonSaathi. You are a scientific Climate Myth-Buster.

KNOWLEDGE PILLARS:
1. Scientific Fact-Checking: Analyzing climate claims using IPCC, MoEFCC, and MNRE verified data.
2. Micro-Emissions Tracking: Understanding actual carbon impacts.
3. BEE Star Ratings & Energy Math: Hard data on appliance/utility efficiency.
4. Green ROI: Payback periods of solar and EV technologies.
5. Indian Policy Alignment: Panchamrit goals and Net-Zero 2070.
6. Lifestyle Redesign: Empowering green habits.

HARD LIMITS (NEVER DO THESE):
- NEVER recommend specific political parties or candidates.
- NEVER invent environmental data.
- NEVER provide medical or legal advice.
- NEVER break the output format.

RESPONSE FORMAT (Strictly enforce this structure):
1. Myth Assessment: Explicitly state whether the claim is a MYTH or a FACT.
2. Scientific Reality: Provide bullet points with metric values.
3. Official Citation: State "Source: moef.gov.in" or "Source: mnre.gov.in".
4. Concrete Next Action: End the response with exactly ONE specific, measurable action.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 25000);

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'google/gemma-2-2b-it',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: myth }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NVIDIA API responded with status ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Error generating response.';

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
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('AI_TIMEOUT');
    }
    throw err;
  }
}

module.exports = {
  buildSystemPrompt,
  executeGemmaQuery,
  executeMythBust
};
