import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { useAlertContext } from "../../src/contexts/alert-context";
import { useLoading } from "../../src/contexts/loading-context";
import { validateSchema } from "../../src/utils/schema";
import ForceChangePassView from "./ForceChangePassView";
import { ForcePasswordProps } from "./interface";
import { forcePasswordSchema } from "./schema";

const ForceChangePass = ({ userAuth,form, type, onChange, setFormType }: ForcePasswordProps) => {
  const router = useRouter();
  const { setAlertMessage } = useAlertContext();
  const { setLoading } = useLoading();

  async function confirm() {
    if (!validateSchema(forcePasswordSchema, form, setAlertMessage)) {
      return;
    }
    setLoading(true);
    try {
      await Auth.completeNewPassword(userAuth,  form.password);
      setAlertMessage({ message: "Contraseña Cambiada", severity: "success" });
      setFormType("form");
      setTimeout(() => {
        router.push("/login");
      }, 300);
      
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
    <ForceChangePassView
      confirm={confirm}
      onChange={onChange}
      setFormType={setFormType}
    />
  );
};

export default ForceChangePass;
