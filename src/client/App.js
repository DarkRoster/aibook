import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Grid, Paper, Typography, Alert } from "@mui/material";

import { theme } from "./styles/theme";
import { BookList } from "./components/Book/BookList";
import { BookControls } from "./components/Book/BookControls";
import { PageViewer } from "./components/Page/PageViewer";
import { PageStatus } from "./components/Page/PageStatus";
import { LoadingOverlay } from "./components/common/LoadingOverlay";
import { BookOptionsDialog } from "./components/Book/BookOptionsDialog";
import { useBooks } from "./hooks/useBooks";
import { useBook } from "./hooks/useBook";
import { api } from "./services/api";
import { BookStats } from "./components/Book/BookStats";

function App() {
  const [currentBookId, setCurrentBookId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreatingBook, setIsCreatingBook] = useState(false);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [createMode, setCreateMode] = useState("normal"); // 'normal' veya 'auto'

  const {
    books = [],
    loading: booksLoading,
    error: booksError,
    createBook,
    createAutoBook,
    refreshBooks,
  } = useBooks();

  const {
    book: currentBook,
    loading: bookLoading,
    error: bookError,
    refreshBook,
  } = useBook(currentBookId);

  useEffect(() => {
    if (booksError) {
      console.error("Kitap yükleme hatası:", booksError);
    }
  }, [booksError]);

  useEffect(() => {
    if (Array.isArray(books)) {
      console.log("Güncel kitaplar:", books);
    }
  }, [books]);

  const handleCreateBook = async (author, theme) => {
    try {
      setIsCreatingBook(true);
      const newBook = await api.createBook(author, theme);
      setCurrentBookId(newBook.id);
      setCurrentPage(0);
      await refreshBooks();
    } catch (error) {
      console.error("Kitap oluşturma hatası:", error);
    } finally {
      setIsCreatingBook(false);
    }
  };

  const handleCreateAutoBook = async (pageCount, author, theme) => {
    try {
      setIsCreatingBook(true);
      console.log("Kitap oluşturma parametreleri:", {
        pageCount,
        author,
        theme,
      });

      const newBook = await api.createAutoBook(pageCount, author, theme);

      console.log("Oluşturulan kitap:", newBook);

      if (!newBook || !newBook.id) {
        throw new Error("Geçersiz kitap verisi alındı");
      }

      setCurrentBookId(newBook.id);
      setCurrentPage(0);
      await refreshBooks();

      return newBook;
    } catch (error) {
      console.error("Otomatik kitap oluşturma hatası:", error);
      throw new Error(error.message || "Kitap oluşturulamadı");
    }
  };

  const handleBookSelect = (bookId) => {
    setCurrentBookId(bookId);
    setCurrentPage(0);
  };

  const handleAddPages = async (bookId, pageCount) => {
    try {
      setIsCreatingBook(true);
      await api.addPages(bookId, pageCount);
      await refreshBook();
      await refreshBooks();
    } catch (error) {
      console.error("Sayfa ekleme hatası:", error);
    } finally {
      setIsCreatingBook(false);
    }
  };

  const handleOpenOptionsDialog = (mode) => {
    setCreateMode(mode);
    setOptionsDialogOpen(true);
  };

  const isLoading = isCreatingBook;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {booksError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {booksError}
        </Alert>
      )}

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <BookControls
          onCreateBook={() => handleOpenOptionsDialog("normal")}
          onCreateAutoBook={() => handleOpenOptionsDialog("auto")}
          onAddPages={handleAddPages}
          disabled={isCreatingBook}
          selectedBookId={currentBookId}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <BookList
                books={books}
                onBookSelect={handleBookSelect}
                selectedBookId={currentBookId}
                disabled={isCreatingBook}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            {currentBookId && <PageStatus bookId={currentBookId} />}
            <PageViewer
              book={currentBook}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              loading={bookLoading}
              error={bookError}
            />
            {currentBook && <BookStats book={currentBook} />}
          </Grid>
        </Grid>
      </Container>

      <BookOptionsDialog
        open={optionsDialogOpen}
        onClose={() => setOptionsDialogOpen(false)}
        onConfirm={(author, theme) => {
          if (createMode === "auto") {
            handleCreateAutoBook(10, author, theme);
          } else {
            handleCreateBook(author, theme);
          }
        }}
        mode={createMode}
      />

      <LoadingOverlay open={isCreatingBook} message="Kitap oluşturuluyor..." />
    </ThemeProvider>
  );
}

export default App;
