import Box from "@mui/material/Box";
import Link from "next/link";
import styles from "../../../styles/Login.module.scss";
import EmailField from "../../fields/EmailField";
import { OnChangeProps } from "../../fields/interface";
import PasswordField from "../../fields/PasswordField";
import LoadingButton from "../../ui/LoadingButton";

interface SignInViewProps extends OnChangeProps {
  login: () => void;
}

const SignInView = ({ login, onChange }: SignInViewProps) => {
  return (
    <Box className={styles.UserContainer}>
      <h2 className={styles.TitleContainerGray}>Iniciar Sesión</h2>
      <Box>
        <EmailField onChange={onChange} />
        <PasswordField onChange={onChange} onKeyDown={login}></PasswordField>
        <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
          <LoadingButton title="Ingresar" onClick={login}>
            Ingresar
          </LoadingButton>
        </Box>

        <Box
          sx={{ paddingTop: "20px", textAlign: "center" }}
          className={styles.UserContainerText}
        >
          ¿Olvidaste tu Contraseña?
        </Box>
        <Box
          sx={{
            paddingTop: "5px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          className={styles.UserContainerText + " " + styles.FontColorSecondary}
        >
          <Link href="/forgotPassword">
            <a>Haz click aquí</a>
          </Link>
        </Box>
        <Box
          sx={{
            paddingTop: "10px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          className={styles.UserContainerText}
        >
          <Link href="/register">
            <a>No tengo una cuenta</a>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInView;
