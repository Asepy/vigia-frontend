import { Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextFieldProps } from "@mui/material/TextField";
import styles from "../../styles/Login.module.scss";

const PersonalizedTextArea = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "1.5rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
type textArea ={ valueLength:string|number } &  TextFieldProps;
const TextArea = ({ title,valueLength, ...props }:  textArea) => {
  return (
    <>
      <Box className={styles.InputTitle}>
        <span>
          {title}{((props?.inputProps?.maxLength)&&(valueLength !==undefined&&valueLength !==null))?<b>{` (${valueLength}/${(props?.inputProps?.maxLength)})`}</b>:''} <span className={styles.ColorDanger}>*</span>
        </span>
      </Box>
      <ThemeProvider theme={PersonalizedTextArea}>
        <TextField
          type="text"
          variant="filled"
          multiline
          rows={3}
          fullWidth
          className={styles.InputText}
          {...props}
        />
      </ThemeProvider>
    </>
  );
};

export default TextArea;
