import React from "react";
import { Alert, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type ErrorAlertProps = {
  message: string;
  onClose: () => void; // ポップアップを閉じるための関数
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
    >
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
