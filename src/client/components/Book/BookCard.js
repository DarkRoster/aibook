import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export const BookCard = ({ book, isSelected, onClick }) => {
  return (
    <Paper
      elevation={isSelected ? 3 : 1}
      sx={{
        p: 3,
        mb: 2,
        cursor: "pointer",
        backgroundColor: isSelected ? "#f5f9ff" : "white",
        borderColor: isSelected ? "#2196f3" : "transparent",
        borderWidth: 1,
        borderStyle: "solid",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: isSelected ? "#f5f9ff" : "#fafafa",
          borderColor: "#2196f3",
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" component="h3">
            Kitap {book.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.pages?.length || 0} sayfa
          </Typography>
        </Box>
        {isSelected && (
          <Typography color="primary" variant="body2" fontWeight="500">
            Seçili
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
