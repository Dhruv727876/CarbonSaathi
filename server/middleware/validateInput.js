/**
 * Validates baseline payload parameter architecture before proxy pass execution loops.
 */
module.exports = function validateInput(req, res, next) {
  const { message, personaId } = req.body;
  if (req.method === 'POST' && req.path === '/api/chat') {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Missing mandatory payload message attributes.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Payload configuration violates strict content limits.' });
    }
    const validations = ['coach', 'auditor', 'investor', 'debunker'];
    if (!personaId || !validations.includes(personaId)) {
      return res.status(400).json({ error: 'Invalid proxy routing parameter target mapping.' });
    }
  }
  next();
};
