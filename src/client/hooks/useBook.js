import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

export const useBook = (bookId) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBook = useCallback(async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      const data = await api.getBook(bookId);
      setBook(data);
      setError(null);
    } catch (err) {
      console.error("Kitap yükleme hatası:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return {
    book,
    loading,
    error,
    refreshBook: fetchBook,
  };
};
