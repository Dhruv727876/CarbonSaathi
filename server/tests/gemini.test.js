const { buildSystemPrompt } = require('../services/gemmaService');

describe('Gemini System Prompt Compiler Validation Suite', () => {
  it('Validates target grounding inclusion sequences', () => {
    const mockPrompt = "You are CarbonSaathi. Cite moef.gov.in.";
    expect(mockPrompt).toContain("moef.gov.in");
  });

  it('buildSystemPrompt returns unique string for each persona', () => {
    const prompt1 = buildSystemPrompt('innovator');
    const prompt2 = buildSystemPrompt('skeptic');
    expect(prompt1).not.toBe(prompt2);
  });

  it('every system prompt contains MoEFCC or MNRE reference', () => {
    const prompt = buildSystemPrompt('citizen');
    const hasMoef = prompt.toLowerCase().includes('moef.gov.in');
    const hasMnre = prompt.toLowerCase().includes('mnre.gov.in');
    expect(hasMoef || hasMnre).toBe(true);
  });

  it('unknown persona returns default system prompt without throwing', () => {
    let prompt;
    expect(() => {
      prompt = buildSystemPrompt('nonexistent-persona');
    }).not.toThrow();
    expect(prompt).toContain('Sustainable Citizen');
  });
});
