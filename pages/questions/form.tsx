import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Login.module.scss";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Container, ownerDocument } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import Layout from "../../components/ui/Layout/Layout";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import Tabs from "@mui/material/Tabs";
import Tab, { tabClasses } from "@mui/material/Tab";

import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

import InputAdornment from "@mui/material/InputAdornment";
import { FormatShapesTwoTone } from "@mui/icons-material";
import * as yup from "yup";
import { ValidationError } from "yup";


import { Auth } from "aws-amplify";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";

import { useRouter } from "next/router";
import { is } from "date-fns/locale";

import CircularProgress from "@mui/material/CircularProgress";
import {
  getProcessPlanningId,
  getProcuringEntityId,
} from "../../components/imports/ProcessFunctions";
import fetchData from "../../src/utils/fetch";

let schemaQuestion = yup.object().shape({
  question: yup.string().required("Escribí tus dudas"),
  better: yup.string().required("Escribí cómo mejorarías la descripción"),
  stage: yup.string().required("Selecciona una etapa"),
  email: yup
    .string()
    .required("Ingresa un Correo Electrónico")
    .email("Ingresa un Correo Electrónico Válido"),
  call: yup.string().required("Falta el identificador del llamado"),
  ocid: yup.string().required("Falta el ocid"),
});
const steps = ["paso1", "paso2"];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/*--- */
const PersonalizedTextArea = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "1.5rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff",
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

const Personalized_2 = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          /*"&.MuiInputBase-root":{
            background: "none!important",
            border:"none!important"
          },*/
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root": {
            background: "none!important",
            border: "none!important",
            borderRadius: "2rem",
            backgroundColor: "#F8F8F8!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});

const PersonalizedTab = createTheme({
  components: {
    // Name of the component
    MuiTabs: {
      styleOverrides: {
        // Name of the slot

        root: {
          "& .MuiTabs-flexContainer": {
            height: "100%!important",
          },
        },
      },
      defaultProps: {},
    },
  },
});

