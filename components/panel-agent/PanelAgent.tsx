import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { getNumber } from "../../components/imports/Functions";
import { useAuth } from "../../src/contexts/auth-context";
import fetchData from "../../src/utils/fetch";
import styles from "../../styles/Login.module.scss";
import BoxContainer from "../ui/BoxContainer";

const PanelAgent = () => {
  const { user,getActualUser } = useAuth();
  const { isReady } = useRouter();
  const [totalClaims, setTotalClaims] = React.useState(0);
  const [totalQuestions, setTotalQuestions] = React.useState(0);
  React.useEffect(() => {
    if (isReady) {
      getCountClaimsAgent();
      getCountQuestionsAgent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user]);

  async function getCountClaimsAgent() {
    try {
      let data: any =  await fetchData("getCountClaimsAgent",{},"POST",true);

      if (data?.total) {
        setTotalClaims(getNumber(data?.total));
      }
    } catch (e) {
      console.dir(e);
    }
  }
  async function pruebauser(){
    const test=await getActualUser();
    console.dir(test);

    
    
  }

  async function getCountQuestionsAgent() {
    try {
      let data: any = await fetchData("getCountQuestionsAgent",{},"POST",true);
      if (data?.total) {
        setTotalQuestions(getNumber(data?.total));
      }
    } catch (e) {
      console.dir(e);
    }
  }
  return (
    <BoxContainer
      sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
    >
      <Typography
        variant="inherit"
        component="h1"
        className={styles.StartActionTitle}
      >
        Bienvenido
      </Typography>

      <Typography
        variant="inherit"
        component="h2"
        className={styles.StartActionSubTitle}
        sx={{ marginBottom: "1rem" }}
      >
        A continuación se te muestran una serie de opciones que te pueden ser
        muy útiles.
      </Typography>
      <Box
        sx={{ marginBottom: "1rem", maxWidth: { xs: "100%", sm: "400px" } }}
      ></Box>

      <Grid container spacing={4}>
        <Link href="/app/claimsAgent">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={
                styles.ElementContainer +
                " " +
                styles.ClickItem +
                " " +
                styles.ClickItem2
              }
              sx={{ height: "100%" }}
            >
              <img
                src="/images/icons/reclamos.svg"
                alt=""
                className={styles.ImagenPanelItem}
              />
              <Typography
                variant="inherit"
                component="h2"
                className={
                  styles.ItemDescriptionElement + " " + styles.ColorTextPrimaryA
                }
                sx={{
                  marginBottom: "0.5rem",
                  marginTop: "0.5rem",
                  textAlign: "center",
                }}
              >
                Reclamos
              </Typography>
              {totalClaims > 0 && (
                <Box
                  className={
                    styles.NotificationNumber +
                    " animate__animated animate__fadeIn"
                  }
                >
                  {totalClaims}
                </Box>
              )}
            </Box>
          </Grid>
        </Link>

        <Link href="/app/questionsAgent">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={
                styles.ElementContainer +
                " " +
                styles.ClickItem +
                " " +
                styles.ClickItem2
              }
              sx={{ height: "100%" }}
            >
              <img
                src="/images/icons/consultas.svg"
                alt=""
                className={styles.ImagenPanelItem}
              />
              <Typography
                variant="inherit"
                component="h2"
                className={
                  styles.ItemDescriptionElement + " " + styles.ColorTextPrimaryA
                }
                sx={{
                  marginBottom: "0.5rem",
                  marginTop: "0.5rem",
                  textAlign: "center",
                }}
              >
                Consultas
              </Typography>
              {totalQuestions > 0 && (
                <Box
                  className={
                    styles.NotificationNumber +
                    " animate__animated animate__fadeIn"
                  }
                >
                  {totalQuestions}
                </Box>
              )}
            </Box>
          </Grid>
        </Link>

     
                  {
                  <Link href="/app/reportAgent">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={
                styles.ElementContainer +
                " " +
                styles.ClickItem +
                " " +
                styles.ClickItem2
              }
              sx={{ height: "100%" }}
            >
              <img
                src="/images/icons/informe.svg"
                alt=""
                className={styles.ImagenPanelItem}
              />
              <Typography
                variant="inherit"
                component="h2"
                className={
                  styles.ItemDescriptionElement + " " + styles.ColorTextPrimaryA
                }
                sx={{
                  marginBottom: "0.5rem",
                  marginTop: "0.5rem",
                  textAlign: "center",
                }}
              >
                Informe
              </Typography>
            </Box>
          </Grid>
        </Link>
                  }

                  {
                   <Link href="/app/posts">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={
                styles.ElementContainer +
                " " +
                styles.ClickItem +
                " " +
                styles.ClickItem2
              }
              sx={{ height: "100%" }}
            >
              <img
                src="/images/icons/twitter.svg"
                alt=""
                className={styles.ImagenPanelItem}
              />
              <Typography
                variant="inherit"
                component="h2"
                className={
                  styles.ItemDescriptionElement + " " + styles.ColorTextPrimaryA
                }
                sx={{
                  marginBottom: "0.5rem",
                  marginTop: "0.5rem",
                  textAlign: "center",
                }}
              >
                Posteos
              </Typography>
            </Box>
          </Grid>
        </Link>
                  }
                  {
                    <Link href="/app/requestsAdmin">
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <Box
                        className={
                          styles.ElementContainer +
                          " " +
                          styles.ClickItem +
                          " " +
                          styles.ClickItem2
                        }
                        sx={{ height: "100%" }}
                      >
                        <img
                          src="/images/icons/procesos.svg"
                          alt=""
                          className={styles.ImagenPanelItem}
                        />
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={
                            styles.ItemDescriptionElement + " " + styles.ColorTextPrimaryA
                          }
                          sx={{
                            marginBottom: "0.5rem",
                            marginTop: "0.5rem",
                            textAlign: "center",
                          }}
                        >
                          Solicitudes
                        </Typography>
                      
                      </Box>
                    </Grid>
                  </Link>
                  }
        

       
                  {

                    /*

                    <Link href="/app/profileAgent">
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Box
              className={
                styles.ElementContainer +
                " " +
                styles.ClickItem +
                " " +
                styles.ClickItem2
              }
              sx={{ height: "100%" }}
            >
              <Grid container>
                <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                  <Typography
                    variant="inherit"
                    component="h2"
                    className={
                      styles.ItemDescriptionElement +
                      " " +
                      styles.ColorTextPrimaryA
                    }
                    sx={{
                      marginBottom: "0.5rem",
                      marginTop: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    Mi Perfil
                  </Typography>
                  <img
                    src="/images/icons/configuracion.svg"
                    className={styles.ImagenPanelItem}
                  />
                </Grid>
                <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                  <Typography
                    variant="inherit"
                    component="h2"
                    className={
                      styles.ItemTitleElement + " " + styles.ColorTextPrimaryA
                    }
                    sx={{
                      marginBottom: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <span>
                      {user?.given_name} {user?.family_name}
                    </span>
                  </Typography>

                  <Typography
                    title={user?.email}
                    variant="inherit"
                    component="h2"
                    className={
                      styles.ItemDescriptionElement + " " + styles.ColorText
                    }
                    sx={{
                      marginBottom: "1rem",
                      overflowX: "clip",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Link>
                     */
                  }
        


      </Grid>
    </BoxContainer>
  );
};

export default PanelAgent;
