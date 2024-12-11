import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slider,
  Typography,
  Box,
} from "@mui/material";

export const AddPagesDialog = ({ open, onClose, onConfirm }) => {
  const [pageCount, setPageCount] = useState(1);

  const handleSliderChange = (event, newValue) => {
    setPageCount(newValue);
  };

  const handleInputChange = (event) => {
    const value = event.target.value === "" ? 0 : Number(event.target.value);
    if (value >= 1 && value <= 20) {
      setPageCount(value);
    }
  };

  const handleConfirm = () => {
    if (pageCount >= 1 && pageCount <= 20) {
      onConfirm(pageCount);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Sayfalar Ekle</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            Kitaba kaç sayfa eklemek istersiniz?
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <Slider
              value={pageCount}
              onChange={handleSliderChange}
              min={1}
              max={20}
              valueLabelDisplay="auto"
              sx={{ flexGrow: 1 }}
            />
            <TextField
              value={pageCount}
              onChange={handleInputChange}
              type="number"
              inputProps={{
                min: 1,
                max: 20,
                step: 1,
              }}
              sx={{ width: 100 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Not: Bir seferde 1-20 arası sayfa ekleyebilirsiniz.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={pageCount < 1 || pageCount > 20}
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
};
