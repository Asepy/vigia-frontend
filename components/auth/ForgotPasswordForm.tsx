import React from "react";
import BoxContainer from "../ui/BoxContainer";
import ForgotPassConfirm from "./ForgotPassConfirm";
import ForgotPassword from "./forgotpass/ForgotPassword";
import { FormType } from "./interface";

const ForgotPasswordForm = () => {
  const [form, setForm] = React.useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [formType, setFormType] = React.useState<FormType>("form");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <BoxContainer
      sx={{ paddingTop: { xs: "6rem" }, paddingBottom: { xs: "6rem" } }}
    >
      {formType === "form" && (
        <ForgotPassword
          form={form}
          onChange={onChange}
          setFormType={setFormType}
        />
      )}
      {formType === "confirm" && (
        <ForgotPassConfirm
          form={form}
          onChange={onChange}
          setFormType={setFormType}
        />
      )}
    </BoxContainer>
  );
};

export default ForgotPasswordForm;
