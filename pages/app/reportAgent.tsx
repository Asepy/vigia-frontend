import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../../styles/Login.module.scss';
import Layout from '../../components/ui/Layout/Layout';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CircularProgress, Container } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useAlertContext } from "../../src/contexts/alert-context";
import { useRouter } from 'next/router';
import  {ThemeProvider,createTheme,PersonalizedTextSearchWhite,PersonalizedText,PersonalizedTextDatePicker,PersonalizedSelect,FiltersMenu} from '../../components/ui/DesignElements';


import { format }  from 'date-fns';
import {pagination,validate,validateString,getString,getNumber, getDateFormat} from  '../../components/imports/Functions';
import fetchData from '../../src/utils/fetch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CalendarPicker,esES} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getStage } from '../../components/imports/ProcessFunctions';
import CountUp from "react-countup";

import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
const AppReportAgent: NextPage = () => {
  const pageRoute:string="/app/reportAgent";
  const { query, isReady } = useRouter();
  var router = useRouter();
  React.useEffect( ()  => {
    if(isReady){
      Pagination={
        ...Pagination,
        ['actualPage']:getNumber(query.page)?getNumber(query.page):1
      };
      assignValues(query);
      getRequests();
      getCountRequests();
    }
  }, [isReady,query]);
  React.useEffect( ()  => {
    if(isReady){
      getCountRequests();
    }
  }, [isReady]);

  const [defaultText, setDefaultText] = React.useState('');
  const [defaultDate, setDefaultDate] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);

  const [Requests, setRequests ] =React.useState([]);
  const { setAlertMessage } = useAlertContext();

  const [totalResolved, setTotalResolved] = React.useState(0);
  const [totalRequest, setTotalRequests] = React.useState(0);
  const [totalBack, setTotalBack] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  const [SelectedGroup, setSelectedGroup] = React.useState("creationDate");
  const [SelectedField, setSelectedField] = React.useState("");

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
    name:'Fecha de Asignación',
    
    id:'asignationDate',
    group:[
      'asignationDateE',
      
      'asignationDateGT',
      'asignationDateGTE',
      
      'asignationDateLT',
      'asignationDateLTE',
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
    name:'Etapa',
    id:'stage',
    group:[
      'stageE'

    ],
    type:'select',
    options:[{value:'planning',name:'Planificación'},
    {value:'tender',name:'Llamado'},
    {value:'award',name:'Adjudicación'},
    {value:'contract',name:'Contrato'}],
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
    name: "Estado de la consulta",
    id: "taskStatus",
    group: ["taskStatusL"],
    type: "text",
  },
]
  var fields=[
    {    
      name:'Igual a',
      field:'asignationDateE',
      value:'',
      group:'asignationDate'
      },
    {    
      name:'Mayor o igual a',
      field:'asignationDateGTE',
      value:'',
      group:'asignationDate'
      },
      {    
        name:'Mayor a',
        field:'asignationDateGT',
        value:'',
        group:'asignationDate'
        },
      {    
        name:'Menor o igual a',
        field:'asignationDateLTE',
        value:'',
        group:'asignationDate'
        },
        {    
          name:'Menor a',
          field:'asignationDateLT',
          value:'',
          group:'asignationDate'
          },


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

  const handleCloseMessage = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMessage(false);
  };

  
  async function getRequests(){
    
   
    if(isLoading){
      return
    }

    
    setIsLoading(true);

    let filters=getFilters();
    try {

    const data = await fetchData("getRequestsReport",{
      ...filters
     },"POST",true);
    if((!data.error) ){
      if(data?.data?.length){
        setRequests(data?.data)
      }else{
        setRequests([])
      }
     
  

    Pagination={...Pagination,['totalResults']:getNumber(data.total),
      ['totalPages']:(
        Math.ceil(getNumber(data.total)/PaginationState.pageSize)
      ),
      ['pages']:pagination((getNumber(query.page)?getNumber(query.page):1), Math.ceil(getNumber(data.total)/PaginationState.pageSize))
    }
    setPaginationState({...Pagination})
    

    }else{
      setAlertMessage({ message: "No hay solicitudes todavia", severity: "info" });
      setRequests([]);
    }
    } catch (error) {
      setAlertMessage({ message: "Aun no hay solicitudes", severity: "info" });
      setRequests([]);
      console.dir(error)
    } finally {
     setIsLoading(false);
    }
  }
  async function getFullRequests(){
    
    if(isLoadingDownload){
      return;
    }
    setIsLoadingDownload(true);
    let filters=getFilters();
    filters['fullRecords']=true;
    try {

    const data = await fetchData("getRequestsReport",{
      ...filters
     },"POST",true);
    if((!data.error) ){
      if(data?.data?.length){
        
       downdloadXLSX(data?.data);
      }else{
        setAlertMessage({ message: "No hay solicitudes", severity: "info" });
      }
     
    }else{
      setAlertMessage({ message: "No hay solicitudes todavia", severity: "info" });
    }
    } catch (error) {
      setAlertMessage({ message: "Aun no hay solicitudes", severity: "info" });
      console.dir(error)
    } finally {
      setIsLoadingDownload(false)
    }
  }

  async function getCountRequests(){
    


    let filters=getFilters();
    try {

    const data = await fetchData("getCountRequestReport",{
      ...filters
     },"POST",true);
    if((!data.error) ){
      if(data){
        
       setTotal(getNumber(data?.total));
       setTotalRequests(getNumber(data?.pendientes));
       setTotalBack(getNumber(data?.devueltos));
       setTotalResolved(getNumber(data?.resueltos));
      }else{
       setTotal(0);
       setTotalRequests(0);
       setTotalBack(0);
       setTotalResolved(0);
      }
     
    }else{
      setAlertMessage({ message: "No hay solicitudes todavia", severity: "info" });
      setTotal(0);
       setTotalRequests(0);
       setTotalBack(0);
       setTotalResolved(0);
    }
    } catch (error) {
      setAlertMessage({ message: "Aun no hay solicitudes", severity: "info" });
      setTotal(0);
       setTotalRequests(0);
       setTotalBack(0);
       setTotalResolved(0);
      console.dir(error)
    } finally {
    }
  }
  function downdloadXLSX(data:Array<any>){
    const xlsxMimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const workSheet= XLSX.utils.json_to_sheet(data);
    const workBook = { Sheets: {Solicitudes : workSheet}, SheetNames:['Solicitudes']};
    const excelBuffer = XLSX.write(workBook,{bookType:"xlsx", type: "array"});
    const downloadData = new Blob([excelBuffer], {type:xlsxMimeType});
    FileSaver.saveAs(downloadData, `Solicitudes_VigiA.xlsx`)
  }
  return (
    <>
    
    <Head>
        <title>VigiA - Reportes</title>
        <meta name="description" content="Reportes" />
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
      Informe de Gestiones Realizadas
        </Typography>
     
        <Box>
        <Box className={styles.CounterReport}>
        <Typography variant="inherit" component="h2"  className={styles.ReportCounterNumber+" "+styles.ColorTextGreenA}>
        <CountUp
                      start={0}
                      end={totalResolved}
                      duration={1}
                      separator=","
                    />
        </Typography>
        <Typography variant="inherit" component="h2" className={styles.ReportCounterDescription+" "+styles.ColorTextGray}>
        <span  >Resueltos</span>
        </Typography>
          </Box>


          <Box className={styles.CounterReport}>
        <Typography variant="inherit" component="h2"  className={styles.ReportCounterNumber+" "+styles.ColorTextYellowA}>
        <CountUp
                      start={0}
                      end={totalRequest}
                      duration={1}
                      separator=","
                    />
        </Typography>
        <Typography variant="inherit" component="h2" className={styles.ReportCounterDescription+" "+styles.ColorTextGray}>
        <span  >Pendientes</span>
        </Typography>
          </Box>




          <Box className={styles.CounterReport}>
        <Typography variant="inherit" component="h2"  className={styles.ReportCounterNumber+" "+styles.ColorTextPGrayA}>
        <CountUp
                      start={0}
                      end={totalBack}
                      duration={1}
                      separator=","
                    />
        </Typography>
        <Typography variant="inherit" component="h2" className={styles.ReportCounterDescription+" "+styles.ColorTextGray}>
        <span  >Devueltos</span>
        </Typography>
          </Box>





          <Box className={styles.CounterReport}>
        <Typography variant="inherit" component="h2"  className={styles.ReportCounterNumber+" "+styles.ColorText}>
        <CountUp
                      start={0}
                      end={total}
                      duration={1}
                      separator=","
                    />
        </Typography>
        <Typography variant="inherit" component="h2" className={styles.ReportCounterDescription+" "+styles.ColorTextGray}>
        <span  >Total</span>
        </Typography>
          </Box>
        </Box>



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



        <Box sx={{marginBottom:"0.5rem"}}>
        <Grid container>



          <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>



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



          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} sx={{
          
          }}>
          <Box sx={{textAlign: {
        xs:"center",
        sm:"right",
        display:"flex",
        alignContent:"center",
        justifyContent:"right"
      }}} >
        
        <Box sx={{
          display:"inline-block",
          textAlign:"right"
        }}>
          {isLoadingDownload&&<CircularProgress size="38px" />} &nbsp;</Box>
          <Button title="Descargar" 
          variant="contained" disableElevation 
          className={styles.ButtonPrincipal+" "+styles.ButtonContrast_3}
          onClick={getFullRequests}
          > 
         Descargar</Button>
          </Box>
         
          </Grid>
          </Grid>
        
        </Box>





        <Grid container spacing={2}>
        

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={styles.ElementContainer} sx={{height:"100%"}}>
              
                <table className={styles.tableData+" "+styles.tableCenter}>
                        <thead>
                            <tr>
                                {/*<th>Tipo de Reclamo</th>*/}
                                <th>Solicitud</th>
                                <th>Tipo</th>
                                <th>Creación</th>
                                <th>Llamado</th>
                                <th>Etapa del Proceso</th>
                                <th>Estado de la Consulta </th>
                                <th>Encargado</th>
                                {/*
                                <th>Encargado</th>
                                <th>Asignado</th>*/
                                }
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{
                          isLoading?
                          <tr>
                            <td colSpan={6}>
                            <Box sx={{alignItems:"center",display:"flex",justifyContent:"center",textAlign:"center"}}>
                              <CircularProgress /> 
                              <div>&nbsp;Cargando..</div> 
                              </Box>
                            </td>
                          </tr>:((!Requests.length)&&(!isLoading)?<tr>
                          <td data-label="" colSpan={6}><b>No se encontraron resultados</b></td>
                          </tr>:Requests.map(
                              (Request:any,index:number)=>{

                                return <tr key={index}>
                                {/*<td data-label="Tipo de Reclamo">Consulta</td>*/}
                                <td data-label="Solicitud" >
                                <Typography
                                title={Request.enlace}
                                variant="inherit"
                                component="div"
                                sx={{
                                  
                                  overflowX: "clip",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {Request.enlace}
                              </Typography></td>
                              <td data-label="Tipo">{Request.tipo}</td>
                                <td data-label="Creación">{getDateFormat(Request.fecha_creacion)}</td>
                                <td data-label="Llamado">
                                <Link
                                    href={
                                      `/identifiedProcess?id=${encodeURIComponent(Request.llamado)}&state=${Request.tipo=='RECLAMO'?"claim":"question"}`
                                    }
                                  >
                                    <a className={styles.LinkedText}>
                                      {Request.llamado}
                                    </a>
                                  </Link>
                                </td>
                                <td data-label="Etapa del Proceso">{getStage(Request.etapa)}</td>
                                <td data-label="Estado de la Consulta">{Request.tarea_descripcion}</td>
                                <td data-label="Encargado">{Request.tarea_encargado}</td>
                                {/*
                                <td data-label="Encargado">DNCP</td>
                              <td data-label="Asignado">2022-05-15</td>*/
                              }
                                <td data-label="">
                                
                                  <Link
                                    href={
                                      `${Request.tipo=="RECLAMO"?"/app/claimAgent?id=":"/app/questionAgent?id="}${encodeURIComponent(Request.enlace)}`
                                    }
                                  >
                                    <Button
                                      title="Revisar"
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

export default AppReportAgent
