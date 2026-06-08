const request = require('supertest');
const app = require('../index');

describe('Health Engine Assessment Suite', () => {
  it('GET /api/health returns 200 and operational status under 200ms', async () => {
    const start = Date.now();
    const res = await request(app).get('/api/health');
    const duration = Date.now() - start;
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('operational');
    expect(duration).toBeLessThan(200);
  });
});
