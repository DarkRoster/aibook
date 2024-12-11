const { v4: uuidv4 } = require("uuid");
const TextUtils = require("../utils/textUtils");
const PromptBuilder = require("../utils/promptBuilder");
const aiService = require("./aiService");

class BookService {
  constructor() {
    this.books = new Map();
    this.aiService = aiService;
    this.bookProgress = new Map();

    // Kullanılabilir yazarlar ve konular
    this.availableAuthors = [
      { id: "dostoyevski", name: "Dostoyevski" },
      { id: "tolstoy", name: "Tolstoy" },
      { id: "orhanPamuk", name: "Orhan Pamuk" },
    ];

    this.availableThemes = [
      { id: "ask", name: "Aşk" },
      { id: "huzun", name: "Hüzün" },
      { id: "intikam", name: "İntikam" },
    ];
  }

  async createNewBook(author, theme) {
    const bookId = this.books.size + 1;
    const book = {
      id: bookId,
      title: `Kitap ${bookId}`,
      pages: [],
      createdAt: new Date().toISOString(),
      targetPageCount: 10,
      author,
      theme,
      mainTheme: this.buildMainTheme(author, theme),
    };

    this.books.set(bookId, book);
    await this.addPage(book, 0);
    return book;
  }

  async createAutoBook(pageCount, author, theme) {
    const bookId = this.books.size + 1;
    const book = {
      id: bookId,
      title: `Otomatik Kitap ${bookId}`,
      pages: [],
      createdAt: new Date().toISOString(),
      targetPageCount: pageCount,
      author,
      theme,
      mainTheme: this.buildMainTheme(author, theme),
      status: "creating",
      progress: 0,
    };

    this.books.set(bookId, book);
    this.bookProgress.set(bookId, 0);

    // Sayfaları asenkron olarak oluştur
    this.generatePages(book, pageCount).catch((error) => {
      console.error("Sayfa oluşturma hatası:", error);
      book.status = "error";
      book.error = error.message;
    });

    return book;
  }

  async generatePages(book, pageCount) {
    try {
      for (let i = 0; i < pageCount; i++) {
        const previousContent = i > 0 ? book.pages[i - 1].content : "";
        await this.addPage(book, i, previousContent);

        // İlerleme durumunu güncelle
        const progress = Math.round(((i + 1) / pageCount) * 100);
        this.bookProgress.set(book.id, progress);
        book.progress = progress;
      }

      book.status = "completed";
      this.bookProgress.delete(book.id);
    } catch (error) {
      book.status = "error";
      book.error = error.message;
      this.bookProgress.delete(book.id);
      throw error;
    }
  }

  buildMainTheme(author, theme) {
    const authorStyle = this.getAuthorStyle(author);
    const themeDesc = this.getThemeDescription(theme);
    return `${authorStyle} tarzında, ${themeDesc}. Her sayfa en az 300 kelime olmalı ve bir önceki sayfanın devamı niteliğinde olmalı. Sayfa sonunda yarım cümle bırakma. Türkçe karakterleri doğru kullan.`;
  }

  getAuthorStyle(authorId) {
    const styles = {
      dostoyevski:
        "Dostoyevski'nin derin psikolojik analiz ve karakter derinliği içeren, iç monologlarla zengin",
      tolstoy:
        "Tolstoy'un toplumsal gerçekçi, detaylı betimlemeler ve karakter gelişimi içeren",
      orhanPamuk:
        "Orhan Pamuk'un İstanbul'u merkeze alan, nostaljik ve melankolik, geçmiş ile bugünü harmanlayan",
    };
    return styles[authorId] || "edebi";
  }

  getThemeDescription(themeId) {
    const descriptions = {
      ask: "tutkulu bir aşk hikayesi anlat. Karakterlerin duygusal derinliğini ve iç dünyalarını detaylı bir şekilde yansıt",
      huzun:
        "melankolik ve derin bir hüzün hikayesi anlat. Karakterlerin yaşadığı kayıpları ve iç çatışmaları detaylı işle",
      intikam:
        "karmaşık bir intikam hikayesi anlat. Karakterlerin motivasyonlarını ve psikolojik durumlarını detaylı açıkla",
    };
    return descriptions[themeId] || themeId;
  }

  getAvailableAuthors() {
    return this.availableAuthors;
  }

  getAvailableThemes() {
    return this.availableThemes;
  }

  async addPage(book, pageNumber, previousContent = "") {
    try {
      if (!book.pages) {
        book.pages = [];
      }

      let prompt = `${book.mainTheme}\n\n`;

      if (pageNumber === 0) {
        prompt += "Bu ilk sayfa olduğu için hikayeye güçlü bir giriş yap. ";
      } else {
        prompt += `Bu ${
          pageNumber + 1
        }. sayfa. İşte önceki sayfanın son kısmı:\n\n"""${previousContent.slice(
          -500
        )}"""\n\nBu kısımdan devam et. `;
      }

      prompt +=
        "\nEn az 300 kelimelik, akıcı ve tutarlı bir metin oluştur. Cümlelerin yarım kalmamasına dikkat et.";

      const content = await this.aiService.generateText(prompt);
      const cleanContent = TextUtils.cleanStoryContent(content);

      // Minimum kelime sayısı kontrolü
      const wordCount = cleanContent.split(/\s+/).length;
      if (wordCount < 200) {
        throw new Error("Üretilen içerik çok kısa");
      }

      book.pages.push({
        id: book.pages.length + 1,
        content: cleanContent,
        createdAt: new Date().toISOString(),
      });

      return book;
    } catch (error) {
      console.error("Sayfa ekleme hatası:", error);
      throw new Error("Sayfa eklenirken bir hata oluştu");
    }
  }

  async addPages(bookId, pageCount) {
    const book = this.getBook(bookId);
    if (!book) {
      throw new Error("Kitap bulunamadı");
    }

    const currentPageCount = book.pages ? book.pages.length : 0;
    const promises = [];

    for (let i = 0; i < pageCount; i++) {
      const newPageNumber = currentPageCount + i;
      let previousContent = "";

      if (newPageNumber > 0 && book.pages && book.pages[newPageNumber - 1]) {
        previousContent = book.pages[newPageNumber - 1].content;
      }

      const promise = this.addPage(book, newPageNumber, previousContent);
      promises.push(promise);
    }

    await Promise.all(promises);
    return this.getBook(bookId);
  }

  getBook(id) {
    return this.books.get(id);
  }

  getAllBooks() {
    return Array.from(this.books.values());
  }

  getBookProgress(bookId) {
    const book = this.getBook(bookId);
    if (!book) {
      throw new Error("Kitap bulunamadı");
    }
    return {
      status: book.status,
      progress: book.progress,
      error: book.error,
    };
  }
}

module.exports = new BookService();
