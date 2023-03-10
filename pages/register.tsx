import type { NextPage } from "next";
import SignUp from "../components/auth/SignUp";
import Layout from "../components/ui/Layout/Layout";

const Register: NextPage = () => {
  return (
    <Layout metaDescription="Registrar Usuario"  titleDescription="VigiA - Registro de Usuario">
      <SignUp />
    </Layout>
  );
};

export default Register;
