import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React from "react";
import styles from "../../styles/Login.module.scss";
import { PersonalizedText, ThemeProvider } from "../ui/DesignElements";

const Field = ({ title, ...props }: TextFieldProps) => {
  return (
    <>
      <Box className={styles.InputTitle}>
        <span>{title} </span>
        <span className={styles.ColorDanger}>*</span>
      </Box>
      <ThemeProvider theme={PersonalizedText}>
        <TextField
          type="text"
          variant="filled"
          fullWidth
          className={styles.InputText + " " + "InputTest"}
          {...props}
        />
      </ThemeProvider>
    </>
  );
};

export default Field;
