const rateLimitMap = new Map();

/**
 * Clean primitive modular memory rate limiter bypassing structural external dependencies.
 * @param maxRequests - Limit window boundary threshold.
 * @returns Function Express middleware implementation.
 */
module.exports = function createLimiter(maxRequests) {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 60000;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }

    const timestamps = rateLimitMap.get(ip).filter(time => now - time < windowMs);
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    if (timestamps.length > maxRequests) {
      return res.status(429).json({ error: 'Too many execution operations requests.' });
    }
    next();
  };
};
