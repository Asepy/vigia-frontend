import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "../../styles/Login.module.scss";
import CodeField from "../fields/CodeField";
import PasswordField from "../fields/PasswordField";
import LoadingButton from "../ui/LoadingButton";
import { ConfirmViewProps } from "./interface";

const ForgotPassConfirmView = ({
  confirm,
  onChange,
  reSendCode,
  setFormType,
}: ConfirmViewProps) => {
  return (
    <Box className={styles.UserContainer}>
      <h2 className={styles.TitleContainerGray}>Cambiar Contraseña</h2>
      <Typography
        variant="inherit"
        component="h3"
        className={styles.ProcessPropertyText + " " + styles.ColorTextGray}
        sx={{ marginTop: "0" }}
      >
        Ingresa el código enviado a tu correo electrónico para cambiar tu
        contraseña
      </Typography>
      <Box>
        <CodeField onChange={onChange} />
        <PasswordField
          placeholder="Ingrese la nueva contraseña"
          onChange={onChange}
        />
        <PasswordField
          title="Confirmación"
          placeholder="Repita la contraseña"
          name="confirmPassword"
          onChange={onChange}
          onKeyDown={confirm}
        />
        <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
          <LoadingButton title="Cambiar contraseña" onClick={confirm}>
            Cambiar contraseña
          </LoadingButton>
        </Box>
        <Box
          sx={{
            paddingTop: "10px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          
        >
         

          <Typography onClick={reSendCode} sx={{cursor:"pointer"}} className={styles.UserContainerText}>
            Reenviar Código
            </Typography>
        </Box>
        <Box
          sx={{
            paddingTop: "10px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          className={styles.UserContainerText}
        >
          {/*
          <Link href="/login" onClick={() => setFormType("form")}>
            <a>Entrar</a>
          </Link>
          */
          }
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassConfirmView;
