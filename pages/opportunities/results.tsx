import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../../styles/Login.module.scss';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from '../../components/ui/Layout/Layout';
import Typography from '@mui/material/Typography';


import { Auth } from "aws-amplify";

import { useRouter } from 'next/router';
import { getProcessTitle, getProcessAmount, getProcessCurrency,
  getTenderPeriodEndDate,getEnquiryPeriodEndDate,getProcurementMethodDetails,
  getBuyer,getProcuringEntity,getProcessPlanningId,getMainProcurementCategoryDetails } from '../../components/imports/ProcessFunctions';

  import NavigateNextIcon from '@mui/icons-material/NavigateNext';
  import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
  import {pagination,validate,validateString,getString,getNumber,getDateFormat,likeText} from  '../../components/imports/Functions';
  import Snackbar from '@mui/material/Snackbar';
  import CloseIcon from '@mui/icons-material/Close';
  import Skeleton from '@mui/material/Skeleton';
  import IconButton from '@mui/material/IconButton';
import fetchData from '../../src/utils/fetch';
import { useAlertContext } from "../../src/contexts/alert-context";
const  OpportunitiesResults: NextPage = () => {
  const { setAlertMessage } = useAlertContext();
  const pageRoute:string="/opportunities/results";

  var Pagination:any ={
    actualPage:1,
    pageSize:5,
    totalResults:0,
    totalPages:0,
    pages:[]
  };
  const [PaginationState, setPaginationState ]:any = React.useState(Pagination);

  const [resultsState, setResultsState] = React.useState([]);
  const { query, isReady } = useRouter();
  var router = useRouter();
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [noResults, setNoResults] = React.useState(false);
  const [filtersState, setFiltersState] = React.useState({});

  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState('');

  var fields:Array<any>=[
    {    
      name:'Criterios',
      field:'data',
      value:'',
      search:"",
      type:'explicit'
    }
  ]
  const [fieldsState, setfieldsState ] =React.useState(fields);
  React.useEffect( ()  => {
    if(isReady){
      Pagination={
        ...Pagination,
        ['actualPage']:(getNumber(query.page)?getNumber(query.page):1)
      };
      assignValues(query); 
      getOpportunitiesConfig();

    }
  
}, [isReady,query]);


function getField(field:string){
  return fields.filter((e)=>{return (e.field===field);})[0];
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
async function getOpportunitiesConfig(){
  
  setIsLoading(true);
  setNoResults(false);
  let user:any={
    
  }
  try {
    user=await Auth.currentAuthenticatedUser();

  } catch (err) {
  }


  if(user?.attributes?.sub){
    try{
      let data:any = await fetchData("getOpportunitiesConfig",{},"POST",true);
      if(data.palabras_clave){
        let config={
          ruc :getString( data.ruc),
          experience:getString(data.rango_experiencia),
          formalization:getString(data.rango_formalizacion),
          categories_lvl5:getString(data.categorias_nivel5),
          categories_lvl1:getString(data.categorias_nivel1),
          keywords:getString(data.palabras_clave),
          categories:getString(data.categorias)
        }
        setFiltersState(

          config
        )
        getOpportunities(config);
        
      }else{
        try{
          if(query.data){
            let params=JSON.parse(
              window.atob(
                query.data.toString()
              )
            )
           
            setFiltersState(params)
            getOpportunities(params);
          }else{
            setAlertMessage({message:"Ingresa la configuración para tus oportunidades",severity:"info"})
            router.push("/opportunities");
          }
         
        }catch(e){
    
        }

        
      }
  
    }
    catch(e){
      setIsLoading(false)
    }
  }else{
    try{
      if(query.data){
        let params=JSON.parse(
          window.atob(
            query.data.toString()
          )
        )
    
        setFiltersState(params)
        getOpportunities(params);
      }
     
    }catch(e){

    }
  }


    
}
async function getOpportunities(params:any){
  

    let filters=getFilters();
    try{
      
      let data:any = await fetchData("getOpportunities",{...params,...{page:filters.page}},"POST",false); 
      if(data.total&&data.data){
        setResultsState(data.data)
      }else{
        setMessage("No se encontraron resultados");
        setOpenMessage(true);
        setResultsState([]);
        setNoResults(true);

      }
      Pagination={...Pagination,['totalResults']:getNumber(data.total),
      ['totalPages']:(
        Math.ceil(getNumber(data.total)/PaginationState.pageSize)
      ),
      ['pages']:pagination((getNumber(query.page)?getNumber(query.page):1), Math.ceil(getNumber(data.total)/PaginationState.pageSize))
    }
    setPaginationState({...Pagination})
      
    }
    catch(e){
      setMessage("No se encontraron resultados");
      setOpenMessage(true);
      setResultsState([]);
      setNoResults(true);
    }
    finally{
      setIsLoading(false);
    }
    saveSearchOpportunities({...params,...{page:filters.page}})
  


    
}
async function saveSearchOpportunities(filters:any){
  try{
    let saveData = await fetchData("saveSearchOpportunities",{
      ...filters
      },"POST",true);
    }catch(e){

    }
}
  return (
    <>
    
    <Head>
        <title>VigiA - Resultados de Oportunidades </title>
        <meta name="description" content="Iniciar SesiónResultados de Oportunidades" />
        <link rel="icon" href="/favicon.ico" />
         
        </Head>
        <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 200px)'}}} className={styles.BackgroundSecondaryColor}>
      <Container sx={{paddingTop:{xs:"3rem"},paddingBottom:{xs:"3rem"}}}>
      <Box className={styles.StartActionTitle}>
      
      {
        ((!isLoading)&&(noResults))&&<>
        Lastimosamente no pudimos encontrar algun llamado
        </>
      }
      {
        ((!isLoading)&&(!noResults))&&<>
        ¡Encontramos algunos llamados que encajan contigo!
        </>
      }
      {
        ((isLoading))&&<>
        Buscando las mejores oportunidades para ti
        </>
      }
      
      </Box>
      <Box className={styles.StartActionSubTitle}>
      {
        ((!isLoading)&&(noResults))&&<>
        Basado en las respuestas que diste, pero puedes usar el buscador alternativo &nbsp;
        <Link href="/search"><a>Haz Click Aquí</a></Link> 
        </>
      }
      {
        ((!isLoading)&&(!noResults))&&<>
        Basado en las respuestas que diste, los siguientes llamados pueden interesarte:
        </>
      }
      {
        ((isLoading))&&<>
        Basado en las respuestas que diste
        </>
      }
      
      </Box>
      <Box sx={{margin:"0 auto",marginTop:"1rem",maxWidth:"800px"}}>
      {
          noResults&&<>
          <Box className={styles.SearchContainerResult} >
           <Grid container>
           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
           <Typography variant="inherit"  component="p" className={styles.ProcessPropertyText+" "} >
            <b> No se encontraron nuevas oportunidades para ti, </b> <br />
           recuerda que puedes agregar palabras clave relacionadas a los productos y servicos que ofreces y adicionar multiples categorías
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
        {
        
        (!isLoading)&&resultsState.map((processData,index)=> (
            <Box className={styles.SearchContainerResult} key={index}>
            <Grid container>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Typography variant="inherit" sx={{cursor:"pointer"}} component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle} >
            <span>Llamado: </span>
            <Link href={`/identifiedProcess?id=${encodeURIComponent(getProcessPlanningId(processData)) }&from=opportunity`} >
              <a> <span className={styles.ColorText+" "+styles.ProcessID}>{getProcessPlanningId(processData)}</span></a>
            
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
           <b>{getProcessTitle(processData)}</b> 
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




           
            
          ))
        }
      </Box>

     
     
<Box>
  
          {
            (!isLoading)&&(resultsState.length>0)&&<Box className={styles.Pagination+" "+styles.PaginationInvert} sx={{textAlign:"center",marginTop:"1rem"}}>
              
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


      <Box className={styles.StartActionSubTitle_3} sx={{paddingTop:"1rem"}}>
      Si deseas realizar una búsqueda más específica de los procesos en los que quieres participar &nbsp;
      <Link href="/search"><a>Haz Click Aquí</a></Link> 
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

export default OpportunitiesResults
