import { Box } from "@mui/material";
import React from "react";
import EmailField from "../../fields/EmailField";
import BoxContainer from "../../ui/BoxContainer";
import LoadingButton from "../../ui/LoadingButton";
import styles from "../../../styles/Login.module.scss";

type ForgotPasswordProps = {
  send: () => void;
  onChange: (_: React.ChangeEvent<HTMLInputElement>) => void;
};

const ForgotPassword = ({ send, onChange }: ForgotPasswordProps) => {
  return (
    <BoxContainer
      sx={{ paddingTop: { xs: "6rem" }, paddingBottom: { xs: "6rem" } }}
    >
      <Box className={styles.UserContainer}>
        <h2 className={styles.TitleContainerGray}>Recuperar Contraseña</h2>
        <Box>
          <EmailField onChange={onChange} />
          <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
            <LoadingButton title="Enviar" onClick={send}>
              Enviar
            </LoadingButton>
          </Box>
          <Box
            sx={{ paddingTop: "20px", textAlign: "center" }}
            className={styles.UserContainerText}
          >
            Ingresa el correo electrónico con el que creaste tu cuenta, para
            enviarte el código de recuperación.
          </Box>
        </Box>
      </Box>
    </BoxContainer>
  );
};

export default ForgotPassword;
