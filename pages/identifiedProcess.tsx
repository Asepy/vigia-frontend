import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Login.module.scss";
import Layout from "../components/ui/Layout/Layout";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Breakpoint, Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ifetch from "isomorphic-fetch";
import {
  getProcessTitle,
  getProcessAmount,
  getProcessCurrency,
  getTenderPeriodEndDate,
  getEnquiryPeriodEndDate,
  getProcurementMethodDetails,
  getBuyer,
  getProcuringEntity,
  getProcessPlanningId,
  getMainProcurementCategoryDetails,
  getProcessItems,
  getProcessFaceEnquiry,
  getProcessPliegoSlug,
  getCurrencyAmount,
  getProcessFaceClaim,
  checkProcessClaim,
  checkProcessEnquiry,
  getProcessURLSlug,
  getProcessSubmissionMethodDetails
} from "../components/imports/ProcessFunctions";
//import {} from '@formatjs/intl-numberformat/polyfill';

import Skeleton from "@mui/material/Skeleton";
import { getDateFormat, getNumber } from "../components/imports/Functions";


import { Auth } from "aws-amplify";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import fetchData from "../src/utils/fetch";
const IdentifiedProcess: NextPage = () => {
  const { query, isReady } = useRouter();
  var router = useRouter();
  const [formState, setFormState] = React.useState("normal");
  const [signedInUserState, setSignedInUserState] = React.useState(false);
  const [likeState, setLikeState] = React.useState(false);
  const [signedInUserAttributesState, setSignedInUserAttributesState]: any =
    React.useState({});
  const [isEffect, setEffect] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingLike, setIsLoadingLike] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState("");

  const [openModalLike, setOpenModalLike] = React.useState(false);

  const handleOpenModalLike = () => setOpenModalLike(true);
  const handleCloseModalLike = () => setOpenModalLike(false);

  const [processData, setProcessData]: any = React.useState({});
  const [items, setItems] = React.useState([]);
  const [isMIPYME, setIsMIPYME] = React.useState(false);
  const [DNCPData,setDNCPData] = React.useState<any>(null);
  function claim(){
    if(checkProcessClaim(processData)){
      router.push("/claims/form?id=" + encodeURIComponent(getProcessId()));
    }else{
      setMessage("Se te paso el tiempo para reclamar");
      setOpenMessage(true);
    }
  }
  function question(){
    if(checkProcessEnquiry(processData)){
      router.push("/questions/form?id=" + encodeURIComponent(getProcessId()));
    }else{
      setMessage("Se te paso el tiempo para consutar");
      setOpenMessage(true);
    }
  }
  async function getProcess(id: any,query:any) {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
     
      const data = await fetchData("getProcessDNCP",{ id: id },"POST",false);
      if (!data.error) {
        setProcessData(data);
        console.dir(data)
        

        getProcessFaceEnquiry(data);
        
        saveProcessView(data,query,0);
        //getMIPYME(data?.tender?.id);

        if(data?.tender?.suitability?.some((data:any)=>{
          return ["True","TRUE",true].includes(data?.sme)
  
        })){
          setIsMIPYME(true);
        }else{
          setIsMIPYME(false);
        }

        

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

  async function getMIPYME(tenderId: any) {
    //https://www.contrataciones.gov.py/licitaciones/convocatoria/438170-mantenimiento-aberturas-edificios-patrimoniales-bnf-casa-matriz-alrededores-sbe-1.html

    try{
      let data = await fetchData("checkProcessMIPYME",{
        tenderId: tenderId,
        
      },"POST",true);
      if(data?.MIPYME
        ){
          setIsMIPYME(true);
          
        }else{setIsMIPYME(false);}

    }
    catch(error){
      
      setIsMIPYME(false);
    }
    
    
  }

  async function saveProcessView(data:any,query:any,click:number){
    try{
      let saveData = await fetchData("saveProcessView",{
        call: getProcessPlanningId(data),
        ocid: data?.ocid,
        title: getProcessTitle(data),
        from:query['from'],
        click:click
      },"POST",true);
      
      }catch(e){
  
      }
  }

  React.useEffect(() => {
    if (isReady) {

      getProcess(query["id"],query);
      getSlug(query["id"]);
      switch (query["state"]) {
        case "claim":
          setFormState("claim");
          break;
        case "question":
          setFormState("question");
          break;
        default:
          setFormState("normal");
          break;
      }
      checkUser();
    }
  }, [isReady, query]);
  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      //setUiState("signedIn");
      setSignedInUserState(true);
      setSignedInUserAttributesState(user);
      getLike({ user: user?.attributes?.sub, call: query["id"] });
    } catch (err) {
      console.dir(err);
      setSignedInUserState(false);
    }
  }

  async function getLike(params: any) {
    try {
      let data: any = await fetchData("getLike",params,"POST",true);

      if (data?.llamado) {
        if (getNumber(data.estado) == 1) {
          setLikeState(true);
        } else {
          setLikeState(false);
        }
      }
    } catch (e) {
    } finally {
    }
  }

  async function addLike() {
    if (!signedInUserState) {
      return;
    }
    if (isLoadingLike) {
      return;
    }
    setIsLoadingLike(true);
    let params = {
      user: signedInUserAttributesState?.attributes?.sub,
      call: getProcessPlanningId(processData),
      ocid: processData?.ocid,
      status: likeState ? 0 : 1,
      title: getProcessTitle(processData),
      from: query['from']
    };
    try {
      let data: any = await fetchData("addLike",params,"POST",true);
  
      if (data?.id) {
        if (likeState) {
          setMessage("Ya no aparecerá este proceso en favoritos");
          setOpenMessage(true);
          setLikeState(false);
        } else {
          handleOpenModalLike();
          setLikeState(true);
        }
      }
    } catch (e) {
      setMessage("Ha ocurrido un error al dar Like");
      setOpenMessage(true);
    } finally {
      setIsLoadingLike(false);
    }
  }

  function getProcessId() {
    return router.query["id"] ? router.query["id"].toString() : "";
  }
  return (
    <>
      <Head>
        <title>VigiA - Llamado</title>
        <meta name="description" content="Llamado" />
        <link rel="icon" href="/favicon.ico" />
         
      </Head>
      <Layout>
        <Box
          sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 200px)" } }}
          className={styles.BackgroundSecondaryColor}
        >
          <Modal
            open={openModalLike}
            onClose={handleCloseModalLike}
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
                onClick={handleCloseModalLike}
              >
                <CloseIcon className={styles.IconCloseModalButton} />
              </Box>

              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                className={styles.TitleProcess}
              >
                Proceso agregado a tus favoritos
              </Typography>
              <Grid container>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4} sx={{}}>
                  <img
                    src="/images/icons/like.svg"
                    alt=""
                    className={styles.ImageLike}
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={8} lg={8} xl={8} sx={{}}>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    className={styles.ImageLikeDescription}
                  >
                    Podras dar seguimiento a este proceso de contratación,
                    accediento directamente desde tu Dashboard, haciendo click
                    en el item de tus procesos / favoritos.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ textAlign: "right", mb: "2rem" }}>
                    <Button
                      title="Aceptar"
                      variant="contained"
                      disableElevation
                      className={styles.ButtonPrincipal}
                      onClick={handleCloseModalLike}
                    >
                      Aceptar
                    </Button>
                  </Box>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    className={styles.ImageLikeDescription}
                  >
                    {getProcessURLSlug(DNCPData) ? (
                      <>
                        Puedes participar directamente ingresando al sitio de la
                        DNCP{" "}
                        <a
                          href={getProcessURLSlug(DNCPData)}
                          className={styles.LinkText}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Click Aquí
                        </a>
                      </>
                        
                      ) : (
                        "Enlace al proceso en el portal de la DNCP no disponible"
                      )}

                    
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <Container
            sx={{ paddingTop: { xs: "1rem" }, paddingBottom: { xs: "3rem" } }}
          >
            <Box className={styles.StartActionTitle}>
              {formState == "normal" && (
                <span>Seleccionaste el siguiente llamado:</span>
              )}
              {formState == "claim" && (
                <span>Encontramos el siguiente llamado:</span>
              )}
              {formState == "question" && (
                <span>Encontramos el siguiente llamado:</span>
              )}
            </Box>
            <Box className={styles.StartActionSubTitle}>
              {formState == "normal" && <span></span>}
              {formState == "claim" && (
                <span>
                  Asegurate de que este es el llamado sobre el que querés hacer
                  un reclamo.
                </span>
              )}
              {formState == "question" && (
                <span>
                  Asegurate de que este es el llamado sobre el que querés hacer
                  una consulta.
                </span>
              )}
            </Box>
            <Box className={styles.ProcessContainer}>
              {/*<img src="/images/icons/corazon.svg" alt="" className={styles.LikeButton} />*/}

              {signedInUserState && getProcessPlanningId(processData) && (
                <FavoriteIcon
                  className={
                    styles.LikeButton + " " + (likeState ? styles.Liked : "")
                  }
                  onClick={()=>{addLike();saveProcessView(processData,query,1);}}
                />
              )}
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
                        ? <span> <b>Entidad compradora:&nbsp;</b>{getBuyer(processData)}</span>
                        : "Comprador no disponible"}
                    </span>
                    {getProcuringEntity(processData) ? (
                      <span>
                        <span className={styles.LineDivisor}></span>
                        <span><b>UOC:&nbsp;</b>{getProcuringEntity(processData)}</span>
                      </span>
                    ) : null}
                  </span>
                )}
              </h2>
              {
                isMIPYME && (
                  <Grid container sx={{ marginBottom: "1rem" }}>
                  <Grid item xs={2} sm={1} md={1} lg={1} xl={1} sx={{}}>
                  <img
                      src="/images/icons/proceso/pyme.svg"
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
                     <Typography
                  variant="inherit"
                  component="p"
                  className={styles.ProcessPropertyText}
                  sx={{ paddingLeft: "0.2rem" }}
                >
                  <b>
                  Accesible para MIPYMES
                  </b>
                </Typography>


                  </Grid>
                    
                 
                  </Grid>
                  
                )

              }
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
                        <Box className={styles.ItemsSubContainer2}  sx={{ minWidth:{xs:"unset!important",sm:"unset!important",md:"600px"}}}>
                          {isLoading ? (
                            <Grid container sx={{display:{xs:"none",sm:"none",md:"flex"}}}>
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
                            <Grid >
                              <Grid container sx={{display:{xs:"none",sm:"none",md:"flex"}}}>
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
                                  
                                  <b>Monto</b>
                                </Typography>
                              </Grid>
                              </Grid>
                              
                            </Grid>
                          ) : null}
                          <Box className={styles.ItemsScroll}>
                            {isLoading
                              ? [1, 2, 3].map((item, index) => {
                                  return (
                                    <Grid key={index}>
                                      <Grid container sx={{display:{xs:"none",sm:"none",md:"flex"}}}>
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
                                        <div
                                          className={styles.ItemsContainerText}
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
                                          className={styles.ItemsContainerText}
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
                                          className={styles.ItemsContainerText}
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
                                    <Grid container sx={{display:{xs:"flex",sm:"flex",md:"none"}}}>
                                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{}} className={styles.ItemsContainerTitle} >
                                        <div className={styles.ItemsContainerText} >
                                          <Skeleton
                                            variant="text"
                                            sx={{
                                              fontSize: "1rem",
                                              width: "75%",
                                            }}
                                          />
                                        </div>
                                      </Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{}} className={styles.ItemsContainerTitle} >
                                        <div className={styles.ItemsContainerText} >
                                          <Skeleton
                                            variant="text"
                                            sx={{
                                              fontSize: "1rem",
                                              width: "75%",
                                            }}
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{}} className={styles.ItemsContainerTitle} >
                                        <div className={styles.ItemsContainerText} >
                                          <Skeleton
                                            variant="text"
                                            sx={{
                                              fontSize: "1rem",
                                              width: "75%",
                                            }}
                                          />
                                        </div>
                                      </Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{}} className={styles.ItemsContainerTitle} >
                                        <div className={styles.ItemsContainerText} >
                                          <Skeleton
                                            variant="text"
                                            sx={{
                                              fontSize: "1rem",
                                              width: "75%",
                                            }}
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{}} className={styles.ItemsContainerTitle} >
                                        <div className={styles.ItemsContainerText} >
                                          <Skeleton
                                            variant="text"
                                            sx={{
                                              fontSize: "1rem",
                                              width: "75%",
                                            }}
                                          />
                                        </div>
                                      </Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{}} className={styles.ItemsContainerTitle} >
                                        <div className={styles.ItemsContainerText} >
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
                                    </Grid>
                                    
                                  );
                                })
                              : null}
                            {getProcessItems(processData).map(
                              (item: any, index: number) => {
                                return (
                                  <Grid key={index}>
                                    <Grid container sx={{display:{xs:"none",sm:"none",md:"flex"}}}>
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
                                        className={styles.ItemsContainerText}
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
                                        className={styles.ItemsContainerText}
                                      >
                                        {item?.quantity ? item.quantity : "N/D"}{" "}
                                        &nbsp;
                                        <span className={styles.ColorTextDark}>
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
                                        
                                        className={[
                                          styles.ItemsContainerTextAmount/*,
                                          styles.ContractorItemsContainerTextAmount*/
                                          
                                        ].join(' ')
                                          
                                        }
                                      >
                                        <span>
                                          {
                                            item?.unit?.value?.amount
                                              ? getCurrencyAmount(
                                                  item?.unit?.value?.amount
                                                )
                                              : "N/D"
                                            /*conformToMask(item?.unit?.value?.amount,MoneyMask).conformedValue */
                                          }
                                        </span>
                                        
                                     
                                        &nbsp;
                                        <span className={styles.ColorTextDark}>
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


                                    <Grid container sx={{display:{xs:"flex",sm:"flex",md:"none"}}}>
                                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{}} className={styles.ItemsContainerTitle} >
                                        <Typography
                                      variant="h6"
                                      component="h6"
                                      className={styles.ItemsContainerTitle}
                                    >
                                      <b>Ítem</b>
                                    </Typography>
                                      </Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{}} className={styles.ItemsContainerTitle} >
                                        <Typography
                                        variant="h6"
                                        component="h6"
                                        className={styles.ItemsContainerText}
                                      >
                                        {item.description}
                                      </Typography>
                                      </Grid>

                                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{}} className={styles.ItemsContainerTitle} >
                                      <Typography
                                  variant="h6"
                                  component="h6"
                                  className={styles.ItemsContainerTitle}
                                >
                                  <b>Cantidad</b>
                                </Typography>
                                      </Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{}} className={styles.ItemsContainerTitle} >
                                    <Typography
                                        variant="h6"
                                        component="h6"
                                        className={styles.ItemsContainerText}
                                      >
                                        {item?.quantity ? item.quantity : "N/D"}{" "}
                                        &nbsp;
                                        <span className={styles.ColorTextDark}>
                                          <b>{item?.unit?.id}</b>
                                        </span>
                                      </Typography>
                                      </Grid>


                                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{}} className={styles.ItemsContainerTitle} >
                                      <Typography
                                  variant="h6"
                                  component="h6"
                                  className={styles.ItemsContainerTitle}
                                >
                                  
                                  <b>Monto</b>
                                </Typography>
                                      </Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{}} className={styles.ItemsContainerTitle} >
                                    <Typography
                                        variant="h6"
                                        component="h6"
                                        className={[
                                          styles.ItemsContainerTextAmount/*,
                                          styles.ContractorItemsContainerTextAmount*/
                                          
                                        ].join(' ')
                                          
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
                                        <span className={styles.ColorTextDark}>
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
                            className={[
                              styles.ItemsContainerTextAmountTotal,
                              //styles.ContractorItemsContainerTextAmountTotal
                              
                            ].join(' ')
                              
                            }
                          >
                          {
                              false&&<Box className={styles.ContractorTooltip}> 
                              <Typography
                            variant="h6"
                            component="h6" >
                              Este proceso cuenta con un sobreprecio
                            </Typography>
                            
                              </Box>
                            }
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
                <Grid item xs={2} sm={1} md={1} lg={1} xl={1} sx={{alignItems:"center",display:"flex"}}>
                    <img
                      src="/images/icons/proceso/detalle_ofertas.svg"
                      alt=""
                      className={styles.ImageProcessProperty}
                    />
                  </Grid><Grid
                    item
                    xs={10}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                    sx={{ alignItems: "center", display: "flex" }}
                  >
                    <Typography
                      variant="inherit"
                      component="p"
                      className={styles.ProcessPropertyText}
                      sx={{ paddingLeft: "0.2rem" }}
                    >
                      {getProcessSubmissionMethodDetails(processData) ? (
                          <span>
                          {getProcessSubmissionMethodDetails(processData)}
                          </span>
                    
                      ) : (
                        "Detalles de Entrega no disponibles"
                      )}
                    </Typography>
                  </Grid>


                  <Grid item xs={2} sm={1} md={1} lg={1} xl={1} sx={{alignItems:"center",display:"flex"}}>
                    <img
                      src="/images/icons/proceso/pliego.svg"
                      alt=""
                      className={styles.ImageProcessProperty}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={10}
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
                          <span
                          onClick={()=>{saveProcessView(processData,query,1);}}
                          >
                            Pliego de Bases y Condiciones, Requisitos
                            Fundamentales
                          </span>
                        </a>
                      ) : (
                        "Pliego de Bases y Condiciones no disponible"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{marginTop:{xs:"1rem",sm:"0"}}}>
                    
                    
                    {(formState=="question"||formState=="normal")&&<Grid container>



                    <Grid item xs={4} sm={2} md={2} lg={2} xl={2} sx={{}}>
{getProcessFaceEnquiry(processData).img ? (
  <img
    src={
      "/images/icons/caras/" +
      getProcessFaceEnquiry(processData).img
    }
    alt=""
    className={styles.ImageProcessProperty}
  />
) : null}
</Grid>
<Grid
item
xs={8}
sm={10}
md={10}
lg={10}
xl={10}
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
    variant="h6"
    component="h2"
    className={styles.ProcessPropertyText}
    sx={{ paddingLeft: "0.2rem" }}
  >
    {getProcessFaceEnquiry(processData).text ? (
      <span>
        <b>{getProcessFaceEnquiry(processData).text}</b>
      </span>
    ) : (
      <span>
        <b></b>
      </span>
    )}
  </Typography>
)}
</Grid>

                    </Grid>}
