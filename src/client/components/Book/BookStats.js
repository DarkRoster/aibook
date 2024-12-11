import React, { useMemo } from "react";
import { Paper, Typography, Divider } from "@mui/material";

export function BookStats({ book }) {
  const stats = useMemo(() => {
    if (!book?.pages) return { totalWords: 0, estimatedPages: 0 };

    // Tüm sayfalardaki kelimeleri sayma
    const totalWords = book.pages.reduce((sum, page) => {
      const wordCount =
        page.content?.split(/\s+/).filter((word) => word.length > 0).length ||
        0;
      return sum + wordCount;
    }, 0);

    // Gerçek kitap sayfası tahmini (ortalama sayfa başına 250 kelime)
    const estimatedPages = Math.ceil(totalWords / 250);

    return { totalWords, estimatedPages };
  }, [book]);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Kitap İstatistikleri
      </Typography>

      {book?.author && book?.theme && (
        <>
          <Typography>Yazar Tarzı: {book.author}</Typography>
          <Typography>Tema: {book.theme}</Typography>
          <Divider sx={{ my: 1 }} />
        </>
      )}

      <Typography>
        Toplam Kelime Sayısı: {stats.totalWords.toLocaleString("tr-TR")}
      </Typography>
      <Typography>
        Tahmini Basılı Kitap Sayfası:{" "}
        {stats.estimatedPages.toLocaleString("tr-TR")} sayfa
      </Typography>
    </Paper>
  );
}
