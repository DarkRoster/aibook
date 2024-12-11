import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { BookCard } from "./BookCard";
import { ErrorMessage } from "../common/ErrorMessage";

export const BookList = ({ books = [], onBookSelect, selectedBookId }) => {
  if (!Array.isArray(books)) {
    console.error("Books is not an array:", books);
    return <ErrorMessage error="Kitap listesi yüklenirken bir hata oluştu" />;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Kitaplarım ({books.length})
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <div className="books-container">
        {books.map(
          (book) =>
            book && (
              <BookCard
                key={book.id}
                book={book}
                isSelected={selectedBookId === book.id}
                onClick={() => onBookSelect(book.id)}
              />
            )
        )}
      </div>
    </Box>
  );
};
