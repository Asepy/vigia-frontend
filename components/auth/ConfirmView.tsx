import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "../../styles/Login.module.scss";
import CodeField from "../fields/CodeField";
import LoadingButton from "../ui/LoadingButton";
import { ConfirmViewProps } from "./interface";

const ConfirmView = ({
  confirm,
  onChange,
  reSendCode,
  setFormType,
}: ConfirmViewProps) => {
  return (
    <Box className={styles.UserContainer}>
      <h2 className={styles.TitleContainerGray}>Confirmar Cuenta</h2>
      <Typography
        variant="inherit"
        component="h3"
        className={styles.ProcessPropertyText + " " + styles.ColorTextGray}
        sx={{ marginTop: "0" }}
      >
        Ingresa el código enviado a tu correo electrónico para activar tu cuenta
      </Typography>
      <Box>
        <CodeField onChange={onChange} />
        <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
         
          <LoadingButton title="Confirmar" onClick={confirm}>
            Confirmar
          </LoadingButton>
        </Box>
        <Box
          sx={{
            paddingTop: "10px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          className={styles.UserContainerText}
        >
        
          <Typography  onClick={reSendCode} sx={{cursor:"pointer"}} className={styles.UserContainerText}>
            Reenviar Código
            </Typography>
        </Box>
        <Box
          sx={{
            paddingTop: "5px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          className={styles.UserContainerText + " " + styles.FontColorSecondary}
        >
          <Typography  onClick={() => setFormType("form")} sx={{cursor:"pointer"}} className={styles.UserContainerText + " " + styles.FontColorSecondary}>
            Ingresar con otra cuenta
            </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmView;
