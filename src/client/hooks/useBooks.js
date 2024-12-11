import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await api.getBooks();
      console.log("Fetched books data:", data);
      const booksArray = Array.isArray(data)
        ? data
        : Object.values(data).filter(Boolean);
      setBooks(booksArray);
    } catch (err) {
      console.error("Kitapları getirme hatası:", err);
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const createBook = async () => {
    try {
      setLoading(true);
      const newBook = await api.createBook();
      setBooks((prev) => [...prev, newBook]);
      return newBook;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAutoBook = async (pageCount) => {
    try {
      setLoading(true);
      const newBook = await api.createAutoBook(pageCount);
      setBooks((prev) => [...prev, newBook]);
      return newBook;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    books: Array.isArray(books) ? books : [],
    loading: false,
    error,
    createBook,
    createAutoBook,
    refreshBooks: fetchBooks,
  };
};
