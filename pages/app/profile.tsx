import React from "react";
import type { NextPage } from "next";
import Profile from "../../components/profile/Profile";
import Layout from "../../components/ui/Layout/Layout";

const Login: NextPage = () => {
  return (
    <Layout titleDescription="VigiA - Perfil de Usuairo">
      <Profile />
    </Layout>
  );
};

export default Login;
