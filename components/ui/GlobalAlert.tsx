import CloseIcon from "@mui/icons-material/Close";
import { Alert, AlertColor, IconButton, Snackbar } from "@mui/material";
import React from "react";
import { useAlertContext } from "../../src/contexts/alert-context";
import styles from "../../styles/Login.module.scss";

const GlobalAlert = () => {
  const [severity, setSeverity] = React.useState<AlertColor>("error");
  const [message, setMessage] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const { alertMessage, setAlertMessage } = useAlertContext();

  React.useEffect(() => {
    

    if (typeof alertMessage === "string") {
      
      if(alertMessage !== ""){
        setMessage(alertMessage);
        setSeverity("error");
      }
      
    } else {
      if(alertMessage.message !== ""){
        setMessage(alertMessage.message);
        setSeverity(alertMessage.severity);
      }
      
    }
    setOpen(alertMessage !== "" );
    
  }, [alertMessage]);
  const handleSnackbarClose = (_: any, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
  };
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleSnackbarClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
  return (
    <Snackbar
      action={action}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={6000}
      className={styles.MessageText}
      onClose={handleSnackbarClose}
      open={open}
    >
      <Alert
        onClose={handleSnackbarClose}
        sx={{ width: "100%" }}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalAlert;
