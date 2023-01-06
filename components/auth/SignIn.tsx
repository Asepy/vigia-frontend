import React from "react";
import BoxContainer from "../ui/BoxContainer";
import Confirm from "./Confirm";
import ForceChangePass from "./ForceChangePass";
import { FormType } from "./interface";
import SignInForm from "./signin/SignIn";

const SignIn = () => {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    newPassword: "",
    code: "",
    oldPassword: "",
    confirmPassword:"",
  });
  const [formType, setFormType] = React.useState<FormType>("form");
  const [userAuthTemp, setUserAuthTemp] = React.useState<any>({});
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <BoxContainer
      sx={{ paddingTop: { xs: "6rem" }, paddingBottom: { xs: "6rem" } }}
    >
      {formType === "form" && (
        <SignInForm 
        userAuth={userAuthTemp}
        setUserAuth={setUserAuthTemp}
        form={form} 
        onChange={onChange} 
        setFormType={setFormType} />
      )}
      {formType === "confirm" && (
        <Confirm
          type="signIn"
          userAuth={userAuthTemp}
          setUserAuth={setUserAuthTemp}
          form={form}
          onChange={onChange}
          setFormType={setFormType}
        />
      )}
      {formType === "password" && (
        <ForceChangePass
          type="signIn"
          userAuth={userAuthTemp}
          setUserAuth={setUserAuthTemp}
          form={form}
          onChange={onChange}
          setFormType={setFormType}
        />
      )}
    </BoxContainer>
  );
};

export default SignIn;
