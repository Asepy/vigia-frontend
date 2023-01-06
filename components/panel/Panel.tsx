import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "../../styles/Login.module.scss";
import { useAuth } from "../../src/contexts/auth-context";
import BoxContainer from "../ui/BoxContainer";
import * as React from "react";
const Panel = () => {
  const { user } = useAuth();
  const [signedInUser, setSignedInUser] = React.useState<boolean>(false);
  React.useEffect(() => {
    setSignedInUser(user != null);
  }, [user]);
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
        sx={{
          marginBottom: "1rem",
          maxWidth: { xs: "100%", sm: "400px" },
        }}
      ></Box>

      <Grid container spacing={3}>
        <Link href="/opportunities/results">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={styles.ElementContainer + " " + styles.ClickItem}
              sx={{ height: "100%" }}
            >
              <img
                src="/images/icons/oportunidad.svg"
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
                Mis Oportunidades
              </Typography>
            </Box>
          </Grid>
        </Link>

        <Link href="/app/claims">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={styles.ElementContainer + " " + styles.ClickItem}
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
                Mis Reclamos
              </Typography>
            </Box>
          </Grid>
        </Link>

        <Link href="/app/questions">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={styles.ElementContainer + " " + styles.ClickItem}
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
                Mis Consultas
              </Typography>
            </Box>
          </Grid>
        </Link>

        <Link href="/app/processes">
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <Box
              className={styles.ElementContainer + " " + styles.ClickItem}
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
                Mis Procesos
              </Typography>
            </Box>
          </Grid>
        </Link>

        <Link href="/app/profile">
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Box
              className={styles.ElementContainer + " " + styles.ClickItem}
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
                  {signedInUser&&<Typography
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
                  </Typography>}
                  <Typography
                    variant="inherit"
                    component="h2"
                    className={
                      styles.ItemDescriptionElement + " " + styles.ColorTextGray
                    }
                    sx={{
                      marginBottom: "1rem",
                    }}
                  ></Typography>
                  {signedInUser&&<Typography
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
                  </Typography>}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Link>
      </Grid>
    </BoxContainer>
  );
};

export default Panel;
