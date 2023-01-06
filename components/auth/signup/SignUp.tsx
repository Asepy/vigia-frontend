import { Auth } from "aws-amplify";
import { useAlertContext } from "../../../src/contexts/alert-context";
import { useLoading } from "../../../src/contexts/loading-context";
import { validateSchema } from "../../../src/utils/schema";
import { SignUpProps } from "../interface";
import { registerSchema } from "../schema";
import SignUpView from "./SignUpView";

const SignUp = ({ form, onChange, setFormType }: SignUpProps) => {
  const { setAlertMessage } = useAlertContext();
  const { setLoading,loading } = useLoading();

  async function signUp() {
    if(loading){
      return;
    }
    if (!validateSchema(registerSchema, form, setAlertMessage)) {
      return;
    }
    
    setLoading(true);
    try {
      const attributes = {
        email: form.email,
        given_name: form.names,
        family_name: form.lastNames,
      };
      await Auth.signUp({
        username: form.email,
        password: form.password,
        attributes,
      });
      setAlertMessage({
        message:
          "Usuario registrado correctamente, favor revisa tu correo electrónico para obtener código de confirmación",
        severity: "success",
      });
      setFormType("confirm");
    } catch (err: any) {
      switch (err.code) {
        case "UserNotFoundException":
          setAlertMessage("Correo Electrónico no Encontrado");
          break;
        case "NotAuthorizedException":
          setAlertMessage("Correo Electrónico o Contraseña Incorrectos");
          break;
        case "UsernameExistsException":
          setAlertMessage("Ya existe una cuenta con este correo electrónico");
          break;
        case "UserNotConfirmedException":
          setAlertMessage("Confirma tu correo electrónico");
          setFormType("confirm");
          break;
        default:
          setAlertMessage("Error: " + err.message);
          break;
      }
      console.error({ err });
    } finally {
      setLoading(false);
    }
  }
  return <SignUpView signUp={signUp} onChange={onChange} />;
};

export default SignUp;
