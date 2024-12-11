import React from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

export const LoadingOverlay = ({ open, message }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: "column",
        gap: 2,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      {message && (
        <Typography variant="h6" component="div">
          {message}
        </Typography>
      )}
    </Backdrop>
  );
};
