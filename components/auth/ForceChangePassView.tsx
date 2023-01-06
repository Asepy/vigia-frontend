import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "../../styles/Login.module.scss";
import CodeField from "../fields/CodeField";
import PasswordField from "../fields/PasswordField";
import LoadingButton from "../ui/LoadingButton";
import { ForcePasswordViewProps } from "./interface";

const ForceChangePassView = ({
  confirm,
  onChange,
  setFormType,
}: ForcePasswordViewProps) => {
  return (
    <Box className={styles.UserContainer}>
      <h2 className={styles.TitleContainerGray}>Cambiar Contraseña</h2>
      <Typography
        variant="inherit"
        component="h3"
        className={styles.ProcessPropertyText + " " + styles.ColorTextGray}
        sx={{ marginTop: "0" }}
      >
        Debes cambiar la contraseña de tu cuenta
      </Typography>
      <Box>


    
            <PasswordField
              title="Nueva contraseña"
              name="password"
              placeholder="Ingresa una nueva contraseña"
              onChange={onChange}
            />
            <PasswordField
              title="Confirmación de contraseña"
              name="confirmPassword"
              placeholder="Confirme la nueva contraseña"
              onChange={onChange}
            />
        <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
         
          <LoadingButton title="Confirmar" onClick={confirm}>
            Aceptar
          </LoadingButton>
        </Box>
    
        <Box
          sx={{
            paddingTop: "5px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          className={styles.UserContainerText }
        >
          <Typography  onClick={() => setFormType("form")} sx={{cursor:"pointer"}} className={styles.UserContainerText }>
            Ingresar con otra cuenta
            </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForceChangePassView;
