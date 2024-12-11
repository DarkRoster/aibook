const APP_CONFIG = {
  port: process.env.PORT || 3001,
  rateLimit: {
    minRequestInterval: 1000, // 1 saniye
  },
  book: {
    maxAttempts: 5,
    minPageLength: 500, // kelime
  },
};

module.exports = APP_CONFIG;
