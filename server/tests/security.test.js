const request = require('supertest');
const app = require('../index');

describe('Security Hardening Shield Validation Suite', () => {
  it('Validates 400 rejection for messages exceeding 1000 characters', async () => {
    const longMessage = 'A'.repeat(1005);
    const res = await request(app)
      .post('/api/chat')
      .send({ message: longMessage, personaId: 'coach' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Payload validation failed');
  });

  it('Validates XSS input is sanitized and returns 200', async () => {
    const maliciousInput = '<script>alert("hack")</script> Hello';
    const res = await request(app)
      .post('/api/chat')
      .send({ message: maliciousInput, personaId: 'coach' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.responseText).not.toContain('<script>');
  });

  it('Validates invalid persona routing returns 400', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Valid message', personaId: 'hacker' });
    
    expect(res.statusCode).toBe(400);
  });

  it('Rejects activity emission value exceeding numeric limit', async () => {
    const res = await request(app)
      .post('/api/emissions')
      .send({ value: 999999999 });
    expect(res.statusCode).toBe(400);
  });

  it('Rejects negative emission values with 400', async () => {
    const res = await request(app)
      .post('/api/emissions')
      .send({ value: -10 });
    expect(res.statusCode).toBe(400);
  });

  it('Handles malformed JSON body gracefully with 400', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Content-Type', 'application/json')
      .send('{ "message": "unclosed json string, }');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Payload validation failed');
  });
});
