import { useRouter } from 'next/router';

import * as React from 'react';
import {useEffect} from 'react'
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
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

import { Auth } from "aws-amplify";
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { format }  from 'date-fns';
import {pagination,validate,validateString,getString,getNumber} from  '../../components/imports/Functions';
import useQuery from  '../../components/imports/useQuery';
import  {ThemeProvider,createTheme,PersonalizedTextSearchWhite,PersonalizedText,PersonalizedTextDatePicker,PersonalizedSelect,FiltersMenu} from '../../components/ui/DesignElements';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import { Groups, TwelveMpTwoTone } from '@mui/icons-material';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CalendarPicker,esES} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/es-mx';
import esLocale from 'date-fns/locale/es';
import { group } from 'console';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import fetchData from '../../src/utils/fetch';
import { useAlertContext } from "../../src/contexts/alert-context";
import { useDialogContext } from "../../src/contexts/dialog-context";
const AppPosts: NextPage = () => {
  const pageRoute:string="/app/posts";
  const { query, isReady } = useRouter();
  const { setAlertMessage } = useAlertContext();
  var router = useRouter();
  const [defaultText, setDefaultText] = React.useState('');
  const [defaultDate, setDefaultDate] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);
  const [Posts, setPosts ] =React.useState([]);

  const [SelectedGroup, setSelectedGroup] = React.useState("creationDate");
  const [SelectedField, setSelectedField] = React.useState("");

  const { setDialog } = useDialogContext();

  /*Filtros*/
  const [anchorElFilters, setAnchorElFilters] = React.useState<null | HTMLElement>(null);
  const handleOpenFiltersMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFilters(event.currentTarget);
  };
  const handleCloseFiltersMenu = () => {
    setAnchorElFilters(null);
  };

  /*modal*/
  const [openModalFilters, setOpenModalFilters] = React.useState(false);
  const handleOpenModalFilters = () => {setDefaultDate(format(new Date(), "yyyy-MM-dd"));setDefaultText("");setOpenModalFilters(true)};
  const handleCloseModalFilters = () => {setOpenModalFilters(false)};


  var Pagination:any ={
    actualPage:1,
    pageSize:5,
    totalResults:0,
    totalPages:0,
    pages:[]
  };

  function getGroup(id:string){
    return fieldsGroups.filter((group)=>{ return group.id===id;})[0];
  }
  function getGroupOptions(id:string){
    return [...getGroup(id)['options']];
  }
  function getGroupOption(id:string,value:string){
    return getGroupOptions(id).filter((option)=>{return option.value==value})[0];
  }
  var fieldsGroups:Array<any>=[
    {
    name:'Fecha de Creación',
    
    id:'creationDate',
    group:[
      'creationDateE',
      
      'creationDateGT',
      'creationDateGTE',
      
      'creationDateLT',
      'creationDateLTE',
    ],
    type:'date'
  },

  
  {
    name:'Identificador',
    id:'id',
    group:[
      'idE',
      'idL'
    ],
    type:'text'
  },
  {
    name:'Correo',
    id:'email',
    group:[
      'emailL'
    ],
    type:'text'
  },
  
  /*{
    name:'Estado de la consulta',
    id:'taskStatus',
    group:[
      'taskStatusE'

    ],
    type:'select',
    options:[
      {value:'ENVIADO',name:	'Enviado a ASEPY'},
      {value:'REVISION'	,name:'En revisión de ASEPY'},
      {value:'COMUNICACION'	,name:'Comunicación con UOC'},
      {value:'PROTESTA'	,name:'Protesta'},
      {value:'DEVUELTO'	,name:'Devuelta'},
      {value:'RESUELTO'	,name:'Resuelto'}
    ]
  },*/
  {
    name: "Estado de la solicitud",
    id: "taskStatus",
    group: ["taskStatusL"],
    type: "text",
  },
]
  var fields=[
 


    {    
    name:'Igual a',
    field:'creationDateE',
    value:'',
    group:'creationDate'
    },
  {    
    name:'Mayor o igual a',
    field:'creationDateGTE',
    value:'',
    group:'creationDate'
    },
    {    
      name:'Mayor a',
      field:'creationDateGT',
      value:'',
      group:'creationDate'
      },
    {    
      name:'Menor o igual a',
      field:'creationDateLTE',
      value:'',
      group:'creationDate'
      },
      {    
        name:'Menor a',
        field:'creationDateLT',
        value:'',
        group:'creationDate'
        },
    {    
      name:'Igual a',
      field:'idE',
      value:'',
      group:'id',

    },
    {    
      name:'Contiene a',
      field:'idL',
      value:'',
      group:'id',

    },
    {    
      name:'Contiene a',
      field:'emailL',
      value:'',
      group:'email',

    },
    {    
      name:'Busqueda',
      field:'search',
      value:'',
      type:'explicit'
    },
    {    
      name:'Igual a',
      field:'stageE',
      value:'',
      
      group:'stage',
    },
    {    
      name:'Igual a',
      field:'taskStatusE',
      value:'',
      group:'taskStatus'
    },
    {
      name: "Contiene a",
      field: "taskStatusL",
      value: "",
      group: "taskStatus",
    },
];

