import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/ui/Layout/Layout";
import { CONSULTA, TypeClaimOrQuestion } from "../../src/interfaces/type-claim-or-question";
import styles from "../../styles/Login.module.scss";

const TWITTER_USER = process.env.NEXT_PUBLIC_TWITTER_USER;

const AppPublicationFinishAgent: NextPage = () => {
  const {
    query: { enlace, shortUrl, tipo, tweet },
  } = useRouter();
  const type = tipo as TypeClaimOrQuestion;
  console.dir(tipo)
  const agentLink = `${type === CONSULTA ? "/app/questionAgent" : "/app/claimAgent" }?id=${enlace}`;
  const shortLink = `${type === CONSULTA ? "/questions/question" : "/claims/claim"  }?id=${enlace}`;
  const url = shortUrl ? decodeURIComponent(shortUrl.toString()) : "";
  const tweetText = tweet ? decodeURIComponent(tweet.toString()) : "";
  return (
    <Layout titleDescription="VigiA - Publicación Realizada">
      <Box
        sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 259px)" } }}
        className={styles.BackgroundSecondaryColor}
      >
        <Container
          sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
        >
          <Box className={styles.FormContainer}>
            <Typography
              variant="inherit"
              component="h2"
              className={styles.TitleContainerFormGray}
            >
              Tweet Publicado, Proceso
              <span className={styles.ColorText}> #{enlace} </span>
            </Typography>
            <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                  <img
                    src="/images/icons/twitter.svg"
                    className={styles.FinishImage}
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                  <Box className={styles.PublicationBox}>
                    <Typography
                      variant="inherit"
                      component="p"
                      className={styles.ItemsContainerText}
                    >
                      <span className={styles.Block}>{tweetText}</span>
                      
                    </Typography>
                  </Box>
                  <Link href={shortLink}>
                        <a className={styles.LinkedText}>{url}</a>
                      </Link>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <Typography
                variant="inherit"
                component="p"
                className={styles.ItemsContainerText}
                sx={{ mt: 1 }}
              >
                Puedes ver este tweet en el twitter de <Link href={`https://twitter.com/${TWITTER_USER}`}>
                  <a ><span className={styles.ColorText}>
                  
                  <b> @{TWITTER_USER}</b>
                </span></a></Link>
                
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: {
                  xs: "center",
                  sm: "right",
                },
              }}
              className={styles.MultipleButtons}
            >
              <Link href={agentLink}>
                <Button
                  title="Aceptar"
                  variant="contained"
                  disableElevation
                  className={
                    styles.ButtonPrincipal + " " + styles.ButtonContrast_3
                  }
                >
                  Aceptar
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default AppPublicationFinishAgent;
