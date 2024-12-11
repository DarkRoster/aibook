import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

export const PageNavigation = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  disabled = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Button
        startIcon={<NavigateBefore />}
        variant="outlined"
        onClick={onPrevious}
        disabled={disabled || currentPage === 0}
      >
        Önceki Sayfa
      </Button>

      <Typography>
        {totalPages > 0
          ? `Sayfa ${currentPage + 1} / ${totalPages}`
          : "Sayfa yok"}
      </Typography>

      <Button
        endIcon={<NavigateNext />}
        variant="outlined"
        onClick={onNext}
        disabled={disabled || currentPage === totalPages - 1}
      >
        Sonraki Sayfa
      </Button>
    </Box>
  );
};
