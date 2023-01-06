import { OnChangeProps } from "../fields/interface";

export interface ConfirmForm {
  email: string;
  password: string;
  code: string;
}


export interface ForcePasswordForm {
  //oldPassword: string;
  password: string;
  confirmPassword:string;
}
export interface ForcePasswordConfirmProps extends OnChangeProps {
  form: any;
  setFormType: (formType: FormType) => void;
}
export interface ForcePasswordProps extends ForcePasswordConfirmProps {
  userAuth?:any;
  setUserAuth?:any;
  type: Type;
}

export interface SignInForm extends ConfirmForm {
  newPassword: string;
}

export interface ForgotPasswordForm extends ConfirmForm {
  confirmPassword: string;
}

export interface SignUpForm extends ConfirmForm {
  names: string;
  lastNames: string;
}

export type Type = "signIn" | "signUp";
export type FormType = "form" | "confirm" | "password";

export interface ForgotPassConfirmProps extends OnChangeProps {
  form: ConfirmForm;
  setFormType: (formType: FormType) => void;
}

export interface ConfirmViewProps extends OnChangeProps {
  confirm: () => void;
  reSendCode: () => void;
  setFormType: (formType: FormType) => void;
}

export interface ForcePasswordViewProps extends OnChangeProps {
  confirm: () => void;
  setFormType: (formType: FormType) => void;
}

export interface ConfirmProps extends ForgotPassConfirmProps {
  type: Type;
  userAuth?:any;
  setUserAuth?:any;
}






export interface SignInProps extends ForgotPassConfirmProps {
  form: SignInForm;
  userAuth?:any;
  setUserAuth?:any;
}

export interface ForgotPasswordProps extends ForgotPassConfirmProps {
  form: ForgotPasswordForm;
}

export interface SignUpProps extends ForgotPassConfirmProps {
  form: SignUpForm;
}
