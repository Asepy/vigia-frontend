import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Login.module.scss';
import Layout from '../components/ui/Layout/Layout';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

import InputAdornment from '@mui/material/InputAdornment';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { useRouter } from 'next/router';




import {pagination,validate,validateString,getString,getNumber,getDateFormat,likeText} from  '../components/imports/Functions';
import {mainProcurementCategoryDetails} from  '../components/imports/StaticData';
import { ResetTvOutlined } from '@mui/icons-material';

import { getProcessTitle, getProcessAmount, getProcessCurrency,
  getTenderPeriodEndDate,getEnquiryPeriodEndDate,getProcurementMethodDetails,
  getBuyer,getProcuringEntity,getProcessPlanningId,getMainProcurementCategoryDetails } from '../components/imports/ProcessFunctions';

  import Snackbar from '@mui/material/Snackbar';
  import CloseIcon from '@mui/icons-material/Close';
  import Skeleton from '@mui/material/Skeleton';
  import fetchData from '../src/utils/fetch';



const PersonalizedFilterSearch = createTheme({
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
const PersonalizedTextSearchWhite = createTheme({
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
            backgroundColor: "#FFFFFF!important"
          }
          // Some CSS
          
        },
        
      },
      defaultProps:{
        
      }
    },
  },
});
const Search: NextPage = () => {
  const { query, isReady } = useRouter();
  var router = useRouter();
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [noResults, setNoResults] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [resultsState, setResultsState] = React.useState([]);
  const [entitiesState, setEntitiesState] = React.useState([]);

  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState('');

  const pageRoute:string="/search";

  var Pagination:any ={
    actualPage:1,
    pageSize:5,
    totalResults:0,
    totalPages:0,
    pages:[]
  };
  const [PaginationState, setPaginationState ]:any = React.useState(Pagination);

  var fields=[
    
    {    
      name:'Busqueda',
      field:'search',
      value:'',
      search:"",
      type:'explicit'
    },
    {    
      name:'Categoría de Compra',
      field:'category',
      value:'',
      type:'select',
      search:"",
      options:[
        ...mainProcurementCategoryDetails
          
    ]
    },
    {    
      name:'Contratante',
      field:'entity',
      value:'',
      type:'select',
      search:"",
      options:[
      ]
    },
    {    
      name:'Tipo de Procedemiento',
      field:'method',
      value:'',
      type:'select',
      search:"",
      options:[
        {
            "name": "Selección sobre la base la comparación de las calificaciones",
            "value": "Selección sobre la base la comparación de las calificaciones"
        },
        {
            "name": "Acuerdo Internacional",
            "value": "Acuerdo Internacional"
        },
        {
            "name": "Acuerdo Nacional",
            "value": "Acuerdo Nacional"
        },
        {
            "name": "Contratación Directa",
            "value": "Contratación Directa"
        },
        {
            "name": "Contratación por Excepción",
            "value": "Contratación por Excepción"
        },
        {
            "name": "Concurso de Ofertas",
            "value": "Concurso de Ofertas"
        },
        {
            "name": "Contrataciones Entre Entidades del Estado",
            "value": "Contrataciones Entre Entidades del Estado"
        },
        {
            "name": "Contrataciones Excluidas",
            "value": "Contrataciones Excluidas"
        },
        {
            "name": "Locación de Inmuebles",
            "value": "Locación de Inmuebles"
        },
        {
            "name": "LICITACIÓN DE CONCURSO DE OFERTA SISTEMA NACIONAL BID BIENES NO COMUNES",
            "value": "LICITACIÓN DE CONCURSO DE OFERTA SISTEMA NACIONAL BID BIENES NO COMUNES"
        },
        {
            "name": "Licitación Pública Internacional",
            "value": "Licitación Pública Internacional"
        },
        {
            "name": "Licitación Pública Nacional",
            "value": "Licitación Pública Nacional"
        },
        {
            "name": "Proceso de Capacitación",
            "value": "Proceso de Capacitación"
        },
        {
            "name": "Selección basada en la calidad",
            "value": "Selección basada en la calidad"
        },
        {
            "name": "Selección basada en la calidad y el costo SBMC - Selección basada en el menor costo",
            "value": "Selección basada en la calidad y el costo SBMC - Selección basada en el menor costo"
        },
        {
            "name": "Selección cuando el presupuesto es fijo",
            "value": "Selección cuando el presupuesto es fijo"
        },
        {
            "name": "Selección basada en las calificaciones de los consultores",
            "value": "Selección basada en las calificaciones de los consultores"
        },
        {
            "name": "Selección con base en una sola fuente",
            "value": "Selección con base en una sola fuente"
        }
    ]
    }
];
  const [fieldsState, setfieldsState ] =React.useState(fields);
  
  React.useEffect( ()  => {
    if(isReady){
      

    Pagination={
      ...Pagination,
      ['actualPage']:getNumber(query.page)?getNumber(query.page):1
    };
    assignValues(query);  
    
    getSearchProcess();
    }
  
  
  
  
 
}, [isReady,query]);

React.useEffect( ()  => {
  
  getProcuringEntities();
}, []);
function getField(field:string){
  return fields.filter((e)=>{return (e.field===field);})[0];
}

function getFieldTemporal(field:string,fieldsT:any){
  return fieldsT.filter((e:any)=>{return (e.field===field);})[0];
}
function getFieldState(field:string){
  return fieldsState.filter((e)=>{return (e.field===field);})[0];
}
function applyFilter(field:string,value?:any,defineValue?:any){
  let fieldObject=getFieldState(field);

let parameters:any={
    page:1
};

if(defineValue){
    fieldObject.value='';
}
parameters[field]=(validate(value)?value:fieldObject.value);

router.push(`${pageRoute}${getFiltersString(parameters)}`);  
}

function assignValues(parameters:any){
  for (const property in parameters) {
      let field=getField(property);
      if(validate(field)&&validateString(parameters[property])){
          getField(property).value=parameters[property];
          //field['value']=parameters[property];
      }
  }
  setfieldsState(fields);
}
function getFilters(parameters?:any){
    
  let filters:any={};
  filters['page']=Pagination.actualPage;
  fields.forEach((field:any)=>{
    if(validateString(query[field.field])){
        filters[field.field]=query[field.field];
    }
  });
  if(parameters){
    //FILTROS=Object.assign(FILTROS, PARAMETROS);
    for (const property in parameters) {
          filters[property]=parameters[property];
      }
  }
  for (const property in filters) {
      if(!validateString(filters[property])){
          delete filters[property];
      }
  }
  return filters;
}
function getFiltersString(parameters:any){
  
  let filters:any=getFilters(parameters);

  let filterString=Object.keys(filters).map((key)=>{
    return `${key}=${encodeURIComponent(filters[key])}`
  }).join('&');
  return filterString?`?${filterString}`:'';
}
  function getFieldOptions(field:any){
    switch(field.field){
      case 'entity':
        return entitiesState;
      default:
        return field.options;
    }
  }
  async function getProcuringEntities(){

    try{
      let data:any =await fetchData("getProcuringEntities",{},"POST",false); 
 
      let entities=(data?.list.map((entity:any,index:number)=>{
        return {
          name:entity.name,
          value:entity.name
        }
      }).sort((a:any,b:any)=> {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} )
      );
      setEntitiesState(entities);
    }
    catch(e){

    }finally{

    }
  }
  async function getSearchProcess(){

    setIsLoading(true);
    setNoResults(false);

    try{
      let filters=getFilters();
      let data = await fetchData("searchProcessDNCP",{
        ...filters
       },"POST",true);
   
      setResultsState(data.records.map((result:any)=>{
        return result;
      }));
      Pagination={...Pagination,['totalResults']:getNumber(data?.pagination?.total_items),
      ['totalPages']:(
        Math.ceil(getNumber(data?.pagination?.total_items)/PaginationState.pageSize)
      ),
      ['pages']:pagination((getNumber(query.page)?getNumber(query.page):1), Math.ceil(getNumber(data?.pagination?.total_items)/PaginationState.pageSize))
      }
      setPaginationState({...Pagination})
    }
    catch(e){
      setMessage("No se encontraron resultados");
      setOpenMessage(true);
      setResultsState([]);
      setNoResults(true);
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <>
    
    <Head>
        <title>VigiA - Buscador</title>
        <meta name="description" content="Iniciar Sesión" />
        <link rel="icon" href="/favicon.ico" />
         
    </Head>
    <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 200px)'}}} className={styles.BackgroundPreColor}>
      <Container sx={{paddingTop:{xs:"3rem"},paddingBottom:{xs:"3rem"}}}>
      <Typography variant="inherit" component="h1"  className={styles.StartActionTitle + " "+ styles.ColorTextGray}>
      Buscador de procesos de contratación

     
        </Typography>
     
      <Typography variant="inherit" component="h2" className={styles.StartActionSubTitle+ " "+ styles.ColorTextGray} sx={{marginBottom:"1rem"}}>
      Usa este buscador para encontrar procesos en los que quieras participar o realizar un reporte
        </Typography>
        <Box sx={{marginBottom:"1rem"}}>
        <Grid container>
                        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                        <ThemeProvider theme={PersonalizedTextSearchWhite} >
                        <TextField
                        sx={{marginBottom:"0.5rem"}}
                        label="Buscar título..."
                        name="search"
                        type="text"
                        variant="filled"
                        fullWidth
                        className={ styles.WhiteInputText+" "+styles.InputTextFilterSearch }
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                          let fieldsTemporal=[...fieldsState];
                          getFieldTemporal('search',fieldsTemporal).value=e.target.value;
                       
                          setfieldsState(fieldsTemporal);
                        }}
                        value={getFieldState('search').value}
                        onKeyUp={(e:any)=>{
                          if (e.key === 'Enter') {
                            applyFilter('search');
                          }
                        }}
                        InputProps={{
                            disableUnderline: false,
                            endAdornment: <InputAdornment position="end">
                            <IconButton
                            onClick={(e:any)=>{
                              applyFilter('search');
                             }}
                            aria-label="toggle password visibility"
                            edge="end"
                            className={styles.SearchButtonText}
                            >
                            <SearchIcon className={styles.SearchIconText} />
                            </IconButton>
                            
                        </InputAdornment>
                        }}
                        >
                        </TextField>
          </ThemeProvider>
                        
                        </Grid>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                       
                        
                        </Grid>
                    </Grid>
        </Box>
        <Box sx={{}}>
        <Box className={styles.FiltersContainerMenu +" "+(showFilters?styles.ShowFiltersContainerMenu:null) }>
        <Typography variant="inherit" component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle+" "+styles.ColorTextGray} sx={{marginBottom:"0.5rem"}}>
         Criterios de Búsqueda <ClearIcon className={styles.FiltersCloseIcon} onClick={
              (e)=>{
                setShowFilters(false);
              }
            }></ClearIcon>
        </Typography>
        <Box className={styles.FiltersContainer}>
        {
            fieldsState.filter((field)=>{
              return field.type!="explicit";
            }).map((field:any,index:number)=>{
              return <Box className={styles.SearchContainerFilter} key={index} >
              <Box sx={{paddingLeft:"1rem",paddingTop:"1rem",paddingRight:"1rem"}}>
              <Typography variant="inherit" component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle+" "+styles.ColorText} sx={{marginBottom:"0.5rem"}}>
                 <span>{field.name}</span>
              </Typography>
              <ThemeProvider theme={PersonalizedFilterSearch} >
                  <TextField
                    sx={{marginBottom:"0.5rem"}}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                      //fields=[...fieldsState];
                      getFieldState(field.field).search=e.target.value;
                      setfieldsState([...fieldsState]);
                    }}
                    value={getFieldState(field.field).search}
                    label="Buscar..."
                    name="search"
                    type="text"
                    variant="filled"
                    fullWidth
                    className={ styles.GrayInputText+" "+styles.InputTextFilterSearch }
                    InputProps={{
                      disableUnderline: false,
                      endAdornment: <InputAdornment position="end">
                      <SearchIcon className={styles.SearchIconText} />
                      
                    </InputAdornment>
                    }}
                  >
                  </TextField>
                </ThemeProvider>
              
              </Box>
              <Box className={styles.FilterOptionsContainerSearch}>
              {getFieldOptions(field).filter((option:any)=>{
                  return getFieldState(field.field).search.trim()?likeText(option.name,getFieldState(field.field).search):true;
                 }).map((option:any,index:any)=> (
                  <Box className={styles.FilterOptionSearch +" "+((getFieldState(field.field).value===option.value)?styles.FilterOptionSearchSelected:null)} key={index} onClick={
                    (e)=>{
                      if(isLoading){
                        return;
                      }
                      fields=[...fieldsState];
                      if(getFieldState(field.field).value==option.value){
                        getField(field.field).value="";
                      }
                      else{
                        getField(field.field).value=option.value;
                      }
                      setfieldsState(fields);
                      applyFilter(field.field,getField(field.field).value);
                     
                    }
                  }>
                  {option.name}
                  </Box>
              ))}
                
              </Box>
              </Box>
            })
          }
     

       



      



        </Box>
        </Box><Box  className={styles.ResultsContainerMenu}>
        <Grid container>
          <Grid item xs={8} sm={9} md={9} lg={9} xl={9}>
          <Typography variant="inherit" component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle+" "+styles.ColorTextGray} sx={{marginBottom:"0.5rem"}}>
          Resultados de Búsqueda
          </Typography>
          </Grid>
          <Grid item xs={4} sm={3} md={3} lg={3} xl={3} sx={{display:"flex",alignItems:"center",justifyContent:"end"}}>
          <Box  className={styles.ResultAction+" "+styles.ResultActionFilterButton} >
                        <Typography variant="inherit" onClick={(e)=>{
                        if(showFilters){
                          setShowFilters(false);
                        }else{
                          setShowFilters(true);
                        }
                        }} component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle+" "+styles.ColorTextGray} sx={{marginBottom:"0"}}>
                        Filtrar
                        
                        <FilterAltIcon className={styles.ResultActionIcon}>
                        </FilterAltIcon> 
                        </Typography>
                           </Box>
          </Grid>
        </Grid>
        {
          noResults&&<>
          <Box className={styles.SearchContainerResult} >
           <Grid container>
           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
           <Typography variant="inherit"  component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle} >
            No se encontraron resultados
           </Typography>
           </Grid>
           </Grid>
         </Box>
          </>
        }
      {isLoading&&[1,1,1,1,1].map((d,index:number)=>{
        return <Box className={styles.SearchContainerResult} key={index}>
           <Grid container>
           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
           <Typography variant="inherit" sx={{cursor:"pointer"}} component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle} >
           <Skeleton variant="text" sx={{ fontSize: '1.5rem' ,width:'40%',display:"inline-block",marginRight:"10px"}} />
           </Typography>
           </Grid>
           <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{textAlign:"right"}}>
           <Typography variant="h6" component="h6" className={styles.ItemsContainerTextAmountTotal+" "+styles.ResultProcessAmount} >
           <Skeleton variant="text" sx={{ fontSize: '1.5rem' ,width:'40%',display:"inline-block",marginRight:"10px"}} />
            </Typography>
           </Grid>
           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
           <Typography variant="inherit" component="p" className={styles.ProcessEntity+" "+styles.MiniProcessEntity} >
           <span>
        <span>
        <Skeleton variant="text" sx={{ fontSize:  '16px' ,width:'40%',display:"inline-block",marginRight:"10px"}} />
          </span>
          {
            <span>
            <span className={styles.LineDivisor} ></span>
            <span>
            <Skeleton variant="text" sx={{ fontSize:  '16px' ,width:'40%',display:"inline-block",marginRight:"10px"}} />
            </span>
            </span>
          }
        
        

        </span>
           </Typography>
           </Grid>
           {
           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
           <Typography variant="inherit" component="p" className={styles.ProcessEntity+" "+styles.ResultProcessDescription} >
          <b><Skeleton variant="text" sx={{ fontSize:  '16px' ,width:'90%',display:"inline-block",marginRight:"10px"}} /></b> 
          <b><Skeleton variant="text" sx={{ fontSize:  '16px' ,width:'70%',display:"inline-block",marginRight:"10px"}} /></b> 
           </Typography>
           </Grid>
          }
           
           <Grid item xs={2} sm={2} md={1} lg={1} xl={1} sx={{}}>
             <img src="/images/icons/proceso/fecha_consultas.svg" alt=""  className={styles.ImageProcessProperty+" "+styles.ResultProcessImage}/>
           </Grid>
           <Grid item xs={4} sm={4} md={5} lg={5} xl={5} sx={{alignItems:"center",display:"flex",width:"100%"}}>
             <Typography variant="inherit" component="p" className={styles.ProcessPropertyText +" "+styles.MiniProcessText} sx={{paddingLeft:"0.2rem",width:"100%"}}>
             <span><Skeleton variant="text" sx={{ fontSize:  '16px' ,width:'70%',display:"inline-block",marginRight:"10px"}} /></span>
             </Typography>
           </Grid>
     
     
           <Grid item xs={2} sm={2} md={1} lg={1} xl={1} sx={{}}>
             <img src="/images/icons/proceso/fecha_ofertas.svg" alt=""  className={styles.ImageProcessProperty+" "+styles.ResultProcessImage}/>
           </Grid>
           <Grid item xs={4} sm={4} md={5} lg={5} xl={5} sx={{alignItems:"center",display:"flex",width:"100%"}}>
             <Typography variant="inherit" component="p" className={styles.ProcessPropertyText +" "+styles.MiniProcessText} sx={{paddingLeft:"0.2rem",width:"100%"}}>
             <span>
              <Skeleton variant="text" sx={{ fontSize: '16px' ,width:'70%',display:"inline-block",marginRight:"10px"}} />
              </span>
             </Typography>
           </Grid>
   
   
           <Grid item xs={2} sm={2} md={1} lg={1} xl={1} sx={{}}>
             <img src="/images/icons/proceso/llamado.svg" alt=""  className={styles.ImageProcessProperty+" "+styles.ResultProcessImage}/>
           </Grid>
           <Grid item xs={10} sm={10} md={11} lg={11} xl={11} sx={{alignItems:"center",display:"flex",width:"100%"}}>
             <Typography variant="inherit" component="p" className={styles.ProcessPropertyText +" "+styles.MiniProcessText} sx={{paddingLeft:"0.2rem",width:"100%"}}>
             <Skeleton variant="text" sx={{ fontSize:  '16px' ,width:'70%',display:"inline-block",marginRight:"10px"}} />
             </Typography>
           </Grid>
           </Grid>
         </Box>
        
      })}
      {(!isLoading)&&resultsState.map((processData:any,index)=> (
           
           <Box className={styles.SearchContainerResult} key={index}>
           <Grid container>
           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
           <Typography variant="inherit" sx={{cursor:"pointer"}} component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle} >
           <span>Llamado: </span>
           <Link href={`/identifiedProcess?id=${encodeURIComponent(getProcessPlanningId(processData)) }`} >
            <a>
            <span className={styles.ColorText+" "+styles.ProcessID}>{getProcessPlanningId(processData)}</span>
            </a>
            
          </Link>
           </Typography>
           </Grid>
           <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{textAlign:"right"}}>
           <Typography variant="h6" component="h6" className={styles.ItemsContainerTextAmountTotal+" "+styles.ResultProcessAmount} >
           {getProcessAmount(processData)?getProcessAmount(processData):'Monto N/D'} <span className={styles.Currency}>{getProcessCurrency(processData)?getProcessCurrency(processData):''}</span>
               </Typography>
           </Grid>
           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
           <Typography variant="inherit" component="p" className={styles.ProcessEntity+" "+styles.MiniProcessEntity} >
           <span>
        <span>
          {getBuyer(processData)?getBuyer(processData):'Comprador no disponible'}
          </span>
          {
            getProcuringEntity(processData)?<span>
            <span className={styles.LineDivisor}></span>
            <span>
            {getProcuringEntity(processData)}
            </span>
            </span>:null
          }
        
        

        </span>
           </Typography>
           </Grid>
           {
           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
           <Typography variant="inherit" component="p" className={styles.ProcessEntity+" "+styles.ResultProcessDescription} >
          <b>Título: {getProcessTitle(processData)}</b> 
           </Typography>
           </Grid>
          }
           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
           <Typography variant="inherit" component="p" className={styles.ProcessEntity+" "+styles.ResultProcessDescription} >
          {getMainProcurementCategoryDetails(processData)}
           </Typography>
           </Grid>
           <Grid item xs={2} sm={2} md={1} lg={1} xl={1} sx={{}}>
             <img src="/images/icons/proceso/fecha_consultas.svg" alt=""  className={styles.ImageProcessProperty+" "+styles.ResultProcessImage}/>
           </Grid>
           <Grid item xs={4} sm={4} md={5} lg={5} xl={5} sx={{alignItems:"center",display:"flex"}}>
             <Typography variant="inherit" component="p" className={styles.ProcessPropertyText +" "+styles.MiniProcessText} sx={{paddingLeft:"0.2rem"}}>
             <span>{
            getEnquiryPeriodEndDate(processData)?<span>
            Consultas { <span><b>{getDateFormat(getEnquiryPeriodEndDate(processData))}</b></span>}    Max.
            </span>:'Fecha máxima de consultas no disponible'
          }</span>
             </Typography>
           </Grid>
     
     
           <Grid item xs={2} sm={2} md={1} lg={1} xl={1} sx={{}}>
             <img src="/images/icons/proceso/fecha_ofertas.svg" alt=""  className={styles.ImageProcessProperty+" "+styles.ResultProcessImage}/>
           </Grid>
           <Grid item xs={4} sm={4} md={5} lg={5} xl={5} sx={{alignItems:"center",display:"flex"}}>
             <Typography variant="inherit" component="p" className={styles.ProcessPropertyText +" "+styles.MiniProcessText} sx={{paddingLeft:"0.2rem"}}>
             <span>{
           getTenderPeriodEndDate(processData)?<span>
            Ofertas  { <span><b>{getDateFormat(getTenderPeriodEndDate(processData))}</b></span>}    Max.
            </span>:'Fecha máxima de ofertas no disponible'
          }</span>
             </Typography>
           </Grid>
   
   
           <Grid item xs={2} sm={2} md={1} lg={1} xl={1} sx={{}}>
             <img src="/images/icons/proceso/llamado.svg" alt=""  className={styles.ImageProcessProperty+" "+styles.ResultProcessImage}/>
           </Grid>
           <Grid item xs={10} sm={10} md={11} lg={11} xl={11} sx={{alignItems:"center",display:"flex"}}>
             <Typography variant="inherit" component="p" className={styles.ProcessPropertyText +" "+styles.MiniProcessText} sx={{paddingLeft:"0.2rem"}}>
             
             <span> {getProcurementMethodDetails(processData)?getProcurementMethodDetails(processData):'No disponible por el momento'}</span>
              {/*<span><b>LPN</b>    </span> <span>Licitación Pública Nacional</span>*/}
             </Typography>
           </Grid>
           </Grid>
         </Box>
        
        ))}
        
        <Box>
          {
            (!isLoading)&&(resultsState.length>0)&&<Box className={styles.Pagination} sx={{textAlign:"center",marginTop:"1rem"}}>
              
                {(PaginationState.actualPage>1)&&<Link href={pageRoute+getFiltersString({page:(PaginationState.actualPage - 1)})}>
                  <div className={styles.PaginationBefore}>
                    <NavigateBeforeIcon></NavigateBeforeIcon>
                </div>
                </Link>}
                {
                  PaginationState.pages.map((page:any,index:number)=>{

                    return page=='...'?<Link key={index} href={pageRoute+getFiltersString({page:(PaginationState.pages[index-1] + 1)})}>
                    <div key={index}  className={styles.PaginationNumber}>
                    {page}
                    </div>
                    </Link>:<Link key={index} href={pageRoute+getFiltersString({page:(page)})}>
                    <div  className={styles.PaginationNumber+" "+(page==PaginationState.actualPage?styles.Active:"")}>
                    {page}
                    </div>
                    </Link>;

                  })
                }
                
                {(PaginationState.actualPage<PaginationState.totalPages)&&<Link href={pageRoute+getFiltersString({page:(PaginationState.actualPage + 1)})}>
                  <div className={styles.PaginationNext} >
                    <NavigateNextIcon></NavigateNextIcon>
                </div>
                </Link>}
            </Box>
            }
        </Box>
      </Box>
        </Box>
        
      
  
      

    
</Container>
    
    </Box>
    <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:"center" }}
        open={openMessage}
        autoHideDuration={6000}
        onClose={(event: React.SyntheticEvent | Event, reason?: string) => {
          if (reason === 'clickaway') {
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
            onClick={(event: React.SyntheticEvent | Event, reason?: string) => {
              if (reason === 'clickaway') {
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
  )
}

export default Search
