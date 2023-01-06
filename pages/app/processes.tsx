import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../../styles/Login.module.scss';
import Layout from '../../components/ui/Layout/Layout';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import SortIcon from '@mui/icons-material/Sort';
import { PersonalizedTextSearchWhite } from '../../components/ui/DesignElements';



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
import { SkeletonSearch } from '../../components/ui/Skeleton';
import fetchData from '../../src/utils/fetch';
const Processes: NextPage = () => {
  const pageRoute:string="/app/processes";

  var Pagination:any ={
    actualPage:1,
    pageSize:6,
    totalResults:0,
    totalPages:0,
    pages:[]
  };

  const [typeProcessState, setTypeProcessState] = React.useState("favorites");


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
      name:'Tipo',
      field:'type',
      value:'',
      search:"",
      type:'explicit'
    }, {    
      name:'Busqueda',
      field:'search',
      value:'',
      search:"",
      type:'explicit'
    },
  ]
  const [fieldsState, setfieldsState ] =React.useState(fields);
  
  React.useEffect( ()  => {
    if(isReady){

      Pagination={
        ...Pagination,
        ['actualPage']:(getNumber(query.page)?getNumber(query.page):1)
      };
      assignValues(query);
      getSearchProcess(getString(query.type));
      

    }
  
}, [isReady,query]);
async function getSearchProcess(type:string){
  setTypeProcessState(type?type:'favorites');
  setIsLoading(true);
  setNoResults(false);
  let user:any={
    
  }
  try {
    user=await Auth.currentAuthenticatedUser();
  } catch (err) {
    setMessage("Debes iniciar sesión");
    setOpenMessage(true);
    setIsLoading(false);
    setNoResults(false);
  }
  try{
    let filters=getFilters();
    let data:any = {};
    switch(type){
      case 'awards':
        data = await fetchData("getMyProcesses",{
          ...{"type":"awards","user":(user?.attributes?.sub)},
          ...filters
         },"POST",true);
         break;
        break;
        case 'tenders':
          data = await fetchData("getMyProcesses",{
            ...{"type":"tenders","user":(user?.attributes?.sub)},
            ...filters
           },"POST",true);
          break;
      default:
        data = await fetchData("getMyLikes",{
          ...{},
          ...filters
         },"POST",true);
         break;
    }
    
 

    if(data.records.length){
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
    }else{
      setMessage("No se encontraron resultados");
    setOpenMessage(true);
    setResultsState([]);
    setNoResults(true);
    setPaginationState({
      actualPage:1,
      pageSize:6,
      totalResults:0,
      totalPages:0,
      pages:[]
    })
    }
    
  }
  catch(e){
    setMessage("No se encontraron resultados");
    setOpenMessage(true);
    setResultsState([]);
    setNoResults(true);
    setPaginationState({
      actualPage:1,
      pageSize:6,
      totalResults:0,
      totalPages:0,
      pages:[]
    })
  }finally{
    setIsLoading(false);
  }
}
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
  return (
    <>
    
    <Head>
        <title>VigiA - Mis Procesos</title>
        <meta name="description" content="Mis Procesos" />
        <link rel="icon" href="/favicon.ico" />
         
        </Head>
    <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 200px)'}}} className={styles.BackgroundPreColor}>
      <Container sx={{paddingTop:{xs:"3rem"},paddingBottom:{xs:"3rem"}}}>
      <Typography variant="inherit" component="h1"  className={styles.StartActionTitle + " "+ styles.ColorText} sx={{marginBottom:"1rem"}}>
      Estos son los procesos que te interesan
        </Typography>
     
      

        <Box sx={{marginBottom:"1rem",textAlign:"center",display:"flex",justifyContent:"center"}}>
          <Box className={styles.ProcessSelectionContainer}>
            <Box className={styles.ProcessSelectionOption+ " "+(typeProcessState==='tenders'?styles.Active:null)}
            onClick={(e)=>{
              setTypeProcessState('tenders');
              applyFilter('type','tenders');
            }}
            > Postulaciones</Box>
            <Box className={styles.ProcessSelectionOption + " "+(typeProcessState==='awards'?styles.Active:null)}
            onClick={(e)=>{
              setTypeProcessState('awards');
              applyFilter('type','awards');
            }}
            > Adjudicaciones</Box>
            <Box className={styles.ProcessSelectionOption+ " "+(typeProcessState==='favorites'?styles.Active:null)}
            onClick={(e)=>{
              setTypeProcessState('favorites');
              applyFilter('type','favorites');
            }}
            > Favoritos</Box>
          </Box>
        </Box>
        <Box sx={{marginBottom:"1rem"}}>
        <Grid container>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <ThemeProvider theme={PersonalizedTextSearchWhite} >
                        <TextField
                        sx={{marginBottom:"0.5rem"}}
                        label="Buscar descripción..."
                        name="search"
                        type="text"
                        variant="filled"
                        fullWidth
                        className={ styles.WhiteInputText+" "+styles.InputTextFilterSearch }
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                          getField('search').value=e.target.value;
                         
                          setfieldsState(fields);
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
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{display:"flex",alignItems:"center",justifyContent:"end"}}>
                      
                        
                           {/*
                           <Box className={styles.ResultAction} >
                        <Typography variant="inherit" component="p" className={styles.ResultActionText+ " "+ styles.ColorTextGray} sx={{marginBottom:"0"}}>
                        Distribución
                        <ViewQuiltIcon className={styles.ResultActionIcon}>
                        </ViewQuiltIcon> 
                        </Typography>
                           </Box>
                           <Box  className={styles.ResultAction}>
                        <Typography variant="inherit" component="p" className={styles.ResultActionText+ " "+ styles.ColorTextGray} sx={{marginBottom:"0"}}>
                        Ordenar
                        <SortIcon className={styles.ResultActionIcon}>
                        </SortIcon> 
                        </Typography>
                           </Box>
                           */
                           }
                        </Grid>
                    </Grid>
        </Box>
     
        <Box sx={{margin:"0 auto",marginTop:"1rem"}}>
        {(!isLoading)&&<Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                      
        <Box sx={{marginBottom:"1rem"}}>
        <Typography variant="inherit" component="p" className={styles.TitleContainerData+ " "+ styles.ColorTextGray} sx={{marginBottom:"0"}}>
        Procesos en total: {
          PaginationState.totalResults
        }
        </Typography>
            </Box>
        </Grid>
        }
        {isLoading&&SkeletonSearch(6)}
        <Grid container spacing={2} sx={{justifyContent:"stretch"}}>
        
        {
        
        (!isLoading)&&resultsState.map((processData,index)=> (
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} key={index} sx={{display:"flex"}}>
            <Box className={styles.SearchContainerResult} sx={{justifyContent:"stretch"}}>
            <Grid container>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Typography variant="inherit" sx={{cursor:"pointer"}} component="p" className={styles.ProcessPropertyText+" "+styles.ResultProcessTitle} >
            <span>Llamado: </span>
            <Link href={`/identifiedProcess?id=${encodeURIComponent(getProcessPlanningId(processData)) }`} >
              <a><span className={styles.ColorText+" "+styles.ProcessID}>{getProcessPlanningId(processData)}</span></a>
             
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

          </Grid>
            



           
            
          ))
        }
        </Grid>
      {
          noResults&&<>
          <Box className={styles.SearchContainerResult} sx={{marginTop:"1rem"}} >
           <Grid container>
           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {
              (typeProcessState=='favorites')&&<>
              <Typography variant="inherit"  component="p"  className={styles.TitleContainerData+ " "+ styles.ColorTextGray} >
            <b> No haz dado like a ningún proceso todavía.</b> <br />
           </Typography>
           </>
            }
            {
              (typeProcessState=='awards')&&<>
              <Typography variant="inherit"  component="p"  className={styles.TitleContainerData+ " "+ styles.ColorTextGray} >
            <b> No te haz adjudicado con algún llamado.</b> <br />
           </Typography>
              </>
            }
            {
              (typeProcessState=='tenders')&&<>
              <Typography variant="inherit"  component="p"  className={styles.TitleContainerData+ " "+ styles.ColorTextGray} >
            <b> No estas participando en algún proceso actualmente.</b> <br />
           </Typography>
              </>
            }
           
           </Grid>
           </Grid>
         </Box>
          </>
        }
     
        
      </Box>
      {((!isLoading)&&(!noResults))&&<Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                      
        <Box sx={{marginBottom:"1rem"}}>
        <Typography variant="inherit" component="p" className={styles.TitleContainerData+ " "+ styles.ColorTextGray} sx={{marginBottom:"0"}}>
        Mostrando página {PaginationState.actualPage} de un total de {PaginationState.totalPages} página{PaginationState.totalPages==1?'':'s'}
        </Typography>
            </Box>
        </Grid>
        }
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

export default Processes
