const express = require("express");
const cors = require("cors");
const rateLimiter = require("./middleware/rateLimiter");
const errorMiddleware = require("./middleware/errorMiddleware");
const bookController = require("./controllers/bookController");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(rateLimiter.middleware.bind(rateLimiter));

// Routes
app.get("/api/books", bookController.getBooks);
app.post("/api/books", bookController.createBook);
app.post("/api/books/auto", bookController.createAutoBook);
app.get("/api/book/:id", bookController.getBook);
app.get("/api/book-status/:id", bookController.getBookStatus);
app.get("/api/books/:id/pdf", bookController.downloadPdf);
app.post("/api/books/:id/pages", bookController.addPages);

// Error handling
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
