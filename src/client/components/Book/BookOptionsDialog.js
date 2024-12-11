import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { api } from "../../services/api";

export function BookOptionsDialog({ open, onClose, onConfirm, mode }) {
  const [options, setOptions] = useState({ authors: [], themes: [] });
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await api.getBookOptions();
        setOptions(data);
        setLoading(false);
      } catch (error) {
        console.error("Seçenekler yüklenirken hata:", error);
      }
    };

    if (open) {
      fetchOptions();
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(selectedAuthor, selectedTheme);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === "auto" ? "Otomatik Kitap Oluştur" : "Yeni Kitap Oluştur"}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Yazar</InputLabel>
          <Select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            label="Yazar"
          >
            {options.authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Konu</InputLabel>
          <Select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            label="Konu"
          >
            {options.themes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                {theme.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedAuthor || !selectedTheme}
          variant="contained"
        >
          Oluştur
        </Button>
      </DialogActions>
    </Dialog>
  );
}
