import type { NextPage } from "next";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import Layout from "../components/ui/Layout/Layout";

const ForgotPassword: NextPage = () => {
  return (
    <Layout metaDescription="Olvidaste tu contraseña">
      <ForgotPasswordForm />
    </Layout>
  );
};

export default ForgotPassword;
