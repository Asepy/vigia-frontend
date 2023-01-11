import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Login.module.scss";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "../../components/ui/Layout/Layout";
import * as yup from "yup";
import { ValidationError } from "yup";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import fetchData from "../../src/utils/fetch";
let schemaIDProcess = yup.object().shape({
  id: yup.string().required("Ingresa un ID"),
});
const PersonalizedText = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "2rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff!important",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});

const Questions: NextPage = () => {
  const router = useRouter();
  const [formState, setFormState] = React.useState({
    id: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState("");
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      getProcess();
    }
  }
  React.useEffect(() => {}, []);
  async function getProcess() {
    if (isLoading) {
      return;
    }
    try {
      schemaIDProcess.validateSync(formState, { abortEarly: false });
    } catch (error) {
      if (error instanceof ValidationError) {
        setMessage(error.inner[0].message);
        setOpenMessage(true);
      }
      return;
    }
    setIsLoading(true);
    try {
      
      const data =await fetchData("getProcessDNCP",{ id: formState.id },"POST",false);

      if (!data.error) {
        router.push(
          `/identifiedProcess?id=${encodeURIComponent(
            formState.id
          )}&state=question`
        );
      } else {
        setMessage("Llamado no encontrado, puedes utilizar la busqueda");
        setOpenMessage(true);
      }
    } catch (error) {
      setMessage("Llamado no encontrado, puedes utilizar la busqueda");
      setOpenMessage(true);
      console.dir(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCloseMessage = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMessage(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseMessage}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <>
      <Head>
        <title>VigiA - Consultar</title>
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
              Estás analizando un llamado y ¿tienes una duda o algo no te quedó
              claro?
            </Box>
            <Box className={styles.StartActionSubTitle}>
              Identifiquemos el llamado
            </Box>

            <Box
              sx={{
                display: "block",
                margin: "0 auto",
                maxWidth: "500px",
                marginTop: "2rem",
              }}
            >
              <Box className={styles.InputTitle + " " + styles.Light}>
                {" "}
                ID del Proceso de Contratación{" "}
                <span className={styles.ColorDanger}>*</span>{" "}
              </Box>
              <ThemeProvider theme={PersonalizedText}>
                <TextField
                  label="Ej: 9861641"
                  name="id"
                  type="text"
                  variant="filled"
                  fullWidth
                  className={styles.InputText + " " + "InputTest"}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                />
              </ThemeProvider>
              <Link href="/search">
                <a>
                  <Box
                    className={styles.InputTitle + " " + styles.Light}
                    sx={{
                      textDecoration: "underline",
                      opacity: "0.6",
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    No tengo el ID{" "}
                  </Box>
                </a>
              </Link>
            </Box>

            <Box
              sx={{ width: "100%", paddingBottom: "1rem", paddingTop: "1rem" }}
            >
              <Box sx={{ height: "5px" }}>
                {isLoading ? (
                  <LinearProgress
                    className={styles.LoadingPrimary}
                    sx={{ maxWidth: "500px", width: "50%", margin: "0 auto" }}
                  />
                ) : null}
              </Box>
            </Box>
            <Box sx={{ paddingTop: "5px", textAlign: "right" }}>
              <Button
                title="Encuentra Oportunidades"
                variant="contained"
                disableElevation
                className={
                  styles.ButtonPrincipal + " " + styles.ButtonContrast_2
                }
                onClick={getProcess}
              >
                Comenzar
              </Button>
            </Box>

            <Box
              className={styles.StartActionSubTitle_3}
              sx={{ paddingTop: "1rem" }}
            >
              Si deseas realizar esta consulta de una forma anónima y que no se
              vinculen ninguno de tus datos personales, puedes realizar este
              proceso sin la necesidad de iniciar sesión.
              <br />
              Si deseas guardar un histórico de las consultas que haz realizado,
              puedes identificarte. Recuerda que ninguna entidad podrá ver tus
              datos personales.{" "}
            </Box>
          </Container>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openMessage}
          autoHideDuration={6000}
          onClose={handleCloseMessage}
          message={Message}
          action={action}
          className={styles.MessageText}
        />
      </Layout>
    </>
  );
};

export default Questions;
