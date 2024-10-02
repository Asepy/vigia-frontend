import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React from "react";
import { useAlertContext } from "../../src/contexts/alert-context";
import { useAuth } from "../../src/contexts/auth-context";
import { useLoading } from "../../src/contexts/loading-context";
import { User } from "../../src/interfaces/user";
import { validateSchema } from "../../src/utils/schema";
import { ProfileForm } from "./interface";
import ProfileView from "./ProfileView";
import { profileSchema } from "./schema";
import fetchData from "../../src/utils/fetch";
const Profile = () => {
  const router = useRouter();
  const { setLoading,loading } = useLoading();
  const { setAlertMessage } = useAlertContext();
  const { user, signIn } = useAuth();
  const [form, setForm] = React.useState<ProfileForm>({
    names: "",
    lastNames: "",
    ruc: "",
    email: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
    clave: "",
    notifications:""
  });

  React.useEffect(() => {
    console.dir('use effect profile')
    console.dir(user)
    setForm({
      names: user?.given_name ?? "",
      lastNames: user?.family_name ?? "",
      ruc: "",
      email: user?.email ?? "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
      clave: "",
      notifications: user?.notifications ??  "SI"
    });
  }, [user]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  
  }

  async function updateProfile() {
    if (!validateSchema(profileSchema, form, setAlertMessage)) {
      return;
    }
    setLoading(true);
    try {
      let attributes: any = {
        given_name: form.names,
        family_name: form.lastNames,
        email: form.email,
      };
      const userAuth = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(userAuth, attributes);
      


      
      if((userAuth?.attributes?.email)!= form.email.trim()){
        attributes = {
          ...attributes,
          ...{email_verified:false}
        }
      }
      
      if (form.oldPassword && form.password && form.confirmPassword) {
        await Auth.changePassword(userAuth, form.oldPassword, form.password);
      }

      const data:any|null = await fetchData("setNotifications",{notification:form.notifications},"POST",true);
      
      console.dir('notificaciones actualizadas')
      console.dir(data)
  
      
      const currentUser = await Auth.currentAuthenticatedUser();
      if (currentUser) {
        signIn(currentUser);
      }

      
      
    
      setAlertMessage({
        message: "Datos actualizados correctamente",
        severity: "success",
      });
      setTimeout(()=>{
        router.push("/app/panel");
      },500)
      
    } catch (err:any) {
      
      switch (err.code) {
        case "AliasExistsException":
          setAlertMessage({
            message: "Ya existe una cuenta usando este correo electrónico",
            severity: "error",
          });
          break;
        default:
          setAlertMessage({
            message: "Ocurrio un error al actualizar tus datos",
            severity: "error",
          });
          break;
      }
      
      
      console.dir(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProfileView
      form={form}
      onChange={onChange}
      updateProfile={updateProfile}
      loading={loading}
    />
  );
};

export default Profile;
