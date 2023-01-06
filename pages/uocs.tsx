import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Login.module.scss';
import Layout from '../components/ui/Layout/Layout';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CircularProgress, Container } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import { useRouter } from 'next/router';
import fetchData from '../src/utils/fetch';
import { UOCResume,UOCContactPoint, UOCContactPointResponse } from '../src/interfaces/uoc';
import CountUp from 'react-countup';
import {getString,getNumber,getDateFormat,validate, pagination} from  '../components/imports/Functions';
import {getStage} from  '../components/imports/ProcessFunctions';
const PersonalizedText = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root":{
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "2rem",
           /* border:"3px solid #6817FF!important",*/
            border:"none!important",
            backgroundColor:"#ffffff!important",
            padding:"0!important"
          },
          "&.MuiInputBase-root::after":{
            background: "none!important",
            border:"none!important"
          },
          "&.MuiInputBase-root::before":{
            background: "none!important",
            border:"none!important"
          }
          // Some CSS
          
        },
        
      },
      defaultProps:{
        
      }
    },
  },
});

const PersonalizedTextSearch = createTheme({
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
            "&.MuiInputBase-root::after":{
              background: "none!important",
              border:"none!important"
            },
            "&.MuiInputBase-root::before":{
              background: "none!important",
              border:"none!important"
            },
            "&.MuiInputBase-root":{
              background: "none!important",
              border:"none!important",
              borderRadius: "2rem",
              backgroundColor: "#F8F8F8!important"
            }
            // Some CSS
            
          },
          
        },
        defaultProps:{
          
        }
      },
    },
  });


const UOCs: NextPage = () => {
  const { query, isReady } = useRouter();
  var router = useRouter();
  const [entitiesState, setEntitiesState] = React.useState<Array<any>>([]);
  const [entitySelected, setEntitySelected] = React.useState<any>(null);
  const [UOCResumeState, setUOCResumeState] = React.useState<UOCResume|null>(null);
  const [UOCContactPointState, setUOCContactPointState] = React.useState<Array<UOCContactPoint>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingContactPoint, setIsLoadingContactPoint] = React.useState(false);
  const [isLoadingResume, setIsLoadingResume] = React.useState(false);
  const [isLoadingUOCRequests, setIsLoadingUOCRequests] = React.useState(false);
  const [noUOCS, setNoUOCS] = React.useState(false);
  React.useEffect( ()  => {
    if(isReady){
      
      if(query?.id){
        getUOCResume(query.id.toString());
        getUOCContactPoint(query.id.toString());
        getUOCRequests({page:1});
      }
    }
  }, [isReady,query]);
  React.useEffect( ()  => {
    if(isReady){
      getUOCs();
    }
  }, [isReady]);
  async function getUOCs(){
    setIsLoading(true);
    try{
      let data:any =await fetchData("getProcuringEntitiesRequests",{},"POST",false); 
      setEntitiesState(data);

      if(query?.id){
        let entity=data.filter(
          (entity:any)=>{
            return entity?.id==query?.id;
          }
        )[0];
        setEntitySelected(entity?entity:null);

      }else{
        if(data.length>0){
          router.push(`${'/uocs/'}?id=${encodeURIComponent(data?.[0]?.id)}`); 
          let entity=data.filter(
            (entity:any)=>{
              return entity?.id==data?.[0]?.id;
            }
          )[0];
          setEntitySelected(entity?entity:null);
        }else{
          setNoUOCS(true);
        }
        
      }
      
    }
    catch(e){
      console.dir(e)
    }finally{
      setIsLoading(false);

    }
  }

  async function getUOCResume(id:string|null|undefined){
    if(!id){
      return;
    }
    setIsLoadingResume(true);
    try{
      let data:UOCResume|null =await fetchData("getUOCTasksInfo",{entity:id},"POST",false); 
      setUOCResumeState(data);
    }
    catch(e){
      console.dir(e)
    }finally{
      setIsLoadingResume(false);
    }
  }

  async function getUOCContactPoint(id:string|null|undefined){
    if(!id){
      return;
    }
    setIsLoadingContactPoint(true);
    try{
      let data:UOCContactPointResponse|null =await fetchData("getUOCContactPoint",{entity:id},"POST",false); 
      if(data?.data){
        setUOCContactPointState(data?.data);
      }else{
        setUOCContactPointState([]);
      }
      
    }
    catch(e){
      console.dir(e)
      setUOCContactPointState([]);
    }finally{
      setIsLoadingContactPoint(false);

    }
  }
  const [UOCRequests, setUOCRequests] = React.useState([]);
  const [UOCRequestsPaginationState, setUOCRequestsPaginationState]: any =
  React.useState({
    actualPage: 1,
    pageSize: 5,
    totalResults: 0,
    totalPages: 0,
    pages: [],
  });
