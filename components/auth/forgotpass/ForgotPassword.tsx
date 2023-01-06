import { Auth } from "aws-amplify";
import { useAlertContext } from "../../../src/contexts/alert-context";
import { useLoading } from "../../../src/contexts/loading-context";
import { validateSchema } from "../../../src/utils/schema";
import { ForgotPasswordProps } from "../interface";
import { forgotSchema } from "../schema";
import ForgotPasswordView from "./ForgotPasswordView";

const ForgotPassword = ({
  form,
  onChange,
  setFormType,
}: ForgotPasswordProps) => {
  const { setAlertMessage } = useAlertContext();
  const { setLoading,loading } = useLoading();

  async function send() {
    if(loading){
      return;
    }
    if(!validateSchema(forgotSchema, form, setAlertMessage)){
      return;
    }
    setLoading(true);
    try {
      await Auth.forgotPassword(form.email);
      setFormType("confirm");
    } catch (err: any) {
      switch (err.code) {
        case "UserNotFoundException":
          setAlertMessage("Correo Electrónico no Encontrado");
          break;
        case "LimitExceededException":
          setAlertMessage("Haz agotado el límite de intentos de solicitud de código, intenta más tarde.");
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
  return <ForgotPasswordView send={send} onChange={onChange} />;
};

export default ForgotPassword;
