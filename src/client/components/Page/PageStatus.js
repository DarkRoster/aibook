import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useBookStatus } from "../../hooks/useBookStatus";

export const PageStatus = ({ bookId }) => {
  const { status, loading, error } = useBookStatus(bookId);

  if (!status || loading) return null;
  if (error) return null;

  const progress =
    status.totalPages > 0 ? (status.currentPage / status.totalPages) * 100 : 0;

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {status.status === "creating" ? "Oluşturuluyor..." : "Tamamlandı"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${status.currentPage}/${status.totalPages} sayfa`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};
