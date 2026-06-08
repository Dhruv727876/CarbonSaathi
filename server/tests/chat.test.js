const request = require('supertest');
const app = require('../index');

describe('Chat Proxy Engine Validation Suite', () => {
  it('Returns 200 on perfectly valid chat proxy request', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I lower my carbon?', personaId: 'auditor' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('responseText');
    expect(res.body).toHaveProperty('suggestedAction');
  });

  it('Rejects processing missing message payloads with 400', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ personaId: 'coach' });
    
    expect(res.statusCode).toBe(400);
  });
});
