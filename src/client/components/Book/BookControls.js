import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import {
  Add as AddIcon,
  AutoStories as AutoStoriesIcon,
  PictureAsPdf as PdfIcon,
  PostAdd as PostAddIcon,
} from "@mui/icons-material";
import { api } from "../../services/api";
import { AutoBookDialog } from "./AutoBookDialog";
import { AddPagesDialog } from "./AddPagesDialog";
import { BookOptionsDialog } from "./BookOptionsDialog";

export const BookControls = ({
  onCreateBook,
  onCreateAutoBook,
  onAddPages,
  disabled,
  selectedBookId,
}) => {
  const [isAutoDialogOpen, setIsAutoDialogOpen] = useState(false);
  const [isAddPagesDialogOpen, setIsAddPagesDialogOpen] = useState(false);
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);

  const handleDownloadPdf = async () => {
    if (!selectedBookId) return;
    try {
      await api.downloadBookAsPdf(selectedBookId);
    } catch (error) {
      console.error("PDF indirme hatası:", error);
    }
  };

  const handleOpenAutoDialog = () => setIsAutoDialogOpen(true);
  const handleCloseAutoDialog = () => setIsAutoDialogOpen(false);
  const handleOpenAddPagesDialog = () => setIsAddPagesDialogOpen(true);
  const handleCloseAddPagesDialog = () => setIsAddPagesDialogOpen(false);
  const handleOpenOptionsDialog = () => setIsOptionsDialogOpen(true);
  const handleCloseOptionsDialog = () => setIsOptionsDialogOpen(false);

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenOptionsDialog}
          disabled={disabled}
          fullWidth
        >
          Yeni Kitap
        </Button>
        <Button
          variant="contained"
          startIcon={<AutoStoriesIcon />}
          onClick={handleOpenAutoDialog}
          disabled={disabled}
          fullWidth
        >
          Otomatik Kitap Oluştur
        </Button>
        {selectedBookId && (
          <>
            <Button
              variant="contained"
              startIcon={<PostAddIcon />}
              onClick={handleOpenAddPagesDialog}
              disabled={disabled}
              fullWidth
            >
              Sayfa Ekle
            </Button>
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={handleDownloadPdf}
              disabled={disabled}
              fullWidth
            >
              PDF İndir
            </Button>
          </>
        )}
      </Box>

      <AutoBookDialog
        open={isAutoDialogOpen}
        onClose={handleCloseAutoDialog}
        onConfirm={async (pageCount, author, theme) => {
          try {
            const book = await onCreateAutoBook(pageCount, author, theme);
            return book; // Kitap nesnesini döndürüyoruz
          } catch (error) {
            throw error;
          }
        }}
      />

      <AddPagesDialog
        open={isAddPagesDialogOpen}
        onClose={handleCloseAddPagesDialog}
        onConfirm={(pageCount) => onAddPages(selectedBookId, pageCount)}
      />

      <BookOptionsDialog
        open={isOptionsDialogOpen}
        onClose={handleCloseOptionsDialog}
        onConfirm={(author, theme) => onCreateBook(author, theme)}
      />
    </>
  );
};
