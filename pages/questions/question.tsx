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
import fetchData from "../../src/utils/fetch";
import { getDateFormat, getNumber, pagination, validate } from "../../components/imports/Functions";
import {
  getBuyer,
  getCurrencyAmount,
  getEnquiryPeriodEndDate,
  getProcessAmount,
  getProcessCurrency,
  getProcessItems,
  getProcessPliegoSlug,
  getProcessTitle,
  getProcurementMethodDetails,
  getProcuringEntity,
  getProcuringEntityContactEmail,
  getProcuringEntityContactName,
  getProcuringEntityContactTelephone,
  getProcuringEntityType,
  getTenderPeriodEndDate,
} from "../../components/imports/ProcessFunctions";



const Question: NextPage = () => {
  const { query, isReady } = useRouter();
  var router = useRouter();
  React.useEffect(() => {
    
    if (isReady) {
      getQuestion(query["id"]);
    }
  }, [isReady,query]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);
  const [isPreLoading, setIsPreLoading] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState("");

  const [openModalLike, setOpenModalLike] = React.useState(false);
  const handleOpenModalLike = () => setOpenModalLike(true);
  const handleCloseModalLike = () => setOpenModalLike(false);

  const [processData, setProcessData] = React.useState({});
  const [questionData, setQuestionData] = React.useState({});
  const [items, setItems] = React.useState([]);
  const [DNCPData,setDNCPData] = React.useState<any>(null);
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
  async function getSlug(id: any) {
    try {
     
      const data = await fetchData("getSlugDNCP",{ id: id },"POST",false);
      if (!data.error) {
        setDNCPData(data);
      }else{
        setDNCPData(null);
      }
      
    } catch (error) {
      setDNCPData(null);
      console.dir(error);
    } finally {
      
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
  async function getQuestion(link: any) {
    setIsPreLoading(true);
    setIsLoading(true);
    try {
      
      const data = await fetchData("getQuestion",{ link: link },"POST",false);
      if (!data.error) {
        setQuestionData(data);
        getProcess(data?.ocid);
        getSlug(data?.llamado);
       
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
      console.dir(error);
    } finally {
      setIsPreLoading(false);
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
        <Box
          sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 200px)" } }}
          className={styles.BackgroundPreColor}
        >
          <Container
            sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
          >
            {(!notFound)&&<Grid container spacing={2}>
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
                          {getProcessPliegoSlug(DNCPData) ? (
                            <a
                              href={getProcessPliegoSlug(DNCPData)}
                              className={styles.LinkedText}
                              target="_blank"
                              rel="noreferrer"
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
            </Grid>}
            {
              (notFound)&&<Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
               
                  sx={{ height: "100%" }}
                >
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography
                        variant="inherit"
                        component="h1"
                        className={
                          styles.ItemTitleElement +
                          " " +
                          styles.ColorTextPrimaryA
                        }
                        sx={{
                          textAlign:"center"
                        }}
                      >
                        Consulta no Encontrada
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ textAlign:"center",marginTop:"1rem" }}
                    >
                      
                       <img
                src="/images/icons/consultas.svg"
                alt=""
                className={styles.ImagenPanelItem}
              />
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
                          textAlign:"center"
                        }}
                      >
                      #{query['id']}
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
                          textAlign:"center"
                        }}
                      >
                       Verifica que el identificador ha sido ingresado correctamente
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              </Grid>
            }
          </Container>
        </Box>
      </Layout>
    </>
  );
};

export default Question;
