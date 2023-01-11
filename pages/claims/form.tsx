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
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import * as yup from "yup";
import { ValidationError } from "yup";

import { Auth } from "aws-amplify";
const steps = ["paso1", "paso2", "paso3", "paso4"];
import {
  getProcessTitle,
  getProcuringEntityId,
  getProcessPlanningId,
} from "../../components/imports/ProcessFunctions";
import { FolderDelete } from "@mui/icons-material";
import fetchData from "../../src/utils/fetch";

let schemaQuestion = yup.object().shape({
  claim: yup.string().required("Escribí tu reclamo"),
  condition: yup.string().required("Escribí de que manera te afecta"),
  stage: yup.string().required("Selecciona una etapa"),
  email: yup
    .string()
    .required("Ingresa un Correo Electrónico")
    .email("Ingresa un Correo Electrónico Válido"),
  call: yup.string().required("Falta el identificador del llamado"),
  ocid: yup.string().required("Falta el ocid"),
  entity: yup.string().required("Falta la entidad"),
});

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
          ".MuiInputAdornment-root": {
            marginRight: "7px!important",
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

const ClaimsForm: NextPage = () => {
  var router = useRouter();

  const [formState, setFormState]: any = React.useState({
    claim: "",
    condition: "",
    stage: "",
    email: "",
    ocid: "",
    call: "",
    user: "",
    entity: "",
  });
  const [QuestionsState, setQuestionsState]: any = React.useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = React.useState(false);
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
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPreLoading, setIsPreLoading] = React.useState(false);
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
 
  }

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

  const handleNext = () => {
    
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
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

  function onChangeCheckQuestion(e: React.ChangeEvent<HTMLInputElement>) {
    QuestionsState.filter((Field: any) => {
      return Field.field == e.target.name;
    })[0].value = e.target.checked ? "SI" : "NO";
    setQuestionsState([...QuestionsState]);
  }

  function onChangeQuestion(e: React.ChangeEvent<HTMLInputElement>) {
    QuestionsState.filter((Field: any) => {
      return Field.field == e.target.name;
    })[0].value = e.target.value;
    setQuestionsState([...QuestionsState]);
  }
  function getQuestionValue(field: any) {
    return QuestionsState.filter((Field: any) => {
      return Field.field == field;
    })[0];
  }
  function getExtraFieldsTrue() {
    return QuestionsState.filter((Field: any) => {
      return Field.value === "SI";
    });
  }

  async function getIdentifyProblemQuestions() {
    if (isLoadingQuestions) {
      return;
    }

    setIsLoadingQuestions(true);
    try {
      const data = await fetchData("getClaimsExtraFields",{ group: "IDENPROBLEMA" },"POST",false);
      if (!data.error && data && data?.data.length > 0) {
        setQuestionsState(
          data.data.map((field: any) => {
            return {
              field: field?.nombre,
              title: field?.titulo,
              value: "",
              group: field?.grupo,
            };
          })
        );
       
      } else {
       
      }
    } catch (error) {
      setMessage("Error al consultar las preguntas");
      setOpenMessage(true);
      console.dir(error);
    } finally {
      setIsLoadingQuestions(false);
    }
  }

  React.useEffect(() => {
    getIdentifyProblemQuestions();
  }, [1]);
  React.useEffect(() => {
    if (getProcessId()) {
      getProcess(getProcessId());
    }
  }, [router.query["id"]]);
  function getProcessId() {
    return router.query["id"];
  }
  async function getProcess(id: any) {
    
    setIsPreLoading(true);
    try {
      const data = await fetchData("getProcessDNCP",{ id: id },"POST",false);
      if (!data.error) {
        
        //console.dir(data?.records[0]?.compiledRelease?.ocid)
        setProcessData(data);

        let user: any = {};
        try {
          user = await Auth.currentAuthenticatedUser();
        } catch (err) {}
        setFormState({
          ...formState,
          ...{
            call: getProcessPlanningId(data),
            ocid: data?.ocid,
            entity: getProcuringEntityId(data),
            email: user?.attributes?.email,
            user: user?.attributes?.sub,
          },
        });
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

  const [valueTab, setValueTab] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };
  const [searchValue, setSearchValue] = React.useState("");

  function changeSearchValue(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    setQuestionsState([...QuestionsState]);
  }

  function likeText(text: string, term: string) {
    let termSearch = term.trim().toLowerCase();
    let textSearch = text.toLowerCase();
    let arrayTerms = termSearch.split(" ");
    for (let i = 0; i < arrayTerms.length; i++) {
      if (arrayTerms[i].trim()) {
        let REGULAR = new RegExp(arrayTerms[i].trim(), "g");
        return REGULAR.test(text);
      }
    }
    return false;
  }

  async function sendClaim() {
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

    setIsLoading(true);

    try {
      const data = await fetchData("addClaim",{
        ...formState,
        ...{
          extraQuestions: getExtraFieldsTrue().map((Field: any) => {
            return { field: Field.field, value: Field.value };
          }),
        },
      },"PUT",true);

      if (!data.error && data.data) {
        setMessage("Reclamo enviado exitosamente");
        setOpenMessage(true);
        router.push(
          `/claims/finish?id=${encodeURIComponent(data?.data?.enlace)}`
        );
      } else {
        setMessage("Hubo un error al enviar tu reclamo");
        setOpenMessage(true);
      }
    } catch (error) {
      setMessage("Hubo un error al enviar tu reclamo");
      setOpenMessage(true);
      console.dir(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>VigiA - Formulario de Reclamo</title>
        <meta name="description" content="Formulario de Reclamos" />
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
                    {
                      // GetStepContent(activeStep,QuestionsQ1)

                      activeStep == 0 && (
                        <>
                          <h2 className={styles.TitleContainerFormGray}>
                            Identifica el Problema
                          </h2>

                          <Box sx={{ textAlign: "center" }}>
                            {QuestionsState.filter((Field: any) => {
                              return Field.group == "IDENPROBLEMA";
                            }).map((Field: any, index: number) => (
                              <Grid container key={index}>
                                <Grid
                                  item
                                  xs={9}
                                  sm={9}
                                  md={9}
                                  lg={9}
                                  xl={9}
                                  sx={{
                                    verticalAlign: "middle",
                                    textAlign: "left",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="inherit"
                                    component="p"
                                    className={styles.ItemsContainerText}
                                  >
                                    {Field.title}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={3}
                                  sm={3}
                                  md={3}
                                  lg={3}
                                  xl={3}
                                  sx={{
                                    verticalAlign: "middle",
                                    textAlign: "left",
                                  }}
                                >
                                  <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name={
                                      "row-radio-buttons-group-" + Field.field
                                    }
                                  >
                                    <FormControlLabel
                                      value="SI"
                                      name={Field.field}
                                      control={
                                        <Radio
                                          checked={
                                            getQuestionValue(Field.field)
                                              .value == "SI"
                                          }
                                          onChange={onChangeQuestion}
                                          sx={{
                                            /*color: "#8A49FF!important",*/
                                            "&.Mui-checked": {
                                              color: "#8A49FF!important",
                                            },
                                          }}
                                        />
                                      }
                                      label="SI"
                                      className={styles.RadioText}
                                    />
                                    <FormControlLabel
                                      value="NO"
                                      name={Field.field}
                                      control={
                                        <Radio
                                          checked={
                                            getQuestionValue(Field.field)
                                              .value == "NO"
                                          }
                                          onChange={onChangeQuestion}
                                          sx={{
                                            /* color: "#8A49FF!important",*/
                                            "&.Mui-checked": {
                                              color: "#8A49FF!important",
                                            },
                                          }}
                                        />
                                      }
                                      label="NO"
                                      className={styles.RadioText}
                                    />
                                  </RadioGroup>
                                </Grid>
                              </Grid>
                            ))}
                          </Box>
                        </>
                      )
                    }
                    {activeStep == 1 && (
                      <>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={styles.TitleContainerFormGray}
                        >
                          Clasifica el Problema
                        </Typography>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          Añade más características para poder clasificar mejor
                          tu protesta, marca los puntos sobre los que consideres
                          encaje tu protesta o no estes conforme:
                        </Typography>

                        <Box sx={{}}>
                          <Box>
                            <Grid
                              container
                              sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                lg={6}
                                xl={6}
                                sx={{ display: "flex", alignItems: "bottom" }}
                              >
                                <ThemeProvider theme={PersonalizedTab}>
                                  <Tabs
                                    value={valueTab}
                                    onChange={handleChangeTab}
                                    aria-label="basic tabs example"
                                    TabIndicatorProps={{
                                      style: {
                                        backgroundColor: "#8A49FF",
                                      },
                                    }}
                                    sx={{ display: "flex" }}
                                  >
                                    <Tab
                                      label="Pliego de Bases y Condiciones"
                                      {...a11yProps(0)}
                                      className={styles.TabTitle}
                                      sx={{
                                        [`&.${tabClasses.selected}`]: {
                                          color: "#8A49FF",
                                        },
                                        display: "flex",
                                        alignItems: "bottom",
                                      }}
                                    />
                                    <Tab
                                      label="Resultado "
                                      {...a11yProps(1)}
                                      className={styles.TabTitle}
                                      sx={{
                                        [`&.${tabClasses.selected}`]: {
                                          color: "#8A49FF",
                                        },
                                        display: "flex",
                                        alignItems: "bottom",
                                      }}
                                    />
                                  </Tabs>
                                </ThemeProvider>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                lg={6}
                                xl={6}
                                sx={{ padding: "0.5rem" }}
                              >
                                <ThemeProvider theme={Personalized_2}>
                                  <TextField
                                    onChange={changeSearchValue}
                                    value={searchValue}
                                    label="Buscar..."
                                    name="search"
                                    type="text"
                                    variant="filled"
                                    fullWidth
                                    className={
                                      styles.InputTextSmall +
                                      " " +
                                      styles.GrayInputText
                                    }
                                    InputProps={{
                                      disableUnderline: false,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                          >
                                            <SearchIcon
                                              className={styles.SearchIconText}
                                            />
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
                                  ></TextField>
                                </ThemeProvider>
                              </Grid>
                            </Grid>
                          </Box>
                          <TabPanel value={valueTab} index={0}>
                            <Box
                              className={styles.ChecksContainer}
                              sx={{ minHeight: "300px" }}
                            >
                              {QuestionsState.filter((Field: any) => {
                                return Field.group == "PLIEGOBASE";
                              })
                                .filter((Field: any) => {
                                  return searchValue.trim()
                                    ? likeText(Field.title, searchValue)
                                    : true;
                                })
                                .map((Field: any, index: number) => (
                                  <Grid
                                    container
                                    sx={{ borderBottom: "2px dashed #F8F8F8" }}
                                    key={index}
                                  >
                                    <Grid
                                      item
                                      xs={10}
                                      sm={11}
                                      md={11}
                                      lg={11}
                                      xl={11}
                                      sx={{
                                        verticalAlign: "middle",
                                        textAlign: "left",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="inherit"
                                        component="p"
                                        className={styles.ItemsContainerText}
                                      >
                                        {Field.title}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={2}
                                      sm={1}
                                      md={1}
                                      lg={1}
                                      xl={1}
                                      sx={{
                                        verticalAlign: "middle",
                                        textAlign: "left",
                                      }}
                                    >
                                      <Checkbox
                                        {...{
                                          inputProps: { "aria-label": "" },
                                        }}
                                        checked={
                                          getQuestionValue(Field.field).value ==
                                          "SI"
                                        }
                                        onChange={onChangeCheckQuestion}
                                        name={Field.field}
                                        sx={{
                                          [`&.${checkboxClasses.checked}`]: {
                                            color: "#8A49FF",
                                          },
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                ))}
                            </Box>
                          </TabPanel>
                          <TabPanel value={valueTab} index={1}>
                            <Box
                              className={styles.ChecksContainer}
                              sx={{ minHeight: "300px" }}
                            >
                              {QuestionsState.filter((Field: any) => {
                                return Field.group == "ALRESULTADO";
                              })
                                .filter((Field: any) => {
                                  return searchValue.trim()
                                    ? likeText(Field.title, searchValue)
                                    : true;
                                })
                                .map((Field: any, index: number) => (
                                  <Grid
                                    container
                                    sx={{ borderBottom: "2px dashed #F8F8F8" }}
                                    key={index}
                                  >
                                    <Grid
                                      item
                                      xs={10}
                                      sm={11}
                                      md={11}
                                      lg={11}
                                      xl={11}
                                      sx={{
                                        verticalAlign: "middle",
                                        textAlign: "left",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="inherit"
                                        component="p"
                                        className={styles.ItemsContainerText}
                                      >
                                        {Field.title}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={2}
                                      sm={1}
                                      md={1}
                                      lg={1}
                                      xl={1}
                                      sx={{
                                        verticalAlign: "middle",
                                        textAlign: "left",
                                      }}
                                    >
                                      <Checkbox
                                        {...{
                                          inputProps: { "aria-label": "" },
                                        }}
                                        checked={
                                          getQuestionValue(Field.field).value ==
                                          "SI"
                                        }
                                        onChange={onChangeCheckQuestion}
                                        name={Field.field}
                                        sx={{
                                          [`&.${checkboxClasses.checked}`]: {
                                            color: "#8A49FF",
                                          },
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                ))}
                            </Box>
                          </TabPanel>
                        </Box>
                      </>
                    )}
                    {activeStep == 2 && (
                      <>
                        <h2 className={styles.TitleContainerFormGray}>
                          ¿Qué problema encontraste?
                        </h2>

                        <Box sx={{ textAlign: "left" }}>
                          <Box className={styles.InputTitle}>
                            {" "}
                            Describí el problema{" "}
                            <span className={styles.ColorDanger}>*</span>{" "}
                          </Box>
                          <ThemeProvider theme={PersonalizedTextArea}>
                            <TextField
                              label="Danos el contexto del problema que encontraste"
                              name="claim"
                              type="text"
                              variant="filled"
                              multiline
                              disabled={isPreLoading}
                              rows={2}
                              fullWidth
                              className={styles.InputText}
                              onChange={onChange}
                              value={formState.claim}
                            />
                          </ThemeProvider>
                          <Box className={styles.InputTitle}>
                            {" "}
                            ¿Cómo te afecta este problema?{" "}
                            <span className={styles.ColorDanger}>*</span>{" "}
                          </Box>
                          <ThemeProvider theme={PersonalizedTextArea}>
                            <TextField
                              label="¿De qué manera este problema es relevante para vos y otros emprendedores?"
                              name="condition"
                              type="text"
                              variant="filled"
                              multiline
                              disabled={isPreLoading}
                              rows={2}
                              fullWidth
                              className={styles.InputText}
                              onChange={onChange}
                              value={formState.condition}
                            />
                          </ThemeProvider>
                          <Box className={styles.InputTitle}>
                            ¿En qué punto del proceso encontraste el problema?{" "}
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
                    {activeStep == 3 && (
                      <>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={styles.TitleContainerFormGray}
                        >
                          Haz un seguimiento sobre el reclamo
                        </Typography>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          Ingresa un correo electrónico para mantener una
                          comunicación y seguir trabajando juntos para darle
                          resolución a tu reclamo. Está atento a nuestra
                          respuesta.
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
                                fullWidth
                                className={styles.InputText}
                                disabled={isPreLoading}
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
                            title="Enviar Reclamo"
                            variant="contained"
                            disableElevation
                            onClick={sendClaim}
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
                        <Button
                          title="Continuar"
                          variant="contained"
                          disableElevation
                          className={styles.ButtonPrincipal}
                          onClick={handleNext}
                          sx={{ mr: 1 }}
                        >
                          Continuar
                        </Button>
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
          action={
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
          }
          className={styles.MessageText}
        />
      </Layout>
    </>
  );
};

export default ClaimsForm;
function getProcessId(
  data: any
):
  | string
  | (<T, A extends any[], R>(
      this: (this: T, ...args: A) => R,
      thisArg: T,
      ...args: A
    ) => R) {
  throw new Error("Function not implemented.");
}
