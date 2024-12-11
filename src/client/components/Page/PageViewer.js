import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { PageNavigation } from "../common/PageNavigation";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { ErrorMessage } from "../common/ErrorMessage";

export const PageViewer = ({
  book,
  currentPage,
  onPageChange,
  loading,
  error,
}) => {
  if (!book) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Lütfen bir kitap seçin</Typography>
      </Paper>
    );
  }

  if (loading) {
    return <LoadingOverlay open={true} message="Sayfa yükleniyor..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const currentContent = book.pages[currentPage]?.content;

  return (
    <Paper sx={{ p: 3 }}>
      <PageNavigation
        currentPage={currentPage}
        totalPages={book.pages.length}
        onPrevious={() => onPageChange(Math.max(0, currentPage - 1))}
        onNext={() =>
          onPageChange(Math.min(book.pages.length - 1, currentPage + 1))
        }
        disabled={loading}
      />

      <Box
        sx={{
          typography: "body1",
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
        }}
      >
        {currentContent || "Bu sayfada henüz içerik yok."}
      </Box>
    </Paper>
  );
};