<br />

                    
                    {(formState=="claim"||formState=="normal")&&<Grid container>
                    <Grid item xs={4} sm={2} md={2} lg={2} xl={2} sx={{}}>
{getProcessFaceClaim(processData).img ? (
  <img
    src={
      "/images/icons/caras/" +
      getProcessFaceClaim(processData).img
    }
    alt=""
    className={styles.ImageProcessProperty}
  />
) : null}
</Grid>
<Grid
item
xs={8}
sm={10}
md={10}
lg={10}
xl={10}
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
    variant="h6"
    component="h2"
    className={styles.ProcessPropertyText}
    sx={{ paddingLeft: "0.2rem" }}
  >
    {getProcessFaceClaim(processData).text ? (
      <span>
        <b>{getProcessFaceClaim(processData).text}</b>
      </span>
    ) : (
      <span>
        <b></b>
      </span>
    )}
  </Typography>
)}
</Grid>
                    </Grid>}



            
                  </Grid>
                  
                </Grid>
              </Box>
            </Box>

            <Box
              sx={{
                paddingTop: "5px",
                margin: "0 auto",
                maxWidth: "900px",
                textAlign: {
                  xs: "center",
                  sm: "right",
                },
              }}
              className={styles.MultipleButtons}
            >
              {formState == "claim" && (
                <>
                  <Link href="/search">
                    <Button
                      title="Buscar Otro"
                      variant="contained"
                      disableElevation
                      className={
                        styles.ButtonPrincipal + " " + styles.ButtonContrast_2
                      }
                      
                    >
                      Buscar Otro
                    </Button>
                  </Link>
                  
                    <Button
                      title="Consultar"
                      variant="contained"
                      disableElevation
                      className={
                        styles.ButtonPrincipal + " " + styles.ButtonContrast_2
                      }
                      onClick={()=>{question();}}
                    >
                      Consultar
                    </Button>
                  
                
                    <Button
                      title="Reclamar"
                      variant="contained"
                      disableElevation
                      className={
                        styles.ButtonPrincipal + " " + styles.ButtonContrast_3
                      }
                      onClick={()=>{claim();}}
                    >
                      Reclamar
                    </Button>
                </>
              )}
              {(formState == "question" || formState == "normal") && (
                <>
                  <Link href="/search">
                    <Button
                      title="Buscar Otro"
                      variant="contained"
                      disableElevation
                      className={
                        styles.ButtonPrincipal + " " + styles.ButtonContrast_2
                      }
                    >
                      Buscar Otro
                    </Button>
                  </Link>
                 
                    <Button
                      title="Reclamar"
                      variant="contained"
                      disableElevation
                      className={
                        styles.ButtonPrincipal + " " + styles.ButtonContrast_2
                      }
                      onClick={()=>{claim();}}
                    >
                      Reclamar
                    </Button>
                    <Button
                      title="Consultar"
                      variant="contained"
                      disableElevation
                      className={
                        styles.ButtonPrincipal + " " + styles.ButtonContrast_3
                      }
                      onClick={()=>{question();}}
                    >
                      Consultar
                    </Button>
                </>
              )}
            </Box>
            {/*
       <Box className={styles.StartActionSubTitle_2} sx={{paddingTop:"1rem",display: 'flex',
    alignItems: 'center'}}>
       Sólo toma 10 minutos
       <img src="/images/icons/cronometro.svg" className={styles.IconStartAction}/>
      </Box>
      */}

            <Box
              className={styles.StartActionSubTitle_3}
              sx={{ paddingTop: "1rem" }}
            >
              Si deseas realizar este reporte de una forma anónima y que no se
              vinculen ninguno de tus datos personales, puedes realizar este
              proceso sin la necesidad de iniciar sesión.
              <br />
              Si deseas guardar un histórico de los reclamos que haz realizado,
              puedes identificarte. Recuerda que ninguna entidad podrá ver tus
              datos personales.
            </Box>
          </Container>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openMessage}
          autoHideDuration={6000}
          onClose={(event: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === "clickaway") {
              return;
            }
            setOpenMessage(false);
          }}
          message={Message}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={(
                  event: React.SyntheticEvent | Event,
                  reason?: string
                ) => {
                  if (reason === "clickaway") {
                    return;
                  }
                  setOpenMessage(false);
                }}
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

export default IdentifiedProcess;
