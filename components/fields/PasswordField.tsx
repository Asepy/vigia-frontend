import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { TextFieldProps } from "@mui/material/TextField";
import React from "react";
import styles from "../../styles/Login.module.scss";
import Field from "./Field";

const PasswordField = ({ onKeyDown: pressEnter, ...props }: TextFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  function passwordVisibility() {
    setShowPassword(!showPassword);
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && pressEnter) {
      pressEnter(e);
    }
  }
  const icon = showPassword ? (
    <VisibilityOffIcon className={styles.SearchIconTextAdornment} />
  ) : (
    <VisibilityIcon className={styles.SearchIconTextAdornment} />
  );
  return (
    <Field
      title="Contraseña"
      placeholder="Ingresa una contraseña"
      name="password"
      type={showPassword ? "text" : "password"}
      onKeyDown={onKeyDown}
      InputProps={{
        disableUnderline: false,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              edge="end"
              className={styles.SearchButtonTextAdornment}
              onClick={passwordVisibility}
            >
              {icon}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default PasswordField;
