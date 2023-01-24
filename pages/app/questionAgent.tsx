import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Login.module.scss";
import Layout from "../../components/ui/Layout/Layout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import { useRouter } from "next/router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import { format } from "date-fns";
import { getDateFormat, getNumber, pagination, validate } from "../../components/imports/Functions";
import { useAlertContext } from "../../src/contexts/alert-context";
import {
  PersonalizedSelect,
  PersonalizedTextArea,
  PersonalizedTextSearch,
} from "../../components/ui/DesignElements";
import {
  getBuyer,
  getCurrencyAmount,
  getEnquiryPeriodEndDate,
  getProcessAmount,
  getProcessCurrency,
  getProcessItems,
  getProcessPliego,
  getProcessTitle,
  getProcurementMethodDetails,
  getProcuringEntity,
  getProcuringEntityContactEmail,
  getProcuringEntityContactName,
  getProcuringEntityContactTelephone,
  getProcuringEntityType,
  getTenderPeriodEndDate,
} from "../../components/imports/ProcessFunctions";
import { useAuth } from "../../src/contexts/auth-context";

import { CircularProgress, LinearProgress } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import { Task } from "../../src/interfaces/task";
import { CONSULTA } from "../../src/interfaces/type-claim-or-question";
import fetchData from "../../src/utils/fetch";



interface StateType {
  value: string;
  name: string;
}

