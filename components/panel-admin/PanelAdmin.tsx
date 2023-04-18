import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { getNumber } from "../imports/Functions";
import { useAuth } from "../../src/contexts/auth-context";
import fetchData from "../../src/utils/fetch";
import styles from "../../styles/Login.module.scss";
import BoxContainer from "../ui/BoxContainer";

const PanelAdmin = () => {
  const { user,getActualUser } = useAuth();
  const { isReady } = useRouter();
  
  React.useEffect(() => {
    if (isReady) {
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user]);


  return (
    <BoxContainer
      sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
    >
      <Typography
        variant="inherit"
        component="h1"
        className={styles.StartActionTitle}
      >
        Bienvenido Administrador
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
       

        <Link href="/app/users">
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
                src="/images/icons/configuracion.svg"
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
                Roles de Usuarios
              </Typography>
            
            </Box>
          </Grid>
        </Link>

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

     
               

        

       
      
        


      </Grid>
    </BoxContainer>
  );
};

export default PanelAdmin;
