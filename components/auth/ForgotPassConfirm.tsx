import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { useAlertContext } from "../../src/contexts/alert-context";
import { useLoading } from "../../src/contexts/loading-context";
import { validateSchema } from "../../src/utils/schema";
import ForgotPassConfirmView from "./ForgotPassConfirmView";
import { ForgotPassConfirmProps } from "./interface";
import { forgotConfirmSchema } from "./schema";

const ForgotPassConfirm = ({
  form,
  onChange,
  setFormType,
}: ForgotPassConfirmProps) => {
  const router = useRouter();
  const { setAlertMessage } = useAlertContext();
  const { setLoading } = useLoading();

  async function confirm() {
    if (!validateSchema(forgotConfirmSchema, form, setAlertMessage)) {
      return;
    }
    setLoading(true);
    try {
      await Auth.forgotPasswordSubmit(form.email, form.code, form.password);
      setFormType("form");
      setAlertMessage({
        message: "Contraseña cambiada correctamente",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      switch (err.code) {
        case "UserNotFoundException":
          setAlertMessage("Correo Electrónico no Encontrado");
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

  async function reSendCode() {
    setLoading(true);
    try {
      const reSend = await Auth.forgotPassword(form.email);
      setAlertMessage({
        message: "Correo electrónico enviado",
        severity: "success",
      });
      console.dir(reSend);
    } catch (err: any) {
      switch (err.code) {
        case "UserNotFoundException":
          setAlertMessage("Correo Electrónico no Encontrado");
          break;
        case "LimitExceededException":
          setAlertMessage(
            "Haz agotado el límite de intentos de solicitud de código, intenta más tarde."
          );
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
  return (
    <ForgotPassConfirmView
      confirm={confirm}
      onChange={onChange}
      reSendCode={reSendCode}
      setFormType={setFormType}
    />
  );
};

export default ForgotPassConfirm;
