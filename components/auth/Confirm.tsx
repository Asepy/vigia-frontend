import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { useAlertContext } from "../../src/contexts/alert-context";
import { useLoading } from "../../src/contexts/loading-context";
import { validateSchema } from "../../src/utils/schema";
import ConfirmView from "./ConfirmView";
import { ConfirmProps } from "./interface";
import { confirmSchema } from "./schema";

const Confirm = ({ form, type, onChange, setFormType }: ConfirmProps) => {
  const router = useRouter();
  const { setAlertMessage } = useAlertContext();
  const { setLoading } = useLoading();

  async function confirm() {
    if (!validateSchema(confirmSchema, form, setAlertMessage)) {
      return;
    }
    setLoading(true);
    try {
      await Auth.confirmSignUp(form.email, form.code);
      setFormType("form");
      setAlertMessage({ message: "Cuenta activada", severity: "success" });
      if (type === "signUp") {
        router.push("/login");
      }
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
      const reSend = await Auth.resendSignUp(form.email);
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
    <ConfirmView
      confirm={confirm}
      onChange={onChange}
      reSendCode={reSendCode}
      setFormType={setFormType}
    />
  );
};

export default Confirm;
