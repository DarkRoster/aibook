const BookService = require("../services/bookService");
const PDFDocument = require("pdfkit");
const path = require("path");

class BookController {
  constructor() {
    this.bookService = require("../services/bookService");
  }

  async getBooks(req, res, next) {
    try {
      const books = BookService.getAllBooks();
      res.json(books);
    } catch (error) {
      next(error);
    }
  }

  async getBook(req, res, next) {
    try {
      const book = BookService.getBook(parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ error: "Kitap bulunamadı" });
      }
      res.json(book);
    } catch (error) {
      next(error);
    }
  }

  createBook = async (req, res, next) => {
    try {
      const { author, theme } = req.body;
      const book = await this.bookService.createNewBook(author, theme);
      res.json(book);
    } catch (error) {
      next(error);
    }
  };

  createAutoBook = async (req, res, next) => {
    try {
      const { pageCount, author, theme } = req.body;

      if (!pageCount || !author || !theme) {
        return res.status(400).json({
          error: "Sayfa sayısı, yazar ve tema zorunludur",
        });
      }

      console.log("Gelen istek parametreleri:", { pageCount, author, theme });

      const book = await this.bookService.createAutoBook(
        pageCount,
        author,
        theme
      );

      console.log("Oluşturulan kitap:", book);

      if (!book || !book.id) {
        throw new Error("Kitap oluşturulamadı");
      }

      res.json(book);
    } catch (error) {
      console.error("Kitap oluşturma hatası:", error);
      next(error);
    }
  };

  getBookOptions = async (req, res, next) => {
    try {
      const options = {
        authors: this.bookService.getAvailableAuthors(),
        themes: this.bookService.getAvailableThemes(),
      };
      res.json(options);
    } catch (error) {
      next(error);
    }
  };

  async getBookStatus(req, res, next) {
    try {
      const book = BookService.getBook(parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ error: "Kitap bulunamadı" });
      }

      const status = {
        id: book.id,
        status: book.status,
        isComplete: book.isComplete,
        currentPage: book.currentPage,
        totalPages: book.pages.length,
        error: book.error,
      };

      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  async downloadPdf(req, res, next) {
    try {
      const bookId = parseInt(req.params.id);
      const book = BookService.getBook(bookId);

      if (!book) {
        return res.status(404).json({ error: "Kitap bulunamadı" });
      }

      const fontPath = path.join(
        __dirname,
        "..",
        "fonts",
        "Roboto-Regular.ttf"
      );

      const doc = new PDFDocument({
        font: fontPath,
        size: "A4",
        margin: 50,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=kitap-${bookId}.pdf`
      );

      doc.pipe(res);

      doc.registerFont("Roboto", fontPath);
      doc.font("Roboto");

      book.pages.forEach((page, index) => {
        if (index > 0) {
          doc.addPage();
        }

        doc.fontSize(10).text(`Sayfa ${index + 1}`, 50, 50, { align: "right" });

        doc
          .fontSize(12)
          .moveDown()
          .text(page.content || "", {
            align: "justify",
            lineGap: 5,
            paragraphGap: 10,
            width: doc.page.width - 100,
          });
      });

      doc.end();
    } catch (error) {
      console.error("PDF oluşturma hatası:", error);
      next(error);
    }
  }

  async addPages(req, res, next) {
    try {
      const bookId = parseInt(req.params.id);
      const { pageCount } = req.body;

      if (!pageCount || pageCount < 1 || pageCount > 20) {
        return res.status(400).json({
          error: "Geçersiz sayfa sayısı. 1-20 arası bir sayı giriniz.",
        });
      }

      const updatedBook = await BookService.addPages(bookId, pageCount);
      res.json(updatedBook);
    } catch (error) {
      next(error);
    }
  }

  async getBookProgress(req, res, next) {
    try {
      const bookId = parseInt(req.params.id);
      const progress = this.bookService.getBookProgress(bookId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
