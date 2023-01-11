import Box from "@mui/material/Box";
import Head from "next/head";
import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
  metaDescription?: string;
  titleDescription?:string;
};

const Layout = ({ children, metaDescription,titleDescription }: LayoutProps) => {
  return (
    <>
      <Head>
        {
          titleDescription&&<title>{titleDescription}</title>
        }
        <meta name="description" content={metaDescription ?? ""} />
        <link rel="icon" href="/favicon.ico" />
         
      </Head>
      <Navbar />
      <Box sx={{ marginTop: { xs: "56px", sm: "64px" } }}>{children}</Box>
      <Footer />
    </>
  );
};

export default Layout;