const [UOCRequestsFieldsState, setUOCRequestsFieldsState]: any = React.useState(
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
  function UOCRequestsGetField(field: string, fields: Array<any>) {
    return fields.filter((e) => {
      return e.field === field;
    })[0];
  }
  function UOCRequestsGetFieldState(field: string) {
    return UOCRequestsFieldsState.filter((e: any) => {
      return e.field === field;
    })[0];
  }
  function UOCRequestsApplyFilter(
    field: string,
    value?: any,
    defineValue?: any
  ) {
    let fieldObject = UOCRequestsGetFieldState(field);
    
    let parameters: any = {
      page: 1,
    };

    if (defineValue) {
      fieldObject.value = "";
    }
    parameters[field] = validate(value) ? value : fieldObject.value;

    //router.push(`${pageRoute}${getFiltersString(parameters)}`);
    getUOCRequests(parameters);
  }

  async function getUOCRequests(params: any) {
    if (!query?.id) {
     
      return;
    }
    let filters: any = {
      ...params,
      ...{entity:query?.id}
    };
    setIsLoadingUOCRequests(true);
    try {
      const data = await fetchData("getUOCRequests",{
        ...filters,
      },"POST",false);
      if (!data.error) {
        if (data?.data?.length) {
          setUOCRequests(data?.data);
          let Pagination = {
            ...UOCRequestsPaginationState,
            ["totalResults"]: getNumber(data.total),
            ["totalPages"]: Math.ceil(
              getNumber(data.total) / UOCRequestsPaginationState.pageSize
            ),
            ["pages"]: pagination(
              getNumber(query.page) ? getNumber(query.page) : 1,
              Math.ceil(getNumber(data.total) /UOCRequestsPaginationState.pageSize)
            ),
          };
          setUOCRequestsPaginationState({ ...Pagination });
        } else {
          setUOCRequests([]);
          setUOCRequestsPaginationState({
            actualPage: 1,
            pageSize: 5,
            totalResults: 0,
            totalPages: 0,
            pages: [],
          });
        }
   
      } else {
        setUOCRequests([]);
        setUOCRequestsPaginationState({
          actualPage: 1,
          pageSize: 5,
          totalResults: 0,
          totalPages: 0,
          pages: [],
        });
      }
      
    } catch (error) {
      console.dir(error);
      setUOCRequests([]);
      setUOCRequestsPaginationState({
        actualPage: 1,
        pageSize: 5,
        totalResults: 0,
        totalPages: 0,
        pages: [],
      });
    } finally {
      setIsLoadingUOCRequests(false);
    }
  }


  return (
    <>
    
    <Head>
        <title>VigiA - UOCs</title>
        <meta name="description" content="UOCs" />
        <link rel="icon" href="/favicon.ico" />
         
        </Head>
    <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 200px)'}}} className={styles.BackgroundPreColor}>
      <Container sx={{paddingTop:{xs:"3rem"},paddingBottom:{xs:"3rem"}}}>
      <Typography variant="inherit" component="h1"  className={styles.StartActionTitle + " "+ styles.ColorTextPrimaryA}>
      Dashboard Solicitudes Gestionadas por UOC
        </Typography>
     
      <Typography variant="inherit" component="h2" className={styles.StartActionSubTitle+ " "+ styles.ColorTextGray} sx={{marginBottom:"1rem"}}>
      Selecciona una UOC para ver información detallada
        </Typography>
        <Box sx={{marginBottom:"1rem",maxWidth:{xs:"100%",sm:"600px"}}}>
        
        <Autocomplete
        
        id="size-small-filled-multi"
        size="small"
        options={entitiesState}
        getOptionLabel={(option:any) => option.name}

        value={entitySelected}
        isOptionEqualToValue={(option:any, value:any) => option.id === value?.id}
        onChange={(event: any, newValue) => {
          setEntitySelected(newValue);
            if(newValue){
              router.push(`${'/uocs/'}?id=${encodeURIComponent(newValue?.id)}`);  
              
            }
           
          
        }}
        renderInput={(params) => (
          <ThemeProvider theme={PersonalizedText}>
              <TextField
            {...params}
            variant="filled"
            label="UOC"
            placeholder=""
            className={styles.InputText}
          />
        </ThemeProvider>
        
        )}
      />
        </Box>
          { noUOCS&&<Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={styles.ElementContainer } sx={{height:"100%"}}>
                    <Grid container>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <img src="/images/tiempo.svg" className={styles.ImageItemUOC}/>
                        </Grid>
                        <Grid item xs={12} sm={10} md={10} lg={10} xl={10} sx={{
                            marginBottom:"0.5rem",
                            display:"flex",
                            alignItems:"center"
                        }}>
                        <Typography variant="inherit" component="h2"  className={styles.ItemTitleElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        No hay ninguna UOC gestionando procesos todavía.
                        </Typography>
                        
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            </Grid>}
        {(!noUOCS)&&<Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                <Box className={styles.ElementContainer } sx={{height:"100%"}}>
                    <Grid container>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <img src="/images/tiempo.svg" className={styles.ImageItemUOC}/>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                        <Typography variant="inherit" component="h2"  className={styles.ItemTitleElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        Tiempo Promedio de Resolución de Solicitudes
                        </Typography>
                        <Typography variant="inherit" component="h2" >
                          {
                             getNumber(UOCResumeState?.horas_promedio)==0?<span  className={styles.ItemTitleTimeUnit+" "+styles.ColorText}>Sin Datos</span>:(
                              <>
                               <span  className={styles.ItemTitleTime+" "+styles.ColorText}>{
                          getNumber(UOCResumeState?.horas_promedio).toFixed(2)
                        }</span>
                        <span  className={styles.ItemTitleTimeUnit+" "+styles.ColorTextPrimaryA}>horas</span>
                              </>

                             )
                          }
                       
                        </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>
            <Box className={styles.ElementContainer} sx={{height:"100%"}}>
            <Grid container>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <img src="/images/contacto.svg" className={styles.ImageItemUOC}/>
                        </Grid>
                        <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                        <Typography variant="inherit" component="h2"  className={styles.ItemTitleElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        Datos de contacto de la UOC
                        </Typography>
                        <Typography variant="inherit" component="p"  className={styles.ItemDescriptionElement+" "+styles.ColorTextGray} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        {UOCContactPointState.map((data)=>{
                          return data.contact_point_name;
                        }).join(', ')}
                        </Typography>
                        <Typography variant="inherit" component="p"  className={styles.ItemDescriptionElement+" "+styles.ColorText} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        {UOCContactPointState.map((data)=>{
                          return data.contact_point_email;
                        }).join(', ')}
                        </Typography>
                        <Typography variant="inherit" component="p"  className={styles.ItemDescriptionElement+" "+styles.ColorTextGray} sx={{
                            marginBottom:"0.5rem"
                        }}>
                            {UOCContactPointState.map((data)=>{
                          return data.contact_point_telephone;
                        }).join(', ')}
                        </Typography>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            
                            </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
            </Box>
            </Grid>


            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Box className={styles.ElementContainer} sx={{height:"100%"}}>
                    <Grid container>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                            <img src="/images/reclamos_resueltos_uoc.svg" className={styles.ImageItemUOC}/>
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                        <Typography variant="inherit" component="h2" >
                        <span  className={styles.ItemTitleTime+" "+styles.ColorText}><CountUp
                      start={0}
                      end={getNumber(UOCResumeState?.reclamos_resueltos)}
                      duration={1}
                      separator=","
                    /></span>
                        </Typography>
                        <Typography variant="inherit" component="h2"  className={styles.ItemDescriptionElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        Reclamos resueltos
                        </Typography>
                        
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Box className={styles.ElementContainer} sx={{height:"100%"}}>
                    <Grid container>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                            <img src="/images/consultas_uoc.svg" className={styles.ImageItemUOC}/>
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                        <Typography variant="inherit" component="h2" >
                        <span  className={styles.ItemTitleTime+" "+styles.ColorText}>
                        <CountUp
                      start={0}
                      end={getNumber(UOCResumeState?.consultas_aclaradas)}
                      duration={1}
                      separator=","
                    />
                        </span>
                        </Typography>
                        <Typography variant="inherit" component="h2"  className={styles.ItemDescriptionElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        Consultas aclaradas
                        </Typography>
                        
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Box className={styles.ElementContainer} sx={{height:"100%"}}>
                    <Grid container>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                            <img src="/images/en_proceso_uoc.svg" className={styles.ImageItemUOC}/>
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                        <Typography variant="inherit" component="h2" >
                        <span  className={styles.ItemTitleTime+" "+styles.ColorText}>
                        <CountUp
                      start={0}
                      end={getNumber(UOCResumeState?.en_proceso)}
                      duration={1}
                      separator=","
                    />
                        </span>
                        </Typography>
                        <Typography variant="inherit" component="h2"  className={styles.ItemDescriptionElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem"
                        }}>
                        Solicitudes en Revisión
                        </Typography>
                        
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={styles.ElementContainer} sx={{height:"100%"}}>
                <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="inherit" component="h6"  className={styles.ItemTitleElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem",
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center"
                        }}>
                        <span  className={styles.ColorText}> 
                        {entitySelected?.name}
                        </span>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7} xl={7} sx={{
                            marginBottom:"0.5rem",
                            display:"flex",
                            alignItems:"center"
                        }}>
                        <Typography variant="inherit" component="div"  className={styles.ItemTitleElement+" "+styles.ColorTextPrimaryA} sx={{
                            marginBottom:"0.5rem",
                            display:"flex",
                            alignItems:"center"
                        }}>
                        Solicitudes por &nbsp;<span  className={styles.ColorText}> 
                        UOC
                        </span>
                        </Typography>
                        
                        </Grid>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                        
                        <ThemeProvider theme={PersonalizedTextSearch} >
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
                              let fields = [...UOCRequestsFieldsState];
                              UOCRequestsGetField("search", fields).value =
                                e.target.value;
                       
                              setUOCRequestsFieldsState(fields);
                            }}
                            value={UOCRequestsGetFieldState("search").value}
                            onKeyUp={(e: any) => {
                              if (e.key === "Enter") {
                                UOCRequestsApplyFilter("search");
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
                          <th>Identificador</th>
                          <th>Solicitud</th>
                          <th>Creación</th>
                          <th>Llamado</th>
                          <th>Estado del Reclamo </th>
                          <th>Encargado</th>
                          {/*
                                <th>Encargado</th>
                                <th>Asignado</th>*/}
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingUOCRequests ? (
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
                        ) : !UOCRequests.length && !isLoadingUOCRequests ? (
                          <tr>
                            <td data-label="" colSpan={6}>
                              <b>No se encontraron resultados</b>
                            </td>
                          </tr>
                        ) : (
                          UOCRequests.map((data: any, index: number) => {
                            return (
                              <tr key={index}>
                                {/*<td data-label="Tipo de Reclamo">Consulta</td>*/}
                                <td
                                  data-label="Identificador"
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
                                <td
                                  data-label="Solicitud"
                                >
                                  {data.tipo}
                                </td>
                                <td data-label="Creación">
                                  {getDateFormat(data.fecha_creacion)}
                                </td>
                                <td data-label="Llamado">
                                  <Link
                                    href={
                                      `/identifiedProcess?id=${encodeURIComponent(data.llamado)}&state=${data.tipo=='RECLAMO'?"claim":"question"}`
                                    }
                                  >
                                    <a className={styles.LinkedText}>
                                      {data.llamado}
                                    </a>
                                  </Link>
                                </td>
                                <td data-label="Estado del Reclamo">
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
                                      `${data.tipo=="RECLAMO"?"/claims/claim?id=":"/questions/question?id="}${encodeURIComponent(data.enlace)}`
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
                                      Visualizar
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
                        {UOCRequestsPaginationState.actualPage > 1 && (
                          <span
                            onClick={() => {
                              UOCRequestsApplyFilter(
                                "page",
                                UOCRequestsPaginationState.actualPage - 1
                              );
                            }}
                          >
                            <div className={styles.PaginationBefore}>
                              <NavigateBeforeIcon></NavigateBeforeIcon>
                            </div>
                          </span>
                        )}
                        {UOCRequestsPaginationState.pages.map(
                          (page: any, index: number) => {
                            return page == "..." ? (
                              <span
                                key={index}
                                onClick={() => {
                                  UOCRequestsApplyFilter(
                                    "page",
                                    UOCRequestsPaginationState.pages[index - 1] +
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
                                  UOCRequestsApplyFilter("page", page);
                                }}
                              >
                                <div
                                  className={
                                    styles.PaginationNumber +
                                    " " +
                                    (page ==
                                    UOCRequestsPaginationState.actualPage
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

                        {UOCRequestsPaginationState.actualPage <
                          UOCRequestsPaginationState.totalPages && (
                          <span
                            onClick={() => {
                              UOCRequestsApplyFilter(
                                "page",
                                UOCRequestsPaginationState.actualPage + 1
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


        </Grid>}
        
   
  
      

    
</Container>
    
    </Box>
    </Layout>
    
    </>
  )
}

export default UOCs