const [fieldsState, setfieldsState ] =React.useState(fields);
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
          field['value']=parameters[property];
      }
  }
  setfieldsState(fields);
}

  var [PaginationState, setPaginationState ]:any =React.useState({
    actualPage:1,
    pageSize:5,
    totalResults:0,
    totalPages:0,
    pages:[]
  });
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
  function getObjectProperty(obj:any,name:string){
    return obj[name];
  }


  function getStage(obj:any){
    switch(obj?.etapa){
      case 'tender':
        return 'Llamado';
      case 'planning':
        return 'Planificación';
      case 'contract':
        return 'contrato'
      case 'award':
        return 'Adjudicación';
      default:
        return 'Llamado';

    }
  }

  function getStatus(obj:any){
    switch(obj?.estado){
      case '1':
        return 'Pendiente';
      case '2':
        return 'Resuelto';
      default:
        return 'Pendiente';

    }

    
  }
  function getDateFormat(text:string){
    if(text){
      return format(new Date(text), "dd/MM/yyyy");
    }else{
      return '';
    }
    
  }
 
    React.useEffect( ()  => {
      if(isReady){
        
   

   Pagination={
    ...Pagination,
    ['actualPage']:getNumber(query.page)?getNumber(query.page):1
  };
  assignValues(query);

     getPosts();
      }
    
    
    
    
   
  }, [isReady,query]);

  async function getPosts(){
    let user:any={
  
    }
    try {
      user=await Auth.currentAuthenticatedUser();
     
    } catch (err) {
    }
   
    if(isLoading){
      return
    }
    if(!(user?.username)){
      setAlertMessage("Vuelve a iniciar sesion");
      return;
      
  
    }
    
    setIsLoading(true);

    let filters=getFilters();
    filters['user']=user?.username;
    try {

    const data = await fetchData("getUsersTweets",{
      ...filters
     },"POST",true);
    if((!data.error) ){
      if(data?.data?.length){
        setPosts(data?.data)
      }else{
        setPosts([])
      }
     
  

    Pagination={...Pagination,['totalResults']:getNumber(data.total),
      ['totalPages']:(
        Math.ceil(getNumber(data.total)/PaginationState.pageSize)
      ),
      ['pages']:pagination((getNumber(query.page)?getNumber(query.page):1), Math.ceil(getNumber(data.total)/PaginationState.pageSize))
    }
    setPaginationState({...Pagination})
    

    }else{
      setAlertMessage("No hay tweets");
    }
    } catch (error) {
      setAlertMessage("Aun no hay tweets");
      console.dir(error)
    } finally {
     setIsLoading(false);
    }
  }



  async function deleteTweet(tweet_id:string){
    let user:any={
  
    }
    try {
      user=await Auth.currentAuthenticatedUser();
     
    } catch (err) {
    }
   
    if(isLoadingDelete){
      return
    }
    if(!(user?.username)){
      setAlertMessage("Vuelve a iniciar sesion");
      return;
      
  
    }
    
    setIsLoadingDelete(true);


    try {

    const data = await fetchData("deleteTweet",{
      tweet_id:tweet_id
     },"POST",true);


    if((!data.error) ){
      
  
      setAlertMessage({message:"Tweet eliminado correctamente",severity:"success"});
      applyFilter("page",PaginationState.actualPage);
    }else{
      setAlertMessage("No se pudo eliminar el tweet");
    }
    } catch (error) {
      setAlertMessage("No se pudo eliminar el tweet");
      console.dir(error)
    } finally {
     setIsLoadingDelete(false);
    }
  }
  return (
    <>
    
    <Head>
        <title>VigiA - Posteos</title>
        <meta name="description" content="Posteos" />
        <link rel="icon" href="/favicon.ico" />
         
        </Head>
    <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 200px)'}}} className={styles.BackgroundPreColor}>
    <Modal
        open={openModalFilters}
        onClose={handleCloseModalFilters}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backdropFilter: "blur(2px)", 
        backgroundColor: "rgb(255, 255,255, 0.2)" }}
        className="animate fadeIn"
      >
        
        <Box  className={styles.ModalStyle}>
          <Box className={styles.CloseModalButton} onClick={handleCloseModalFilters}>
          <CloseIcon className={styles.IconCloseModalButton}/>
          </Box>
           
      
          <Typography id="modal-modal-title" variant="h6" component="h2" className={styles.TitleProcess}>
          Filtrar por {getGroup(SelectedGroup).name}
          </Typography>
          <Grid container >

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{}} >
            {/*
              <Box className={styles.InputTitle}>¿En qué punto del proceso encontraste el problema?  <span className={styles.ColorDanger}>*</span>  </Box>
          */
            }
          
                 <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="type"
      >
        {
          getGroup(SelectedGroup).group.map((fieldField:any,index:number)=>{
            
            let field=getField(fieldField);
            return <FormControlLabel key={index} value={field.field}  control={<Radio  name ={field.field} checked={SelectedField === field.field} onChange={(e)=>{
              setSelectedField(e.target.value);
            }} sx={{
              /* color: "#8A49FF!important",*/
               '&.Mui-checked': {
                 color: "#8A49FF!important",
               },
             }} />} label={field.name}  className={styles.RadioText}/>

          })
        }

      </RadioGroup>
         {/*<Box className={styles.InputTitle}> {getGroup(SelectedGroup).name}  </Box> */} 
          {
            getGroup(SelectedGroup).type==="text"&&<ThemeProvider theme={PersonalizedText}>
            <TextField
              label="Ingresa un termino"
              name="text"
              type= "text"
              variant="filled"
              value={defaultText}
              onChange={(e)=>{
                setDefaultText(e.target.value)
              }}
              fullWidth
              className={styles.InputText +" "+"InputTest"}
            />
          </ThemeProvider>
          }
          {
            getGroup(SelectedGroup).type==="date"&&<LocalizationProvider dateAdapter={AdapterDayjs}  localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
            <DatePicker
              label="Ingresa una fecha"
              value={defaultDate}
              inputFormat="YYYY-MM-DD"
              className={styles.InputText }
              
              onChange={(newValue:any) => {
          
                setDefaultDate(newValue?.$d?format(newValue.$d, "yyyy-MM-dd"):"");
              }}
              renderInput={(params) => <ThemeProvider theme={PersonalizedTextDatePicker}><TextField fullWidth variant="filled" {...params} /> </ThemeProvider>}
            /> 
           
          </LocalizationProvider>
          }
          {
            getGroup(SelectedGroup).type==="select"&&<>
          <ThemeProvider theme={PersonalizedSelect}>
            <TextField
              label="Selecciona"
              name="text"
              type= "text"
              variant="filled"
              fullWidth
              select
              value={defaultText}
              onChange={(e)=>{
                setDefaultText(e.target.value)
                
              }}
              className={styles.InputText}
            >
              {
            getGroupOptions(SelectedGroup).map(
              (option,index)=>{
              return <MenuItem key={index} value={option.value}>{option.name}</MenuItem>
              }
            )
            }
            </TextField>
          </ThemeProvider>
         
            </>
  

          }
        

