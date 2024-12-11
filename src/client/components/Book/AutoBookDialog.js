import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  LinearProgress,
  Typography,
  Alert,
} from "@mui/material";
import { api } from "../../services/api";

export const AutoBookDialog = ({ open, onClose, onConfirm }) => {
  const [pageCount, setPageCount] = useState(5);
  const [author, setAuthor] = useState("");
  const [theme, setTheme] = useState("");
  const [options, setOptions] = useState({ authors: [], themes: [] });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await api.getBookOptions();
        setOptions(data);
        setLoading(false);
      } catch (error) {
        console.error("Seçenekler yüklenirken hata:", error);
        setError("Seçenekler yüklenirken bir hata oluştu");
      }
    };

    if (open) {
      fetchOptions();
    }
  }, [open]);

  useEffect(() => {
    let progressInterval;

    const checkProgress = async () => {
      if (!currentBookId) return;

      try {
        const progressData = await api.getBookProgress(currentBookId);
        setProgress(progressData.progress);

        if (progressData.status === "error") {
          setError(progressData.error);
          setIsCreating(false);
          clearInterval(progressInterval);
        } else if (progressData.status === "completed") {
          setIsCreating(false);
          clearInterval(progressInterval);
          setTimeout(() => handleClose(), 1000);
        }
      } catch (error) {
        console.error("İlerleme kontrolü hatası:", error);
        setError("İlerleme kontrolü sırasında bir hata oluştu");
        setIsCreating(false);
        clearInterval(progressInterval);
      }
    };

    if (isCreating && currentBookId) {
      progressInterval = setInterval(checkProgress, 1000);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [currentBookId, isCreating]);

  const handleConfirm = async () => {
    setIsCreating(true);
    setProgress(0);
    setError(null);

    try {
      const result = await onConfirm(pageCount, author, theme);

      if (result && result.id) {
        setCurrentBookId(result.id);
      } else {
        throw new Error("Kitap oluşturulamadı");
      }
    } catch (error) {
      console.error("Kitap oluşturma hatası:", error);
      setError(error.message || "Kitap oluşturulurken bir hata oluştu");
      setIsCreating(false);
      setCurrentBookId(null);
    }
  };

  const handleClose = () => {
    setPageCount(5);
    setAuthor("");
    setTheme("");
    setIsCreating(false);
    setProgress(0);
    setCurrentBookId(null);
    setError(null);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Typography>Yükleniyor...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={isCreating ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isCreating ? "Kitap Oluşturuluyor..." : "Otomatik Kitap Oluştur"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isCreating ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Sayfalar oluşturuluyor: {Math.ceil((progress / 100) * pageCount)}/
              {pageCount}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 10, borderRadius: 1 }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              %{Math.round(progress)}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Sayfa Sayısı"
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 20 }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Yazar Tarzı</InputLabel>
              <Select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                label="Yazar Tarzı"
              >
                {options.authors.map((auth) => (
                  <MenuItem key={auth.id} value={auth.id}>
                    {auth.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Tema</InputLabel>
              <Select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                label="Tema"
              >
                {options.themes.map((thm) => (
                  <MenuItem key={thm.id} value={thm.id}>
                    {thm.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {!isCreating && (
          <>
            <Button onClick={handleClose}>İptal</Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={
                !pageCount ||
                !author ||
                !theme ||
                pageCount < 1 ||
                pageCount > 20
              }
            >
              Oluştur
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
