class ApiService {
  constructor() {
    this.baseUrl = "http://localhost:3001/api";
  }

  async getBooks() {
    const response = await fetch(`${this.baseUrl}/books`);
    if (!response.ok) throw new Error("Kitaplar getirilemedi");
    return response.json();
  }

  async getBook(id) {
    const response = await fetch(`${this.baseUrl}/book/${id}`);
    if (!response.ok) throw new Error("Kitap getirilemedi");
    return response.json();
  }

  async getBookOptions() {
    const response = await fetch(`${this.baseUrl}/book-options`);
    if (!response.ok) throw new Error("Kitap seçenekleri getirilemedi");
    return response.json();
  }

  async createBook(author, theme) {
    const response = await fetch(`${this.baseUrl}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, theme }),
    });
    if (!response.ok) throw new Error("Kitap oluşturulamadı");
    return response.json();
  }

  async createAutoBook(pageCount, author, theme) {
    try {
      const response = await fetch(`${this.baseUrl}/books/auto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageCount, author, theme }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kitap oluşturulamadı");
      }

      const book = await response.json();
      if (!book || !book.id) {
        throw new Error("Geçersiz kitap verisi");
      }

      return book;
    } catch (error) {
      console.error("API Hatası:", error);
      throw error;
    }
  }

  async addPages(bookId, pageCount) {
    const response = await fetch(`${this.baseUrl}/books/${bookId}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageCount }),
    });

    if (!response.ok) {
      throw new Error("Sayfa ekleme işlemi başarısız oldu");
    }

    return response.json();
  }

  async downloadBookAsPdf(bookId) {
    const response = await fetch(`${this.baseUrl}/books/${bookId}/pdf`);
    if (!response.ok) throw new Error("PDF indirilemedi");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kitap-${bookId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async getBookProgress(bookId) {
    const response = await fetch(`${this.baseUrl}/books/${bookId}/progress`);
    if (!response.ok) throw new Error("İlerleme durumu alınamadı");
    return response.json();
  }
}

export const api = new ApiService();
