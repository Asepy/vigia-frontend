import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { useAlertContext } from "../../../src/contexts/alert-context";
import { useAuth } from "../../../src/contexts/auth-context";
import { useLoading } from "../../../src/contexts/loading-context";
import { validateSchema } from "../../../src/utils/schema";
import { SignInProps } from "../interface";
import { loginSchema } from "../schema";
import SignInView from "./SignInView";
import fetchData from "../../../src/utils/fetch";
const SignIn = ({ form, onChange, setFormType,userAuth,setUserAuth }: SignInProps) => {
  const router = useRouter();
  const { signIn } = useAuth();
  const { setAlertMessage } = useAlertContext();
  const { setLoading,loading } = useLoading();

  async function login() {
    if(loading){
      return;
    }
    if (!validateSchema(loginSchema, form, setAlertMessage)) {
      return;
    }
    setLoading(true);
    try {
      const user = await Auth.signIn(form.email, form.password);
    
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        
        setUserAuth(user);
        setAlertMessage("Debes cambiar tu contraseña");
        setFormType("password");
      } else {
        let login:string|number|undefined=undefined;
        try{
          const data: any|null = await fetchData("setLogin",{},"POST",true);
          login = data?.id
        }catch(e){

        }
        
        await signIn(user, login);
        /*logeo */
       
        router.push("/app/panel");
        
        
      }
    } catch (err: any) {
      switch (err.code) {
        case "UserNotFoundException":
          setAlertMessage("Correo Electrónico no Encontrado");
          break;
        case "NotAuthorizedException":
          setAlertMessage("Correo Electrónico o Contraseña Incorrectos");
          break;
        case "UserNotConfirmedException":
          setAlertMessage("Confirma tu correo electrónico");
          setFormType("confirm");
          break;
        case "PasswordResetRequiredException":
          setAlertMessage("Debes Cambiar tu contraseña, ve a olvide mi contraseña");
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
  return <SignInView login={login} onChange={onChange} />;
};

export default SignIn;