const Question: NextPage = () => {
  const { query, isReady } = useRouter();
  var router = useRouter();
  React.useEffect(() => {
    if (isReady) {
      getQuestion(query["id"]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady,query]);

  React.useEffect( ()  => {
    if(isReady){
      getTasks();
    }
  }, [isReady]);
  const { setAlertMessage } = useAlertContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingAddClaim, setIsLoadingAddClaim] = React.useState(false);

  const [isPreLoading, setIsPreLoading] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState("");

  const [openModalState, setOpenModalState] = React.useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [processData, setProcessData] = React.useState({});
  const [questionData, setQuestionData]: any = React.useState({});
  const [items, setItems] = React.useState([]);

  const [changeStateForm, setChangeStateForm] = React.useState({
    justify: "",
    task: "",
    uoc: "",
  });

  const [similarClaims, setSimilarClaims] = React.useState([]);
  const [userClaims, setUserClaims] = React.useState([]);
  const [entitiesState, setEntitiesState]: any = React.useState([]);

  const [justifyState, setJustifyState]: any = React.useState("");
  const [taskState, setTaskState]: any = React.useState("");

  const { user, signOut } = useAuth();
  const [requestStates, setRequestStates] = React.useState<Array<Task>>([]);
  const [UserClaimsPaginationState, setUserClaimsPaginationState]: any =
    React.useState({
      actualPage: 1,
      pageSize: 5,
      totalResults: 0,
      totalPages: 0,
      pages: [],
    });
  const [UserClaimsFieldsState, setUserClaimsFieldsState]: any = React.useState(
    [
      {
        name: "Busqueda",
        field: "search",
        value: "",
        search: "",
        type: "explicit",
      },
    ]
  );
  async function getTasks(){

    try{
      let data:Array<Task>|null =await fetchData("getTasksQuestions",{},"POST",false);
      setRequestStates((data?data:[]));
    }
    catch(e){
      console.dir(e)
    }finally{

    }
  }
  async function getProcess(ocid: any) {
    setIsLoading(true);
    try {
      const data = await fetchData("getProcessDNCPOCID",{ ocid: ocid },"POST",false);
      if (!data.error) {
        setProcessData(data);
      } else {
        setMessage("Llamado no encontrado");
        setOpenMessage(true);
      }
    } catch (error) {
      setMessage("Llamado no encontrado");
      setOpenMessage(true);
      console.dir(error);
    } finally {
      setIsLoading(false);
    }
  }
  function getObjectProperty(obj: any, name: string) {
    return obj[name];
  }
  function getStage(obj: any) {
    switch (obj?.etapa) {
      case "tender":
        return "Llamado";
      case "planning":
        return "Planificación";
      case "contract":
        return "contrato";
      case "award":
        return "Adjudicación";
      default:
        return "Llamado";
    }
  }
  function getStatusQuestion(obj: any) {
    switch (obj?.estado) {
      case "1":
        return <span className={styles.ColorTextYellowA}> Pendiente </span>;
      case "2":
        return <span className={styles.ColorTextGreen}> Resuelto </span>;
      default:
        return <span className={styles.ColorTextYellowA}> Pendiente </span>;
    }
  }
  function UserClaimsGetField(field: string, fields: Array<any>) {
    return fields.filter((e) => {
      return e.field === field;
    })[0];
  }
  function UserClaimsGetFieldState(field: string) {
    return UserClaimsFieldsState.filter((e: any) => {
      return e.field === field;
    })[0];
  }
  function UserClaimsApplyFilter(
    field: string,
    value?: any,
    defineValue?: any
  ) {
    let fieldObject = UserClaimsGetFieldState(field);

    let parameters: any = {
      page: 1,
    };

    if (defineValue) {
      fieldObject.value = "";
    }
    parameters[field] = validate(value) ? value : fieldObject.value;

    //router.push(`${pageRoute}${getFiltersString(parameters)}`);
    getUserClaims(questionData, parameters);
  }

  function getStatusRequest(obj: any | null) {
    switch (obj?.tarea_estado) {
      case "ENVIADO":
      case "REVISION":
      case "PROTESTA":
      case "COMUNICACION":
        return (
          <span className={styles.ColorTextYellowA}>
            {obj?.tarea_descripcion}{" "}
          </span>
        );
      case "DEVUELTO":
        return (
          <span className={styles.ColorTextRedA}>
            {" "}
            {obj?.tarea_descripcion}{" "}
          </span>
        );
      case "RESUELTO":
        return (
          <span className={styles.ColorTextGreen}>
            {" "}
            {obj?.tarea_descripcion}{" "}
          </span>
        );
      default:
        return (
          <span className={styles.ColorTextYellowA}>
            {obj?.tarea_descripcion}
          </span>
        );
    }
  }
  async function getSimilarClaims(questionData: any | null) {
    let filters: any = {
      page: 1,
      pageSize: 100,
      callE: questionData?.llamado,
      linkD: questionData?.enlace,
    };
    filters["user"] = user?.sub;
    try {
      const data = await fetchData("getQuestionsAgent",{
        ...filters,
      },"POST",true);
      if (!data.error) {
        if (data?.data?.length) {
          setSimilarClaims(data?.data);
        } else {
          setSimilarClaims([]);
        }


      } else {
        setSimilarClaims([]);
      }
    } catch (error) {
      console.dir(error);
      setSimilarClaims([]);
    } finally {
    }
  }
  async function getUserClaims(questionData: any, params: any) {
    if (!questionData?.usuario) {

      return;
    }
    let filters: any = {
      ...params,
    };
    filters["userE"] = questionData?.usuario;
    filters["linkD"] = questionData?.enlace;
    filters["user"] = user?.sub;

    try {
      const data = await fetchData("getQuestionsAgent",{
        ...filters,
      },"POST",true);

      if (!data.error) {
        if (data?.data?.length) {
          setUserClaims(data?.data);
          let Pagination = {
            ...UserClaimsPaginationState,
            ["totalResults"]: getNumber(data.total),
            ["totalPages"]: Math.ceil(
              getNumber(data.total) / UserClaimsPaginationState.pageSize
            ),
            ["pages"]: pagination(
              getNumber(query.page) ? getNumber(query.page) : 1,
              Math.ceil(getNumber(data.total) /UserClaimsPaginationState.pageSize)
            ),
          };
          setUserClaimsPaginationState({ ...Pagination });
        } else {
          setUserClaims([]);
          setUserClaimsPaginationState({
            actualPage: 1,
            pageSize: 5,
            totalResults: 0,
            totalPages: 0,
            pages: [],
          });
        }

      } else {
        setUserClaims([]);
        setUserClaimsPaginationState({
          actualPage: 1,
          pageSize: 5,
          totalResults: 0,
          totalPages: 0,
          pages: [],
        });
      }
    } catch (error) {
      console.dir(error);
      setUserClaims([]);
      setUserClaimsPaginationState({
        actualPage: 1,
        pageSize: 5,
        totalResults: 0,
        totalPages: 0,
        pages: [],
      });
    } finally {
    }
  }

  async function getQuestion(link: any) {
    setIsPreLoading(true);
    setIsLoading(true);
    try {
      const data = await fetchData("getQuestion",{ link: link },"POST",false);
      if (!data.error) {
        setQuestionData(data);
        getSimilarClaims(data);
        getUserClaims(data, {
          page: 1,
          pageSize: 5,
        });
        getProcess(data?.ocid);
        updateQuestionVisualization(data);

      } else {
        setMessage("Consulta no encontrada");
        setOpenMessage(true);
      }
    } catch (error) {
      setMessage("Consulta no encontrada");
      setOpenMessage(true);
      console.dir(error);
    } finally {
      setIsPreLoading(false);
    }
  }
  async function updateQuestionVisualization(question:any) {

    if((!question.fecha_visualizacion===null)||!((user?.roles.includes('ASEPY'))||(user?.roles.includes('SUPERASEPY')))){
     
      return;
    }
    try {
      const data = await fetchData("updateQuestionStatusVisualization",{ link: question.enlace },"POST",true);
      if (!data.error ) {
        
      } else {
        console.dir(data)
      }
    } catch (error) {
      console.dir(error);
    } finally {
    }
  }
  async function addClaimStatus() {
    if (isLoadingAddClaim) {
      return;
    }
    setIsLoadingAddClaim(true);
    let params: any = {};
    //params["user"] = user?.sub;
    params["link"] = questionData?.enlace;
    params["justify"] = justifyState;
    params["task"] = taskState;


    try {
      const data: any = await fetchData("addQuestionStatus",params,"PUT",true);

      if (!data.error && data?.id) {
        setAlertMessage({
          message: "Cambio de estado de tarea exitoso",
          severity: "success",
        });
      } else {
        setAlertMessage("Error al cambiar de estado de tarea");
      }
    } catch (error) {
      console.dir(error);
      setAlertMessage("Error al cambiar de estado de tarea");
    } finally {
      setIsLoadingAddClaim(false);
    }
  }
  return (
    <>
      <Head>
        <title>VigiA - Consulta</title>
        <meta name="description" content="Consulta" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <Layout>
        <Modal
          open={openModalState}
          onClose={handleCloseModalState}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            backdropFilter: "blur(2px)",
            backgroundColor: "rgb(255, 255,255, 0.2)",
          }}
          className="animate fadeIn"
        >
          <Box className={styles.ModalStyle}>
            <Box
              className={styles.CloseModalButton}
              onClick={handleCloseModalState}
            >
              <CloseIcon className={styles.IconCloseModalButton} />
            </Box>

            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className={styles.TitleProcess}
            >
              Cambio de Estado
            </Typography>
            <Box className={styles.InputTitle}>
              {" "}
              Información del cambio de estado{" "}
              <span className={styles.ColorDanger}>*</span>{" "}
            </Box>
            <ThemeProvider theme={PersonalizedTextArea}>
              <TextField
                label="Danos el contexto del porque cambiarás el estado de esta consulta"
                name="justify"
                type="text"
                variant="filled"
                multiline
                rows={3}
                fullWidth
                className={styles.InputText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setJustifyState(e.target.value);
                }}
                value={justifyState}
              />
            </ThemeProvider>
            <Box className={styles.InputTitle}>
              {" "}
              Estado de la consulta{" "}
              <span className={styles.ColorDanger}>*</span>{" "}
            </Box>

            <ThemeProvider theme={PersonalizedSelect}>
              <TextField
                label="Ingresa un estado de la consulta"
                name="task"
                select
                type="text"
                variant="filled"
                fullWidth
                className={styles.InputText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTaskState(e.target.value);
                }}
                value={taskState}
              >
                {requestStates.map((option:Task) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.description} - {option.owner}
                  </MenuItem>
                ))}
              </TextField>
            </ThemeProvider>

            <Box
              sx={{
                width: "100%",
                paddingBottom: "1rem",
                paddingTop: "1rem",
                height: "32px",
              }}
            >
              {isLoadingAddClaim && (
                <LinearProgress className={styles.LoadingPrimary} />
              )}
            </Box>

            <Box sx={{ textAlign: "right", mb: "1rem", mt: "1rem" }}>
              <Button
                title="Aceptar"
                variant="contained"
                disableElevation
                className={styles.ButtonPrincipal}
                onClick={async () => {
                  await addClaimStatus();
                  handleCloseModalState();
                }}
              >
                Continuar
              </Button>
            </Box>
          </Box>
        </Modal>
        <Box
          sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 200px)" } }}
          className={styles.BackgroundPreColor}
        >
          <Container
            sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  className={styles.ElementContainer}
                  sx={{ height: "100%" }}
                >
                  <Grid container>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Typography
                        variant="inherit"
                        component="h1"
                        className={
                          styles.ItemTitleElement +
                          " " +
                          styles.ColorTextPrimaryA
                        }
                      >
                        Consulta{" "}
                        <span className={styles.ColorText}>
                          {isPreLoading ? (
                            <Skeleton
                              variant="text"
                              sx={{
                                fontSize: "1.5rem",
                                width: "20%",
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            />
                          ) : (
                            <>#{getObjectProperty(questionData, "enlace")}</>
                          )}{" "}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ textAlign: "right" }}
                    >
                      <Typography
                        variant="inherit"
                        component="h1"
                        className={
                          styles.ItemTitleElement +
                          " " +
                          styles.ColorTextPrimaryA
                        }
                      >
                        Estado&nbsp;
                        {isPreLoading ? (
                          <Skeleton
                            variant="text"
                            sx={{
                              fontSize: "1.5rem",
                              width: "20%",
                              display: "inline-block",
                              marginRight: "10px",
                            }}
                          />
                        ) : (
                          <>{getStatusRequest(questionData)}</>
                        )}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography
                        variant="inherit"
                        component="h2"
                        className={
                          styles.ItemDescriptionElement + " " + styles.ColorText
                        }
                        sx={{
                          marginBottom: "0.5rem",
                          marginTop: "1rem",
                        }}
                      >
                        Pregunta
                      </Typography>
                      <Typography
                        variant="inherit"
                        component="p"
                        className={
                          styles.ItemDescriptionElement +
                          " " +
                          styles.ColorTextGray +
                          " " +
                          styles.ItemDescriptionElementText
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        {isPreLoading ? (
                          <>
                            <Skeleton
                              variant="text"
                              sx={{
                                fontSize: "1.5rem",
                                width: "60%",
                                display: "block",
                                marginRight: "10px",
                              }}
                            />
                            <Skeleton
                              variant="text"
                              sx={{
                                fontSize: "1.5rem",
                                width: "80%",
                                display: "block",
                                marginRight: "10px",
                              }}
                            />
                          </>
                        ) : (
                          <>{getObjectProperty(questionData, "consulta")}</>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography
                        variant="inherit"
                        component="h2"
                        className={
                          styles.ItemDescriptionElement + " " + styles.ColorText
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        Porque no es claro
                      </Typography>
                      <Typography
                        variant="inherit"
                        component="p"
                        className={
                          styles.ItemDescriptionElement +
                          " " +
                          styles.ColorTextGray +
                          " " +
                          styles.ItemDescriptionElementText
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        {isPreLoading ? (
                          <>
                            <Skeleton
                              variant="text"
                              sx={{
                                fontSize: "1.5rem",
                                width: "60%",
                                display: "block",
                                marginRight: "10px",
                              }}
                            />
                            <Skeleton
                              variant="text"
                              sx={{
                                fontSize: "1.5rem",
                                width: "80%",
                                display: "block",
                                marginRight: "10px",
                              }}
                            />
                          </>
                        ) : (
                          <>{getObjectProperty(questionData, "mejora")}</>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography
                        variant="inherit"
                        component="h2"
                        className={
                          styles.ItemDescriptionElement + " " + styles.ColorText
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        Correo Electrónico del Usuario
                      </Typography>
                      <Typography
                        variant="inherit"
                        component="p"
                        className={
                          styles.ItemDescriptionElement +
                          " " +
                          styles.ColorTextGray +
                          " " +
                          styles.ItemDescriptionElementText
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        {isPreLoading ? (
                          <>
                            <Skeleton
                              variant="text"
                              sx={{
                                fontSize: "1.5rem",
                                width: "60%",
                                display: "block",
                                marginRight: "10px",
                              }}
                            />
                          </>
                        ) : (
                          <>{questionData?.correo}</>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography
                        variant="inherit"
                        component="h2"
                        className={
                          styles.ItemDescriptionElement +
                          " " +
                          styles.ColorTextGray
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        La consulta se encontró en la etapa: &nbsp;
                        <span className={styles.ColorText}>
                          {isPreLoading ? (
                            <Skeleton
                              variant="text"
                              sx={{
                                fontSize: "1.5rem",
                                width: "20%",
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            />
                          ) : (
                            <>{getStage(questionData)}</>
                          )}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {/*
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={styles.ElementContainer } sx={{height:"100%"}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="inherit" component="h1"  className={styles.ItemTitleElement + " "+ styles.ColorTextPrimaryA}>
                        Respuesta
                          </Typography>

                        </Grid>


                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                        <Typography variant="inherit" component="p"  className={styles.ItemDescriptionElement+" "+styles.ColorTextGray+" "+styles.ItemDescriptionElementText} sx={{
                            marginTop:"1rem"
                        }}>
                       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </Typography>
                        </Grid>



                    </Grid>
                </Box>
            </Grid>*/}

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box
                  className={styles.ElementContainer}
                  sx={{ height: "100%" }}
                >
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography
                        variant="inherit"
                        component="h2"
                        className={
                          styles.ItemTitleElement +
                          " " +
                          styles.ColorTextPrimaryA
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        Otras Consultas al mismo llamado en VigiA
                      </Typography>
                      <Box className={styles.ResolutionsContainer}>
                        {similarClaims.length == 0 && (
                          <>
                            <br /> <br />
                            <Typography
                              variant="inherit"
                              component="p"
                              className={
                                styles.ItemDescriptionElement +
                                " " +
                                styles.ColorText
                              }
                              sx={{
                                marginBottom: "0.5rem",
                              }}
                            >
                              No hay más consultas sobre este llamado en VigiA
                            </Typography>
                          </>
                        )}
                        {similarClaims.map((data: any, index) => {
                          return (
                            <Link
                              href={
                                "/app/questionAgent/?id=" +
                                encodeURIComponent(data?.enlace)
                              }
                              key={index}
                            >
                              <a>
                                <Box
                                  className={styles.ResolutionContainer}
                                  key={index}
                                >
                                  <img
                                    src="/images/icons/sin_resolucion.svg"
                                    alt=""
                                    className={styles.ResolutionClaimImage}
                                  />
                                  <Typography
                                    variant="inherit"
                                    component="p"
                                    className={
                                      styles.ResolutionNameText +
                                      " " +
                                      styles.ColorTextPrimaryA
                                    }
                                    sx={{ textAlign: "center" }}
                                  >
                                    <b>
                                      {getDateFormat(data?.fecha_creacion)}{" "}
                                    </b>
                                    <br />
                                    {data?.tarea_descripcion}
                                  </Typography>
                                </Box>
                              </a>
                            </Link>
                          );
                        })}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box
                  className={styles.ElementContainer}
                  sx={{ height: "100%" }}
                >
                  <Grid container>
                    <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <img
                        src="/images/contacto.svg"
                        className={styles.ImageItemUOC}
                      />
                    </Grid>
                    <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                      <Typography
                        variant="inherit"
                        component="h2"
                        className={
                          styles.ItemTitleElement +
                          " " +
                          styles.ColorTextPrimaryA
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        Datos de contacto del llamado
                      </Typography>

                      <Typography
                        variant="inherit"
                        component="p"
                        className={
                          styles.ItemDescriptionElement + " " + styles.ColorText
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        {isLoading ? (
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1.5rem", width: "80%" }}
                          />
                        ) : getProcuringEntityType(processData) ? (
                          getProcuringEntityType(processData)
                        ) : (
                          ""
                        )}
                      </Typography>

                      <Typography
                        variant="inherit"
                        component="p"
                        className={
                          styles.ItemDescriptionElement +
                          " " +
                          styles.ColorTextGray
                        }
                        sx={{
                          marginBottom: "0.5rem",
                        }}
                      >
                        {isLoading ? (
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1.5rem", width: "80%" }}
                          />
                        ) : getProcuringEntityContactName(processData) ? (
                          getProcuringEntityContactName(processData)
                        ) : (
                          "Persona de contacto no disponible"
                        )}
                      </Typography>
                      {
                        <Typography
                          variant="inherit"
                          component="p"
                          className={
                            styles.ItemDescriptionElement +
                            " " +
                            styles.ColorText
                          }
                          sx={{
                            marginBottom: "0.5rem",
                          }}
                        >
                          {isLoading ? (
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1.5rem", width: "80%" }}
                            />
                          ) : getProcuringEntity(processData) ? (
                            getProcuringEntity(processData)
                          ) : (
                            "UOC no disponible"
                          )}
                        </Typography>
                      }
                      <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <Typography
                            variant="inherit"
                            component="p"
                            className={
                              styles.ItemDescriptionElement +
                              " " +
                              styles.ColorTextGray
                            }
                            sx={{
                              marginBottom: "0.5rem",
                            }}
                          >
                            {isLoading ? (
                              <Skeleton
                                variant="text"
                                sx={{ fontSize: "1.5rem", width: "60%" }}
                              />
                            ) : getProcuringEntityContactTelephone(
                                processData
                              ) ? (
                              getProcuringEntityContactTelephone(processData)
                            ) : (
                              "Telefono de contacto no disponible"
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <Typography
                            variant="inherit"
                            component="p"
                            className={
                              styles.ItemDescriptionElement +
                              " " +
                              styles.ColorTextGray
                            }
                            sx={{
                              marginBottom: "0.5rem",
                            }}
                          >
                            {isLoading ? (
                              <Skeleton
                                variant="text"
                                sx={{ fontSize: "1.5rem", width: "80%" }}
                              />
                            ) : getProcuringEntityContactEmail(processData) ? (
                              getProcuringEntityContactEmail(processData)
                            ) : (
                              "Email de contacto no disponible"
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={styles.ElementContainer}>
                  {/*<img src="/images/icons/corazon.svg" alt="" className={styles.LikeButton} />*/}
                  <Grid container>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <h1 className={styles.TitleProcess}>
                        {isLoading ? (
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1rem", width: "60%" }}
                          />
                        ) : getProcessTitle(processData) ? (
                          getProcessTitle(processData)
                        ) : (
                          "Titulo no definido por el momento"
                        )}
                      </h1>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Typography
                        variant="inherit"
                        component="h2"
                        className={
                          styles.TitleProcess + " " + styles.ColorTextGray
                        }
                        sx={{ textAlign: "right" }}
                      >
                        ID Llamado:{" "}
                        <span className={styles.ColorText}>
                          {getObjectProperty(questionData, "llamado")}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>

                  <h2 className={styles.ProcessEntity}>
                    {isLoading ? (
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1rem", width: "80%" }}
                      />
                    ) : (
                      <span>
                        <span>
                          {getBuyer(processData)
                            ? getBuyer(processData)
                            : "Comprador no disponible"}
                        </span>
                        {getProcuringEntity(processData) ? (
                          <span>
                            <span className={styles.LineDivisor}></span>
                            <span>{getProcuringEntity(processData)}</span>
                          </span>
                        ) : null}
                      </span>
                    )}
                  </h2>
                  <Box>
                    <Grid container sx={{ marginBottom: "1rem" }}>
                      <Grid item xs={2} sm={1} md={1} lg={1} xl={1} sx={{}}>
                        <img
                          src="/images/icons/proceso/llamado.svg"
                          alt=""
                          className={styles.ImageProcessProperty}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        sm={11}
                        md={11}
                        lg={11}
                        xl={11}
                        sx={{ alignItems: "center", display: "flex" }}
                      >
                        <b></b>
                        {isLoading ? (
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1rem", width: "65%" }}
                          />
                        ) : (
                          <Typography
                            variant="inherit"
                            component="p"
                            className={styles.ProcessPropertyText}
                            sx={{ paddingLeft: "0.2rem" }}
                          >
                            <span>
                              {getProcurementMethodDetails(processData)
                                ? getProcurementMethodDetails(processData)
                                : "No disponible por el momento"}
                            </span>
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginBottom: "1rem" }}>
                      <Grid item xs={12} sm={1} md={1} lg={1} xl={1} sx={{}}>
                        <img
                          src="/images/icons/proceso/items.svg"
                          alt=""
                          className={styles.ImageProcessProperty}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={11}
                        md={11}
                        lg={11}
                        xl={11}
                        sx={{ alignItems: "center", display: "flex" }}
                      >
                        <Box
                          sx={{ marginLeft: "0.2rem" }}
                          className={styles.ItemsContainer}
                        >
                          <Box className={styles.ItemsSubContainer}>
                            <Box className={styles.ItemsSubContainer2}>
                              {isLoading ? (
                                <Grid container>
                                  <Grid
                                    item
                                    xs={4}
                                    sm={4}
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{}}
                                    className={styles.ItemsContainerTitle}
                                  >
                                    <div className={styles.ItemsContainerText}>
                                      <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "1rem", width: "65%" }}
                                      />
                                    </div>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    xl={3}
                                    sx={{ textAlign: "center" }}
                                  >
                                    <div className={styles.ItemsContainerText}>
                                      <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "1rem", width: "65%" }}
                                      />
                                    </div>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    sm={4}
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{ textAlign: "right" }}
                                  >
                                    <div className={styles.ItemsContainerText}>
                                      <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "1rem", width: "65%" }}
                                      />
                                    </div>
                                  </Grid>
                                </Grid>
                              ) : null}
                              {getProcessItems(processData).length ? (
                                <Grid container>
                                  <Grid
                                    item
                                    xs={4}
                                    sm={4}
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{}}
                                    className={styles.ItemsContainerTitle}
                                  >
                                    <Typography
                                      variant="h6"
                                      component="h6"
                                      className={styles.ItemsContainerTitle}
                                    >
                                      <b>Ítem</b>
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    xl={3}
                                    sx={{ textAlign: "center" }}
                                  >
                                    <Typography
                                      variant="h6"
                                      component="h6"
                                      className={styles.ItemsContainerTitle}
                                    >
                                      <b>Cantidad</b>
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    sm={4}
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{ textAlign: "right" }}
                                  >
                                    <Typography
                                      variant="h6"
                                      component="h6"
                                      className={styles.ItemsContainerTitle}
                                    >
                                      Monto
                                    </Typography>
                                  </Grid>
                                </Grid>
                              ) : null}
                              <Box className={styles.ItemsScroll}>
                                {isLoading
                                  ? [1, 2, 3].map((item, index) => {
                                      return (
                                        <Grid container key={index}>
                                          <Grid
                                            item
                                            xs={4}
                                            sm={4}
                                            md={4}
                                            lg={4}
                                            xl={4}
                                            sx={{}}
                                            className={
                                              styles.ItemsContainerTitle
                                            }
                                          >
                                            <div
                                              className={
                                                styles.ItemsContainerText
                                              }
                                            >
                                              <Skeleton
                                                variant="text"
                                                sx={{
                                                  fontSize: "1rem",
                                                  width: "75%",
                                                }}
                                              />
                                            </div>
                                          </Grid>
                                          <Grid
                                            item
                                            xs={3}
                                            sm={3}
                                            md={3}
                                            lg={3}
                                            xl={3}
                                            sx={{ textAlign: "center" }}
                                          >
                                            <div
                                              className={
                                                styles.ItemsContainerText
                                              }
                                            >
                                              <Skeleton
                                                variant="text"
                                                sx={{
                                                  fontSize: "1rem",
                                                  width: "45%",
                                                }}
                                              />
                                            </div>
                                          </Grid>
                                          <Grid
                                            item
                                            xs={4}
                                            sm={4}
                                            md={4}
                                            lg={4}
                                            xl={4}
                                            sx={{ textAlign: "right" }}
                                          >
                                            <div
                                              className={
                                                styles.ItemsContainerText
                                              }
                                            >
                                              <Skeleton
                                                variant="text"
                                                sx={{
                                                  fontSize: "1rem",
                                                  width: "65%",
                                                }}
                                              />
                                            </div>
                                          </Grid>
                                        </Grid>
                                      );
                                    })
                                  : null}
                                {getProcessItems(processData).map(
                                  (item: any, index: number) => {
                                    return (
                                      <Grid container key={index}>
                                        <Grid
                                          item
                                          xs={4}
                                          sm={4}
                                          md={4}
                                          lg={4}
                                          xl={4}
                                          sx={{}}
                                        >
                                          <Typography
                                            variant="h6"
                                            component="h6"
                                            className={
                                              styles.ItemsContainerText
                                            }
                                          >
                                            {item.description}
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
                                            textAlign: "center",
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="h6"
                                            component="h6"
                                            className={
                                              styles.ItemsContainerText
                                            }
                                          >
                                            {item?.quantity
                                              ? item.quantity
                                              : "N/D"}{" "}
                                            &nbsp;
                                            <span
                                              className={styles.ColorTextDark}
                                            >
                                              <b>{item?.unit?.id}</b>
                                            </span>
                                          </Typography>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={4}
                                          sm={4}
                                          md={4}
                                          lg={4}
                                          xl={4}
                                          sx={{
                                            textAlign: "center",
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "right",
                                          }}
                                        >
                                          <Typography
                                            variant="h6"
                                            component="h6"
                                            className={
                                              styles.ItemsContainerTextAmount
                                            }
                                          >
                                            <span>
                                              {
                                                item?.unit?.value?.amount
                                                  ? getCurrencyAmount(
                                                      item?.unit?.value?.amount
                                                    )
                                                  : "N/D"
                                                /*conformToMask(item?.unit?.value?.amount,MoneyMask).conformedValue*/
                                              }
                                            </span>
                                            &nbsp;
                                            <span
                                              className={styles.ColorTextDark}
                                            >
                                              {item?.unit?.value?.currency
                                                ? item?.unit?.value?.currency
                                                : ""}
                                            </span>
                                          </Typography>
                                        </Grid>

                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          xl={12}
                                        >
                                          <Box
                                            className={styles.ItemsDivisor}
                                          ></Box>
                                        </Grid>
                                      </Grid>
                                    );
                                  }
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Box className={styles.ItemsContainerDivisor}></Box>
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{ textAlign: "right" }}
                            >
                              <Typography
                                variant="h6"
                                component="h6"
                                className={styles.ItemsContainerTextAmountTotal}
                              >
                                {isLoading ? (
                                  <Skeleton
                                    variant="text"
                                    sx={{
                                      fontSize: "1rem",
                                      width: "6rem",
                                      textAlign: "right",
                                      display: "inline-block",
                                      marginRight: "1rem",
                                    }}
                                  />
                                ) : (
                                  <span>
                                    {getProcessAmount(processData)
                                      ? getProcessAmount(processData)
                                      : "Monto aun no definido"}
                                  </span>
                                )}

                                {isLoading ? (
                                  <Skeleton
                                    variant="text"
                                    sx={{
                                      fontSize: "1rem",
                                      width: "2rem",
                                      textAlign: "right",
                                      display: "inline-block",
                                    }}
                                  />
                                ) : (
                                  <span className={styles.Currency}>
                                    {" "}
                                    {getProcessCurrency(processData)
                                      ? getProcessCurrency(processData)
                                      : "N/D"}
                                  </span>
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginBottom: "1rem" }}>
                      <Grid item xs={2} sm={1} md={1} lg={1} xl={1} sx={{}}>
                        <img
                          src="/images/icons/proceso/fecha_consultas.svg"
                          alt=""
                          className={styles.ImageProcessProperty}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sm={5}
                        md={5}
                        lg={5}
                        xl={5}
                        sx={{ alignItems: "center", display: "flex" }}
                      >
                        {isLoading ? (
                          <Skeleton
                            className={styles.ProcessPropertyText}
                            variant="text"
                            sx={{
                              fontSize: "1rem",
                              width: "6rem",
                              textAlign: "right",
                              display: "inline-block",
                              marginRight: "1rem",
                            }}
                          />
                        ) : (
                          <Typography
                            variant="inherit"
                            component="p"
                            className={styles.ProcessPropertyText}
                            sx={{ paddingLeft: "0.2rem" }}
                          >
                            <span>
                              {getEnquiryPeriodEndDate(processData) ? (
                                <span>
                                  Consultas{" "}
                                  {
                                    <span>
                                      <b>
                                        {getDateFormat(
                                          getEnquiryPeriodEndDate(processData)
                                        )}
                                      </b>
                                    </span>
                                  }{" "}
                                  Max.
                                </span>
                              ) : (
                                "Fecha máxima de consultas no disponible"
                              )}
                            </span>
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={2} sm={1} md={1} lg={1} xl={1} sx={{}}>
                        <img
                          src="/images/icons/proceso/fecha_ofertas.svg"
                          alt=""
                          className={styles.ImageProcessProperty}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sm={5}
                        md={5}
                        lg={5}
                        xl={5}
                        sx={{ alignItems: "center", display: "flex" }}
                      >
                        {isLoading ? (
                          <Skeleton
                            className={styles.ProcessPropertyText}
                            variant="text"
                            sx={{
                              fontSize: "1rem",
                              width: "6rem",
                              textAlign: "right",
                              display: "inline-block",
                              marginRight: "1rem",
                            }}
                          />
                        ) : (
                          <Typography
                            variant="inherit"
                            component="p"
                            className={styles.ProcessPropertyText}
                            sx={{ paddingLeft: "0.2rem" }}
                          >
                            <span>
                              {getTenderPeriodEndDate(processData) ? (
                                <span>
                                  Ofertas{" "}
                                  {
                                    <span>
                                      <b>
                                        {getDateFormat(
                                          getTenderPeriodEndDate(processData)
                                        )}
                                      </b>
                                    </span>
                                  }{" "}
                                  Max.
                                </span>
                              ) : (
                                "Fecha máxima de ofertas no disponible"
                              )}
                            </span>
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginBottom: "1rem" }}>
                      <Grid item xs={2} sm={1} md={1} lg={1} xl={1} sx={{}}>
                        <img
                          src="/images/icons/proceso/pliego.svg"
                          alt=""
                          className={styles.ImageProcessProperty}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sm={5}
                        md={5}
                        lg={5}
                        xl={5}
                        sx={{ alignItems: "center", display: "flex" }}
                      >
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ProcessPropertyText}
                          sx={{ paddingLeft: "0.2rem" }}
                        >
                          {getProcessPliego(processData) ? (
                            <a
                              href={getProcessPliego(processData)}
                              className={styles.LinkedText}
                            >
                              <span>
                                Puedes obtener más información sobre este
                                proceso
                              </span>
                            </a>
                          ) : (
                            ""
                          )}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sm={1}
                        md={1}
                        lg={1}
                        xl={1}
                        sx={{}}
                      ></Grid>
                      <Grid
                        item
                        xs={4}
                        sm={5}
                        md={5}
                        lg={5}
                        xl={5}
                        sx={{ alignItems: "center", display: "flex" }}
                      ></Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{}}
                      >
                        {/*
<Typography variant="inherit" component="p" className={styles.ProcessPropertyText} sx={{marginTop:"1.5rem"}}>
        Puedes obtener más información sobre este proceso <a href="https://www.contrataciones.gov.py/licitaciones/convocatoria/410129-adquisicion-productos-papel-carton-1.html" className={styles.LinkedText}>
          <span>Click Aquí</span>
          </a>

          </Typography>
*/}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              {!isLoading && !questionData?.usuario && (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Box
                    className={styles.ElementContainer}
                    sx={{ height: "100%" }}
                  >
                    <Grid container>
                      <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={
                            styles.ItemTitleElement +
                            " " +
                            styles.ColorTextPrimaryA
                          }
                          sx={{
                            marginBottom: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Esta consulta se hizo de forma &nbsp;
                          <span className={styles.ColorText}>anónima</span>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              {questionData?.usuario && (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Box
                    className={styles.ElementContainer}
                    sx={{ height: "100%" }}
                  >
                    <Grid container>
                      <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={
                            styles.ItemTitleElement +
                            " " +
                            styles.ColorTextPrimaryA
                          }
                          sx={{
                            marginBottom: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Otras consultas realizadas por &nbsp;
                          <span className={styles.ColorText}>
                            {questionData?.nombres} {questionData?.apellidos}
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                        <ThemeProvider theme={PersonalizedTextSearch}>
                          <TextField
                            sx={{ marginBottom: "0.5rem" }}
                            label="Buscar..."
                            name="search"
                            type="text"
                            variant="filled"
                            fullWidth
                            className={
                              styles.GrayInputText +
                              " " +
                              styles.InputTextFilterSearch
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              let fields = [...UserClaimsFieldsState];
                              UserClaimsGetField("search", fields).value =
                                e.target.value;

                              setUserClaimsFieldsState(fields);
                            }}
                            value={UserClaimsGetFieldState("search").value}
                            onKeyUp={(e: any) => {
                              if (e.key === "Enter") {
                                UserClaimsApplyFilter("search");
                              }
                            }}
                            InputProps={{
                              disableUnderline: false,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                    className={styles.SearchButtonText}
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
                    <table
                      className={styles.tableData + " " + styles.tableCenter}
                    >
                      <thead>
                        <tr>
                          {/*<th>Tipo de Reclamo</th>*/}
                          <th>Consulta</th>
                          <th>Creación</th>
                          <th>Llamado</th>
                          <th>Etapa del proceso</th>
                          <th>Estado de la consulta </th>
                          <th>Encargado</th>
                          {/*
                                <th>Encargado</th>
                                <th>Asignado</th>*/}
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={6}>
                              <Box
                                sx={{
                                  alignItems: "center",
                                  display: "flex",
                                  justifyContent: "center",
                                  textAlign: "center",
                                }}
                              >
                                <CircularProgress />
                                <div>&nbsp;Cargando..</div>
                              </Box>
                            </td>
                          </tr>
                        ) : !userClaims.length && !isLoading ? (
                          <tr>
                            <td data-label="" colSpan={6}>
                              <b>No se encontraron resultados</b>
                            </td>
                          </tr>
                        ) : (
                          userClaims.map((data: any, index: number) => {
                            return (
                              <tr key={index}>
                                {/*<td data-label="Tipo de Reclamo">Consulta</td>*/}
                                <td
                                  data-label="Consulta"
                                  title={data.consulta + "\n" + data.mejora}
                                >
                                  <Typography
                                title={data.enlace}
                                variant="inherit"
                                component="div"
                                sx={{

                                  overflowX: "clip",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {data.enlace}
                              </Typography>
                                </td>
                                <td data-label="Creación">
                                  {getDateFormat(data.fecha_creacion)}
                                </td>
                                <td data-label="Llamado">
                                  <Link
                                    href={
                                      "/identifiedProcess?id=" +
                                      encodeURIComponent(data.llamado) +
                                      "&state=claim"
                                    }
                                  >
                                    <a className={styles.LinkedText}>
                                      {data.llamado}
                                    </a>
                                  </Link>
                                </td>
                                <td data-label="Etapa del proceso">
                                  {getStage(data.etapa)}
                                </td>
                                <td data-label="Estado de la consulta">
                                  {data.tarea_descripcion}
                                </td>
                                <td data-label="Encargado">
                                  {data.tarea_encargado}
                                </td>
                                {/*
                                <td data-label="Encargado">DNCP</td>
                              <td data-label="Asignado">2022-05-15</td>*/}
                                <td data-label="">
                                  <Link
                                    href={
                                      "/app/questionAgent?id=" +
                                      encodeURIComponent(data.enlace)
                                    }
                                  >
                                    <Button
                                      title="Visualizar"
                                      variant="contained"
                                      disableElevation
                                      className={
                                        styles.ButtonPrincipal +
                                        " " +
                                        styles.ButtonSmall
                                      }
                                      sx={{ mr: 1 }}
                                    >
                                      Revisar
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                    <Box>
                      <Box
                        className={styles.Pagination}
                        sx={{ textAlign: "center", marginTop: "1rem" }}
                      >
                        {UserClaimsPaginationState.actualPage > 1 && (
                          <span
                            onClick={() => {
                              UserClaimsApplyFilter(
                                "page",
                                UserClaimsPaginationState.actualPage - 1
                              );
                            }}
                          >
                            <div className={styles.PaginationBefore}>
                              <NavigateBeforeIcon></NavigateBeforeIcon>
                            </div>
                          </span>
                        )}
                        {UserClaimsPaginationState.pages.map(
                          (page: any, index: number) => {
                            return page == "..." ? (
                              <span
                                key={index}
                                onClick={() => {
                                  UserClaimsApplyFilter(
                                    "page",
                                    UserClaimsPaginationState.pages[index - 1] +
                                      1
                                  );
                                }}
                              >
                                <div
                                  key={index}
                                  className={styles.PaginationNumber}
                                >
                                  {page}
                                </div>
                              </span>
                            ) : (
                              <span
                                key={index}
                                onClick={() => {
                                  UserClaimsApplyFilter("page", page);
                                }}
                              >
                                <div
                                  className={
                                    styles.PaginationNumber +
                                    " " +
                                    (page ==
                                    UserClaimsPaginationState.actualPage
                                      ? styles.Active
                                      : "")
                                  }
                                >
                                  {page}
                                </div>
                              </span>
                            );
                          }
                        )}

                        {UserClaimsPaginationState.actualPage <
                          UserClaimsPaginationState.totalPages && (
                          <span
                            onClick={() => {
                              UserClaimsApplyFilter(
                                "page",
                                UserClaimsPaginationState.actualPage + 1
                              );
                            }}
                          >
                            <div className={styles.PaginationNext}>
                              <NavigateNextIcon></NavigateNextIcon>
                            </div>
                          </span>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid
                item
                xs={12}
                sm={5}
                md={5}
                lg={5}
                xl={5}
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                <Link
                  href={{
                    pathname: "/app/publicationAgent",
                    query: {
                      enlace: questionData?.enlace,
                      llamado: questionData?.llamado,
                      tipo: CONSULTA,
                    },
                  }}
                >
                  <Button
                    title="Realizar Publicación"
                    variant="contained"
                    disableElevation
                    className={
                      styles.ButtonPrincipal + " " + styles.ButtonContrast_2
                    }
                  >
                    Realizar Publicación
                  </Button>
                </Link>
              </Grid>
              <Grid
                item
                xs={12}
                sm={7}
                md={7}
                lg={7}
                xl={7}
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "right",
                  },
                }}
                className={styles.MultipleButtons}
              >
                <Button
                  title="Estado"
                  onClick={handleOpenModalState}
                  variant="contained"
                  disableElevation
                  className={
                    styles.ButtonPrincipal + " " + styles.ButtonContrast_4
                  }
                >
                  Estado
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Layout>
    </>
  );
};

export default Question;
