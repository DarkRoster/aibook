import React from "react";
import { Alert, Box } from "@mui/material";

export const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );
};
