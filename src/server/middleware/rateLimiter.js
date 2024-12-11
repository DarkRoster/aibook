const APP_CONFIG = require("../config/app.config");

class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  middleware(req, res, next) {
    const now = Date.now();
    const clientIP = req.ip;

    // API isteklerini rate limit'ten muaf tut
    if (req.path.startsWith("/api/")) {
      return next();
    }

    const lastRequest = this.requests.get(clientIP) || 0;
    const timeSinceLastRequest = now - lastRequest;

    if (timeSinceLastRequest < APP_CONFIG.rateLimit.minRequestInterval) {
      return res.status(429).json({
        error: "Çok fazla istek gönderildi",
        retryAfter:
          (APP_CONFIG.rateLimit.minRequestInterval - timeSinceLastRequest) /
          1000,
      });
    }

    this.requests.set(clientIP, now);
    next();
  }
}

module.exports = new RateLimiter();
