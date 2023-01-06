import Box from "@mui/material/Box";
import Link from "next/link";
import styles from "../../../styles/Login.module.scss";
import EmailField from "../../fields/EmailField";
import Field from "../../fields/Field";
import { OnChangeProps } from "../../fields/interface";
import PasswordField from "../../fields/PasswordField";
import LoadingButton from "../../ui/LoadingButton";

interface SignUpViewProps extends OnChangeProps {
  signUp: () => void;
}

const SignUpView = ({ signUp, onChange }: SignUpViewProps) => {
  return (
    <Box className={styles.UserContainer}>
      <h2 className={styles.TitleContainerGray}>Registro</h2>
      <Box>
        <Field
          title="Nombres"
          placeholder="Pedro Alberto"
          name="names"
          onChange={onChange}
        />
        <Field
          title="Apellidos"
          placeholder="Perez Rodriguez"
          name="lastNames"
          onChange={onChange}
        />
        <EmailField onChange={onChange} />
        <PasswordField onChange={onChange} onKeyDown={signUp}></PasswordField>
        <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
          <LoadingButton title="Registrar Usuario" onClick={signUp}>
            Registrarme
          </LoadingButton>
        </Box>

        <Box
          sx={{ paddingTop: "20px", textAlign: "center" }}
          className={styles.UserContainerText}
        >
          ¿Ya tienes una cuenta?
        </Box>
        <Box
          sx={{
            paddingTop: "5px",
            textAlign: "center",
            textDecoration: "underline",
          }}
          className={styles.UserContainerText + " " + styles.FontColorSecondary}
        >
          <Link href="/login">
            <a>Inicia Sesión</a>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpView;
