import React from "react";
import BoxContainer from "../ui/BoxContainer";
import Confirm from "./Confirm";
import { FormType } from "./interface";
import SignUpForm from "./signup/SignUp";

const SignUp = () => {
  const [form, setForm] = React.useState({
    names: "",
    lastNames: "",
    email: "",
    password: "",
    code: "",
  });
  const [formType, setFormType] = React.useState<FormType>("form");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <BoxContainer
      sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
    >
      {formType === "form" && (
        <SignUpForm form={form} onChange={onChange} setFormType={setFormType} />
      )}
      {formType === "confirm" && (
        <Confirm
          type="signUp"
          form={form}
          onChange={onChange}
          setFormType={setFormType}
        />
      )}
    </BoxContainer>
  );
};

export default SignUp;
