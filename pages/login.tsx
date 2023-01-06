import type { NextPage } from "next";
import SignIn from "../components/auth/SignIn";
import Layout from "../components/ui/Layout/Layout";

const Login: NextPage = () => {
  return (
    <Layout metaDescription="Iniciar Sesión">
      <SignIn />
    </Layout>
  );
};

export default Login;
