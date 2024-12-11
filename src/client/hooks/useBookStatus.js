import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useBookStatus = (bookId) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const checkStatus = async () => {
      try {
        const data = await api.getBookStatus(bookId);
        setStatus(data);

        if (data.status === "completed" || data.status === "error") {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError(err.message);
        clearInterval(intervalId);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      checkStatus();
      intervalId = setInterval(checkStatus, 2000); // Her 2 saniyede bir kontrol et
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [bookId]);

  return { status, loading, error };
};