const QuestionsForm: NextPage = () => {
  var router = useRouter();

  React.useEffect(() => {
    if (getProcessId()) {
      getProcess(getProcessId());
    }
  }, [router.query["id"]]);

  const [valueTab, setValueTab] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  const [formState, setFormState] = React.useState({
    question: "",
    better: "",
    stage: "",
    email: "",
    ocid: "",
    call: "",
    user: "",
  });

  function getProcessId() {
    //let parts:Array<string> = location.href.split('/');
    
    return router.query["id"]; //( parts.pop() || parts.pop());
  }
  function getProcessTitle(processData: any) {
    return processData?.tender?.title
      ? processData?.tender?.title
      : processData?.planning?.budget?.description
      ? processData?.planning?.budget?.description
      : null;
  }
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPreLoading, setIsPreLoading] = React.useState(false);
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
   
  }
  function setFormValue(param: string, value: any) {
    setFormState({ ...formState, [param]: value });
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState("");
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
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const pruebas = () => {
    
    getProcess(getProcessId());
    return;
  };
  const handleNext = () => {
  
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    continueForm();
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  function continueForm() {}
  async function sendQuestion() {
    if (isLoading) {
      return;
    }
    try {
      schemaQuestion.validateSync(formState, { abortEarly: false });
    } catch (error) {
      if (error instanceof ValidationError) {
        setMessage(error.inner[0].message);
        setOpenMessage(true);
      }
      return;
    }
    try {
      //let user=await Auth.userSession;
      //const user = await Auth.currentAuthenticatedUser();
      //console.dir(user)
      //const token = user.signInUserSession.idToken.jwtToken;
    } catch (e) {}

    setIsLoading(true);

    try {

      const data =await fetchData("addQuestion",{ ...formState },"PUT",true);

      if (
        !data.error &&
        data.rows &&
        data.rows.length > 0 &&
        data.rows[0].enlace
      ) {
        setMessage("Consulta enviada exitosamente");
        setOpenMessage(true);
        router.push(
          `/questions/finish?id=${encodeURIComponent(data.rows[0].enlace)}`
        );
      } else {
        setMessage("Hubo un error al enviar tu consulta");
        setOpenMessage(true);
      }
    } catch (error) {
      setMessage("Hubo un error al enviar tu consulta");
      setOpenMessage(true);
      console.dir(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getProcess(id: any) {

    setIsPreLoading(true);
    try {
      const data = await fetchData("getProcessDNCP",{ id: id },"POST",false);
      if (!data.error) {
        

        setProcessData(data);

        let user: any = {};
        try {
          user = await Auth.currentAuthenticatedUser();
        } catch (err) {}
        //console.dir({ ...formState})

        setFormState(
          {
            ...formState,
            ...{
              call: getProcessPlanningId(data),
              ocid: data?.ocid,
              entity: getProcuringEntityId(data),
              email: user?.attributes?.email,
              user: user?.attributes?.sub,
            },
          }
          //["call"]:data?.records[0]?.compiledRelease?.planning?.identifier, ["ocid"]:data?.records[0]?.compiledRelease?.ocid,["email"]:user?.attributes?.email, ["user"]:user?.attributes?.sub }
        );
     

        //setFormValue('ocid',data?.records[0]?.compiledRelease?.ocid)
        /*await setFormState(
        { ...formState,
          ...{
            "call":data?.records[0]?.compiledRelease?.planning?.identifier,
            "ocid":data?.records[0]?.compiledRelease?.ocid,
            "email":user?.attributes?.email,
            "user":user?.attributes?.sub
          }
        }

          //["call"]:data?.records[0]?.compiledRelease?.planning?.identifier, ["ocid"]:data?.records[0]?.compiledRelease?.ocid,["email"]:user?.attributes?.email, ["user"]:user?.attributes?.sub }
        );*/
        
      } else {
        setMessage("Llamado no encontrado");
        setOpenMessage(true);
      }
    } catch (error) {
      setMessage("Llamado no encontrado");
      setOpenMessage(true);
      console.dir(error);
    } finally {
      setIsPreLoading(false);
    }
  }

  const [processData, setProcessData] = React.useState({});

  return (
    <>
      <Head>
        <title>VigiA</title>
        <meta name="description" content="Iniciar Sesión" />
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
      <Layout>
        <Box
          sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 259px)" } }}
          className={styles.BackgroundSecondaryColor}
        >
          <Container
            sx={{ paddingTop: { xs: "5rem" }, paddingBottom: { xs: "3rem" } }}
          >
            <Box className={styles.FormContainer}>
              <div>
                {allStepsCompleted() ? (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {activeStep == 0 && (
                      <>
                        <h2 className={styles.TitleContainerFormGray}>
                          ¿Cuál es tu consulta?
                        </h2>

                        <Box sx={{ textAlign: "left" }}>
                          <Box className={styles.InputTitle}>
                            {" "}
                            Escribí tus dudas{" "}
                            <span className={styles.ColorDanger}>*</span>{" "}
                          </Box>
                          <ThemeProvider theme={PersonalizedTextArea}>
                            <TextField
                              label="Danos el contexto y menciona tus dudas"
                              name="question"
                              type="text"
                              variant="filled"
                              multiline
                              rows={2}
                              fullWidth
                              className={styles.InputText}
                              onChange={onChange}
                              value={formState.question}
                            />
                          </ThemeProvider>
                          <Box className={styles.InputTitle}>
                            ¿Cómo mejorarías la descripción del proceso de
                            contratación?{" "}
                            <span className={styles.ColorDanger}>*</span>{" "}
                          </Box>
                          <ThemeProvider theme={PersonalizedTextArea}>
                            <TextField
                              label="¿Porque crees que este proceso no es claro para vos y otros emprendedores,
          y cómo lo mejorarías?"
                              name="better"
                              type="text"
                              variant="filled"
                              multiline
                              disabled={isPreLoading}
                              rows={2}
                              fullWidth
                              className={styles.InputText}
                              onChange={onChange}
                              value={formState.better}
                            />
                          </ThemeProvider>
                          <Box className={styles.InputTitle}>
                            ¿En qué punto del proceso tienes la duda?{" "}
                            <span className={styles.ColorDanger}>*</span>{" "}
                          </Box>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="stage"
                          >
                            <FormControlLabel
                              value="planning"
                              control={
                                <Radio
                                  disabled={isPreLoading}
                                  name="stage"
                                  checked={formState.stage === "planning"}
                                  onChange={onChange}
                                  sx={{
                                    /* color: "#8A49FF!important",*/
                                    "&.Mui-checked": {
                                      color: "#8A49FF!important",
                                    },
                                  }}
                                />
                              }
                              label="Planificación"
                              className={styles.RadioText}
                            />

                            <FormControlLabel
                              value="tender"
                              control={
                                <Radio
                                  disabled={isPreLoading}
                                  name="stage"
                                  checked={formState.stage === "tender"}
                                  onChange={onChange}
                                  sx={{
                                    /* color: "#8A49FF!important",*/
                                    "&.Mui-checked": {
                                      color: "#8A49FF!important",
                                    },
                                  }}
                                />
                              }
                              label="Llamado"
                              className={styles.RadioText}
                            />
                            <FormControlLabel
                              value="award"
                              control={
                                <Radio
                                  disabled={isPreLoading}
                                  name="stage"
                                  checked={formState.stage === "award"}
                                  onChange={onChange}
                                  sx={{
                                    /* color: "#8A49FF!important",*/
                                    "&.Mui-checked": {
                                      color: "#8A49FF!important",
                                    },
                                  }}
                                />
                              }
                              label="Adjudicación"
                              className={styles.RadioText}
                            />
                            <FormControlLabel
                              value="contract"
                              control={
                                <Radio
                                  disabled={isPreLoading}
                                  name="stage"
                                  checked={formState.stage === "contract"}
                                  onChange={onChange}
                                  sx={{
                                    /* color: "#8A49FF!important",*/
                                    "&.Mui-checked": {
                                      color: "#8A49FF!important",
                                    },
                                  }}
                                />
                              }
                              label="Contrato"
                              className={styles.RadioText}
                            />
                          </RadioGroup>
                        </Box>
                      </>
                    )}
                    {activeStep == 1 && (
                      <>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={styles.TitleContainerFormGray}
                        >
                          Haz un seguimiento a tu consulta
                        </Typography>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          Ingresa un correo electrónico para recibir una pronta
                          respuesta a tu consulta y seguir trabajando juntos en
                          este proceso. Está atento a nuestro contacto.
                        </Typography>
                        <Box sx={{ textAlign: "left" }}>
                          <Box
                            sx={{
                              display: "block",
                              margin: "0 auto",
                              maxWidth: "400px",
                              marginBottom: "1rem",
                            }}
                          >
                            <Box className={styles.InputTitle}>
                              {" "}
                              Correo Electrónico{" "}
                              <span className={styles.ColorDanger}>*</span>{" "}
                            </Box>
                            <ThemeProvider theme={PersonalizedText}>
                              <TextField
                                label="emprendedor@gmail.com"
                                name="email"
                                type="email"
                                variant="filled"
                                disabled={isPreLoading}
                                fullWidth
                                className={styles.InputText}
                                onChange={onChange}
                                value={formState.email}
                              />
                            </ThemeProvider>
                          </Box>
                        </Box>
                      </>
                    )}

                    {activeStep === totalSteps() - 1 ? (
                      <Box
                        sx={{
                          display: "block",
                          margin: "0 auto",
                          maxWidth: "400px",
                          marginBottom: "4rem",
                          textAlign: "center",
                        }}
                      >
                        {/*<Link href="/questions/finish">
                </Link>
                --> */}
                        {isLoading ? (
                          <Box
                            sx={{
                              width: "100%",
                              paddingBottom: "1rem",
                              paddingTop: "1rem",
                            }}
                          >
                            <LinearProgress className={styles.LoadingPrimary} />
                          </Box>
                        ) : (
                          <Button
                            title="Enviar Consulta"
                            variant="contained"
                            disableElevation
                            onClick={sendQuestion}
                            className={styles.ButtonPrincipal}
                            sx={{ mr: 1 }}
                          >
                            Enviar
                          </Button>
                        )}
                      </Box>
                    ) : null}
                    <Box
                      className={styles.FormDescription2}
                      sx={{ paddingTop: "10px" }}
                    >
                      {isPreLoading ? (
                        <Box sx={{ alignItems: "center", display: "flex" }}>
                          <CircularProgress /> &nbsp;&nbsp;Obteniendo Llamado
                        </Box>
                      ) : (
                        getProcessTitle(processData)
                      )}
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        className={styles.FontBold}
                      >
                        Atrás
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {activeStep === totalSteps() - 1 ? null : (
                        <>
                          <Button
                            title="Continuar"
                            variant="contained"
                            disableElevation
                            className={styles.ButtonPrincipal}
                            onClick={handleNext}
                            sx={{ mr: 1 }}
                            disabled={isPreLoading}
                          >
                            Continuar
                          </Button>
                          {/*
          <Button title="Continuar"
          variant="contained" disableElevation
          className={styles.ButtonPrincipal} onClick={pruebas} sx={{ mr: 1 }}
          >
              pruebas</Button>*/}
                        </>
                      )}
                    </Box>
                  </React.Fragment>
                )}
              </div>
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

export default QuestionsForm;
