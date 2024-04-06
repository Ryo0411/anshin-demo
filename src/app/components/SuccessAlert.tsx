import React from "react";
import { Alert, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type SuccessAlertProps = {
  message: string;
  onClose: () => void; // ポップアップを閉じるための関数
};

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
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
        severity="success"
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

export default SuccessAlert;