{/*adapterLocale={esLocale} <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={esLocale} localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
      <DatePicker
        label="Basic example"
        value={hola}
       
        className={styles.InputText +" "+"InputTest"}
        onChange={(newValue) => {
         console.dir(newValue)
        }}
        renderInput={(params) => <ThemeProvider theme={PersonalizedTextDatePicker}><TextField  variant="filled" {...params} /> </ThemeProvider>}
      /> 
     
    </LocalizationProvider> */}
      
      
      


      
          </Grid>
          
      
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{}} >
          <Typography id="modal-modal-description" sx={{ mt: 2 }} className={styles.ImageLikeDescription}>
          Recuerda que puedes agregar multiples filtros.
          </Typography>
          </Grid>

          <Grid item xs={12}>
          <Box sx={{textAlign:"right",mb:"2rem"}}>
            <Button title="Aplicar Filtro" 
          variant="contained" disableElevation 
          className={styles.ButtonPrincipal} onClick={(e)=>{ 
            getField(SelectedField).value=((getGroup(SelectedGroup).type==="date")?defaultDate.toString():defaultText);
            setfieldsState(fields);
            applyFilter(SelectedField,getField(SelectedField).value);
            handleCloseModalFilters()}}> 
          Aplicar</Button>
            </Box>
         
          </Grid>
          </Grid>
          
        </Box>
      </Modal>
      <Container sx={{paddingTop:{xs:"3rem"},paddingBottom:{xs:"3rem"}}}>
      <Typography variant="inherit" component="h1"  className={styles.StartActionTitle + " "+ styles.ColorTextPrimaryA}>
      Publicaciones realizadas

        </Typography>
     
     
        <Box sx={{marginBottom:"1rem"}}>
        <Grid container>
                        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                        <ThemeProvider theme={PersonalizedTextSearchWhite} >
                        <TextField
                        sx={{marginBottom:"0.5rem"}}
                        label="Buscar..."
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
                            <IconButton onClick={(e:any)=>{
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
        <Box sx={{marginBottom:"1rem"}}>
          <>
          {
            fieldsState.filter((field)=>{
              return field.type!="explicit"&&validateString(field.value);
            }).map((field:any,index:number)=>{
              return <Box className={styles.FilterTableBox} key={index}>
            <b>{getGroup(field.group).name}</b> {field.name} <b>{ getGroup(field.group).type=="select"?getGroupOption(field.group,field.value).name:field.value} </b> <ClearIcon className={styles.FilterTableIcon} onClick={
              (e)=>{
                getField(field.field).value="";
                setfieldsState(fields);
                applyFilter(field.field,"");
              }
            }></ClearIcon>
              
          </Box>
            })
          }
          </>
          
    
          <Box className={styles.FilterTableBox +' '+styles.AddFilters} sx={{cursor:"pointer"}} onClick={handleOpenFiltersMenu}>
            <b>Filtros</b>  <AddIcon className={styles.FilterTableIcon}></AddIcon>
              
          </Box>
        </Box>
        <ThemeProvider theme={FiltersMenu}>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElFilters}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElFilters)}
              onClose={handleCloseFiltersMenu}
              sx={{
                display: { xs: 'block' },
              }}
            >
              {fieldsGroups.map((group)=> (
                        
                        <MenuItem key={group.id} onClick={(e)=>{
                          
                          handleOpenModalFilters();
                          setSelectedGroup(group.id);
                          setSelectedField(getGroup(group.id).group[0]);
                          handleCloseFiltersMenu();
                          }}>
                        <Typography textAlign="center" className={styles.ItemMenuFilters}>{group.name}</Typography>
                        </MenuItem>
                        
                    ))}
            </Menu>
            </ThemeProvider>
        <Grid container spacing={2}>
        

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={styles.ElementContainer} sx={{height:"100%"}}>
              
                    <table className={styles.tableData+" "+styles.tableCenter}>
                        <thead>
                            <tr>
                                {/*<th>Tipo de Reclamo</th>*/}
                                <th>Solicitud</th>
                                <th>Tipo</th>
                                <th>Llamado</th>

                                <th>Fecha de Posteo</th>
                                
                                <th>Usuario </th>
                                <th>Correo </th>
                                <th>Estado del Tweet </th>
                                <th>Estado de la Solicitud</th>
                                {/*
                                <th>Encargado</th>
                                <th>Asignado</th>*/
                                }
                            </tr>
                        </thead>
                        <tbody>{
                          isLoading?
                          <tr>
                            <td colSpan={8}>
                            <Box sx={{alignItems:"center",display:"flex",justifyContent:"center",textAlign:"center"}}>
                              <CircularProgress /> 
                              <div>&nbsp;Cargando..</div> 
                              </Box>
                            </td>
                          </tr>:((!Posts.length)&&(!isLoading)?<tr>
                          <td data-label="" colSpan={6}><b>No se encontraron resultados</b></td>
                          </tr>:Posts.map(
                              (Post:any,index:number)=>{
                                return <React.Fragment key={index}>
                                
                                <tr  title={Post.enlace}>
                                  
                                <td data-label="Solicitud" >
                                <Typography
                                title={Post.enlace}
                                variant="inherit"
                                component="div"
                                sx={{
                                  
                                  overflowX: "clip",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {Post.enlace}
                              </Typography></td>
                              <td data-label="Tipo">{Post.tipo_solicitud}</td>
                                
                                <td data-label="Llamado">
                                  <Link  href={"/identifiedProcess?id="+encodeURIComponent( Post.llamado)+"&state=claim"}>
                                  <a className={styles.LinkedText}>{Post.llamado}</a>
                                  </Link>
                                </td>
                                <td data-label="Fecha de Posteo">{getDateFormat(Post.fecha_creacion)}</td>
                                <td data-label="Usuario">{Post.nombre_usuario}</td>
                                <td data-label="Correo"><Typography
                                title={Post.correo_usuario}
                                variant="inherit"
                                component="div"
                                sx={{
                                  
                                  overflowX: "clip",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {Post.correo_usuario}
                              </Typography></td>
                                <td data-label="Estado de Tweet">{Post.estado_tweet}</td>
                                <td data-label="Estado de la Solicitud">{Post.tarea_descripcion}</td>
                              
                              
                              </tr>
                                <tr >
                                <td  colSpan={8}>
                                <Box className={styles.PublicationBox}>
                                    <Typography variant="inherit" component="p" className={styles.ItemsContainerText} >
                                   {Post.tweet}
                                </Typography>
                                    </Box>
                                    <Box sx={{textAlign: {
                                                xs:"right!important",
                                                sm:"right!important"
                                            },mb:1, display:"flex",justifyContent:"right"}} className={styles.MultipleButtons}>
                                            


                                           
                                            <Button title="Reclamar" 
                                                variant="contained" disableElevation 
                                                className={styles.ButtonPrincipal+" "+styles.ButtonMini}
                                                onClick={()=>{
                                                  if(Post.estado_tweet=="ELIMINADO"){
                                                    setAlertMessage({message:"Este Tweet, ya ha sido borrado",severity:"info"})
                                                  }else{
                                                    setDialog({title:"Eliminar Tweet",body:"¿Esta seguro que desea eliminar este tweet?",doTrue:()=>()=>{
                                                      deleteTweet(Post.id_tweet);
                                                    
                                                    
                                                    }});
                                                
                                                  }
                                                  }}
                                                > 
                                                Eliminar</Button>
                                            
                                            
                                            
                                                </Box>
                                </td>
                            </tr>
                                </React.Fragment>
                              
                              }
                            ))

                          }
                          
                          
                        </tbody>
                    </table>
                    <Box>
                        <Box className={styles.Pagination} sx={{textAlign:"center",marginTop:"1rem"}}>
                         
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
                    </Box>
                </Box>
            </Grid>


        </Grid>
        
   
  
      

    
</Container>
    
    </Box>
    </Layout>
    
    </>
  )
}

export default AppPosts
