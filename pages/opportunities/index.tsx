import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Login.module.scss";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "../../components/ui/Layout/Layout";


const Opportunities: NextPage = () => {
  return (
    <>
      <Head>
        <title>VigiA - Oportunidades</title>
        <meta name="description" content="Iniciar Sesión" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <Layout>
        <Box
          sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 200px)" } }}
          className={styles.BackgroundSecondaryColor}
        >
          <Container
            sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
          >
            <Box className={styles.StartActionTitle}>
              ¡Busquemos las mejores oportunidades para vos!
            </Box>
            <Box className={styles.StartActionSubTitle}>
              Responde a las siguientes preguntas para identificar los llamados
              que mejor se adapten con lo que ofreces.
            </Box>

            <Box
              className={styles.StartActionSubTitle_2}
              sx={{ paddingTop: "1rem", display: "flex", alignItems: "center" }}
            >
              Solo toma 10 minutos
              <img
                src="/images/icons/cronometro.svg"
                className={styles.IconStartAction}
              />
            </Box>
            <Box sx={{ paddingTop: "5px", textAlign: "right" }}>
              <Link href="/opportunities/form">
                <a>
                  <Button
                    title="Encuentra Oportunidades"
                    variant="contained"
                    disableElevation
                    className={
                      styles.ButtonPrincipal + " " + styles.ButtonContrast_2
                    }
                  >
                    Comenzar
                  </Button>
                </a>
              </Link>
            </Box>
            <Box
              className={styles.StartActionSubTitle_3}
              sx={{ paddingTop: "1rem" }}
            >
              Si estás llenando esto sin haber iniciado sesión mantendrás tu
              anonimato y no guardaremos ninguno de los datos que ingreses.
              <br />
              Si deseas almacenar las características de tu empresa puedes
              identificarte iniciando sesión. Esto permitirá ver tus
              postulaciones y adjudicaciones anteriores y con esta información
              podremos buscar llamados similares.
            </Box>
          </Container>
        </Box>
      </Layout>
    </>
  );
};

export default Opportunities;
