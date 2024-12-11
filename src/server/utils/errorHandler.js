class ErrorHandler {
  static async handleError(error, context = "") {
    console.error(`Hata (${context}):`, error);

    if (error.message.includes("blocked")) {
      return {
        status: 403,
        message: "İçerik güvenlik nedeniyle engellendi",
        details: error.message,
      };
    }

    if (error.status === 429) {
      return {
        status: 429,
        message: "Çok fazla istek gönderildi, lütfen bekleyin",
        details: error.message,
      };
    }

    return {
      status: 500,
      message: "Bir hata oluştu",
      details: error.message,
    };
  }
}

module.exports = ErrorHandler;
