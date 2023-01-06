import { useRouter } from "next/router";

import * as React from "react";
import { useEffect } from "react";
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
import Typography from "@mui/material/Typography";

import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

import { Auth } from "aws-amplify";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import {
  pagination,
  validate,
  validateString,
  getString,
  getNumber,
} from "../../components/imports/Functions";
import useQuery from "../../components/imports/useQuery";
import {
  ThemeProvider,
  createTheme,
  PersonalizedTextSearchWhite,
  PersonalizedText,
  PersonalizedTextDatePicker,
  PersonalizedSelect,
  FiltersMenu,
} from "../../components/ui/DesignElements";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import { Groups } from "@mui/icons-material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarPicker, esES } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/es-mx";
import esLocale from "date-fns/locale/es";
import { group } from "console";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useAlertContext } from "../../src/contexts/alert-context";
import { useDialogContext } from "../../src/contexts/dialog-context";
import fetchData from "../../src/utils/fetch";

import CancelIcon from "@mui/icons-material/Cancel";
import Chip from "@mui/material/Chip";
import {
  
  PersonalizedTextKeywords,
} from "../../components/ui/DesignElements";

interface Rol {
  nombre:string;
  descripcion:string;
}

const AppUsers: NextPage = () => {
  const { setAlertMessage } = useAlertContext();
  const { setDialog } = useDialogContext();
  const pageRoute: string = "/app/users";
  const { query, isReady } = useRouter();
  var router = useRouter();
  const [defaultText, setDefaultText] = React.useState("");
  const [defaultDate, setDefaultDate] = React.useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = React.useState(false);
  
  const [Users, setUsers] = React.useState([]);

  const [SelectedGroup, setSelectedGroup] = React.useState("creationDate");
  const [SelectedField, setSelectedField] = React.useState("");
  const [userRoles, setUserRoles] = React.useState<Array<string>>([]);
  const [userNames, setUserNames] = React.useState<string>("");
  const [userUser, setUserUser] = React.useState<string>("");
  const [userEmail, setUserEmail] = React.useState<string>("");
  const [Roles, setRoles] = React.useState<Array<Rol>>([]);

  /*Filtros*/
  const [anchorElFilters, setAnchorElFilters] =
    React.useState<null | HTMLElement>(null);
  const handleOpenFiltersMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFilters(event.currentTarget);
  };
  const handleCloseFiltersMenu = () => {
    setAnchorElFilters(null);
  };

  /*modal*/
  const [openModalFilters, setOpenModalFilters] = React.useState(false);
  const handleOpenModalFilters = () => {
    setDefaultDate(format(new Date(), "yyyy-MM-dd"));
    setDefaultText("");
    setOpenModalFilters(true);
  };
  const handleCloseModalFilters = () => {
    setOpenModalFilters(false);
  };

  var hola = "";
  var Pagination: any = {
    actualPage: 1,
    pageSize: 5,
    totalResults: 0,
    totalPages: 0,
    pages: [],
  };

  function getGroup(id: string) {
    return fieldsGroups.filter((group) => {
      return group.id === id;
    })[0];
  }
  function getGroupOptions(id: string) {
    return [...getGroup(id)["options"]];
  }
  function getGroupOption(id: string, value: string) {
    return getGroupOptions(id).filter((option) => {
      return option.value == value;
    })[0];
  }
  var fieldsGroups: Array<any> = [
    {
      name: "Fecha de Creación",

      id: "creationDate",
      group: [
        "creationDateE",

        "creationDateGT",
        "creationDateGTE",

        "creationDateLT",
        "creationDateLTE",
      ],
      type: "date",
    },
    
 
    {
      name: "Correo del Usuario",
      id: "mail",
      group: ["mailL"],
      type: "text",
    },
    {
      name: "Roles del Usuario",
      id: "roles",
      group: ["rolesL"],
      type: "text",
    },
    {
      name: "Confirmación de la Cuenta",
      id: "confirmation",
      group: ["confirmationL"],
      type: "text",
    }
  ];
  var fields = [
    
    {
      name: "Igual a",
      field: "creationDateE",
      value: "",
      group: "creationDate",
    },
    {
      name: "Mayor o igual a",
      field: "creationDateGTE",
      value: "",
      group: "creationDate",
    },
    {
      name: "Mayor a",
      field: "creationDateGT",
      value: "",
      group: "creationDate",
    },
    {
      name: "Menor o igual a",
      field: "creationDateLTE",
      value: "",
      group: "creationDate",
    },
    {
      name: "Menor a",
      field: "creationDateLT",
      value: "",
      group: "creationDate",
    },
 
    {
      name: "Busqueda",
      field: "search",
      value: "",
      type: "explicit",
    },
    
    {
      name: "Contiene a",
      field: "mailL",
      value: "",
      group: "mail",
    },
    {
      name: "Contiene a",
      field: "rolesL",
      value: "",
      group: "roles",
    },
    {
      name: "Contiene a",
      field: "confirmationL",
      value: "",
      group: "confirmation",
    },
  ];

  const [fieldsState, setfieldsState] = React.useState(fields);
  function getField(field: string) {
    return fields.filter((e) => {
      return e.field === field;
    })[0];
  }
  function getFieldState(field: string) {
    return fieldsState.filter((e) => {
      return e.field === field;
    })[0];
  }
  function applyFilter(field: string, value?: any, defineValue?: any) {
    let fieldObject = getFieldState(field);
  
    let parameters: any = {
      page: 1,
    };

    if (defineValue) {
      fieldObject.value = "";
    }
    parameters[field] = validate(value) ? value : fieldObject.value;

    router.push(`${pageRoute}${getFiltersString(parameters)}`);
  }

  function assignValues(parameters: any) {
    for (const property in parameters) {
      let field = getField(property);
      if (validate(field) && validateString(parameters[property])) {
        field["value"] = parameters[property];
      }
    }
    setfieldsState(fields);
  }

  var [PaginationState, setPaginationState]: any = React.useState({
    actualPage: 1,
    pageSize: 5,
    totalResults: 0,
    totalPages: 0,
    pages: [],
  });
  function getFilters(parameters?: any) {
    let filters: any = {};
    filters["page"] = Pagination.actualPage;
    fields.forEach((field: any) => {
      if (validateString(query[field.field])) {
        filters[field.field] = query[field.field];
      }
    });
    if (parameters) {
      //FILTROS=Object.assign(FILTROS, PARAMETROS);
      for (const property in parameters) {
        filters[property] = parameters[property];
      }
    }
    for (const property in filters) {
      if (!validateString(filters[property])) {
        delete filters[property];
      }
    }
    return filters;
  }
  function getFiltersString(parameters: any) {
    let filters: any = getFilters(parameters);

    let filterString = Object.keys(filters)
      .map((key) => {
        return `${key}=${encodeURIComponent(filters[key])}`;
      })
      .join("&");
    return filterString ? `?${filterString}` : "";
  }
  function getObjectProperty(obj: any, name: string) {
    return obj[name];
  }

  const handleCloseMessage = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

  };
 
  function getDateFormat(text: string) {
    if (text) {
      return format(new Date(text), "dd/MM/yyyy");
    } else {
      return "";
    }
  }
  

  React.useEffect(() => {
    if (isReady) {
    


      Pagination = {
        ...Pagination,
        ["actualPage"]: getNumber(query.page) ? getNumber(query.page) : 1,
      };
      assignValues(query);
  
      getUsers();
    }
  }, [isReady, query]);
  React.useEffect(() => {
    if (isReady) {
      getRoles();
    }
  }, [isReady]);


  async function getRoles(){

    try{
      let data:Array<Rol>|null =await fetchData("getRoles",{},"POST",true);
      setRoles((data?data:[]));
    }
    catch(e){
      console.dir(e)
    }finally{

    }
  }

  async function updateRoles(){
    if(isLoadingUpdate){
      return;
    }
    setIsLoadingUpdate(true);

    try{
      let data:any|null =await fetchData("updateRoles",{userRole:userUser,roles:userRoles},"POST",true);
      if(!(data?.error)){
        setAlertMessage({message:"Roles actualizados correctamente",severity:"success"});
        applyFilter("page",PaginationState.actualPage)
      }else{
        console.dir(data)
        setAlertMessage({message:"Ocurrio un error al actualizar los roles del usuario",severity:"error"});
      }
      
    }
    catch(e){
      console.dir(e)
      setAlertMessage({message:"Ocurrio un error al actualizar los roles del usuario",severity:"error"});
    }finally{
      setIsLoadingUpdate(false);
    }
  }

  async function getUsers() {
    let user: any = {};
    try {
      user = await Auth.currentAuthenticatedUser();
    } catch (err) {}
  
    if (isLoading) {
      return;
    }
    if (!user?.username) {
      
      setAlertMessage("Vuelve a iniciar sesion");
      return;
    }

    setIsLoading(true);

    let filters = getFilters();
    filters["user"] = user?.username;
    try {
      const data =  await fetchData("getUsers",{
        ...filters,
      },"POST",true);

      if (!data.error) {
        if (data?.data?.length) {
          setUsers(data?.data);
        } else {
          setUsers([]);
        }

     

        Pagination = {
          ...Pagination,
          ["totalResults"]: getNumber(data.total),
          ["totalPages"]: Math.ceil(
            getNumber(data.total) / PaginationState.pageSize
          ),
          ["pages"]: pagination(
            getNumber(query.page) ? getNumber(query.page) : 1,
            Math.ceil(getNumber(data.total) / PaginationState.pageSize)
          ),
        };
        setPaginationState({ ...Pagination });
      } else {
        
        setAlertMessage("No hay usuarios");
        setUsers([]);
      }
    } catch (error) {
      setAlertMessage("No hay usuarios");
      console.dir(error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  const [openModalRoles, setOpenModalRoles] = React.useState(false);

  const handleOpenModalRoles = () => setOpenModalRoles(true);
  const handleCloseModalRoles = () => setOpenModalRoles(false);
  return (
    <>
      <Head>
        <title>VigiA - Usuarios</title>
        <meta name="description" content="Usuarios" />
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
      <Layout>
      <Modal
            open={openModalRoles}
            onClose={handleCloseModalRoles}
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
                onClick={handleCloseModalRoles}
              >
                <CloseIcon className={styles.IconCloseModalButton} />
              </Box>

              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                className={styles.TitleProcess}
              >
               Roles
              </Typography>
              <Grid container>
                
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{}}>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    className={styles.ImageLikeDescription}
                  >
                    Puedes ingresar multiples roles para que tenga el usuario: <br />
                    <b>{userNames}</b><br />
                    <b>{userEmail}</b>
                  </Typography>
                  <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                          {/*
          options={comidas}
        getOptionLabel={(option) => option.texto}
        defaultValue={[comidas[0],comidas[1],comidas[2]]}

        */}
                          <Autocomplete
                            onChange={(event, newValue) => {
                             
                              setUserRoles(newValue.map((data)=>{return data;}));
                            }}
                            value={userRoles}
                            multiple
                            id="size-small-filled-multi"
                            size="small"
                            options={Roles.map((data)=>{return data.nombre;})}
                            getOptionLabel={(option) => option}
                            
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  variant="outlined"
                                  label={option}
                                  size="small"
                                  {...getTagProps({ index })}
                                  className={styles.ChipAutoComplete}
                                  key={index}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <ThemeProvider theme={PersonalizedTextKeywords}>
                                <TextField
                                  {...params}
                                  variant="filled"
                                  label="Ingresa roles"
                                  placeholder=""
                                  className={styles.InputTextKeywords}
                                />
                              </ThemeProvider>
                            )}
                          />
                        </Box>
                </Grid>

                <Grid item xs={12}>{
                  Roles.map((data,index)=>{
                    return <Typography
                    key={index}
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    className={styles.ImageLikeDescription}
                  >
                  <b>{data.nombre}</b> - {data.descripcion}
                  </Typography>
                  })
                }
                
                  <Box  sx={{textAlign: {
        xs:"center",
        sm:"right",
        display:"flex",
        alignContent:"center",
        justifyContent:"right"
      }}}>
                  <Box sx={{
          display:"inline-block",
          textAlign:"right"
        }}>
          {isLoadingUpdate&&<CircularProgress size="38px" />} &nbsp;</Box>
                    <Button
                      title="Aceptar"
                      variant="contained"
                      disableElevation
                      className={styles.ButtonPrincipal}
                      onClick={
                        async ()=>{

                          await updateRoles();
                          handleCloseModalRoles();
                        }
                        
                        }
                    >
                      Aceptar
                    </Button>
                  </Box>
                  
                </Grid>
              </Grid>
            </Box>
          </Modal>
        <Box
          sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 200px)" } }}
          className={styles.BackgroundPreColor}
        >
          <Modal
            open={openModalFilters}
            onClose={handleCloseModalFilters}
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
                onClick={handleCloseModalFilters}
              >
                <CloseIcon className={styles.IconCloseModalButton} />
              </Box>

              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                className={styles.TitleProcess}
              >
                Filtrar por {getGroup(SelectedGroup).name}
              </Typography>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{}}>
                  {/*
              <Box className={styles.InputTitle}>¿En qué punto del proceso encontraste el problema?  <span className={styles.ColorDanger}>*</span>  </Box>
          */}

                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="type"
                  >
                    {getGroup(SelectedGroup).group.map(
                      (fieldField: any, index: number) => {
                        let field = getField(fieldField);
                        return (
                          <FormControlLabel
                            key={index}
                            value={field.field}
                            control={
                              <Radio
                                name={field.field}
                                checked={SelectedField === field.field}
                                onChange={(e) => {
                                  setSelectedField(e.target.value);
                                }}
                                sx={{
                                  /* color: "#8A49FF!important",*/
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label={field.name}
                            className={styles.RadioText}
                          />
                        );
                      }
                    )}
                  </RadioGroup>
                  {/*<Box className={styles.InputTitle}> {getGroup(SelectedGroup).name}  </Box> */}
                  {getGroup(SelectedGroup).type === "text" && (
                    <ThemeProvider theme={PersonalizedText}>
                      <TextField
                        label="Ingresa un termino"
                        name="text"
                        type="text"
                        variant="filled"
                        value={defaultText}
                        onChange={(e) => {
                          setDefaultText(e.target.value);
                        }}
                        fullWidth
                        className={styles.InputText + " " + "InputTest"}
                      />
                    </ThemeProvider>
                  )}
                  {getGroup(SelectedGroup).type === "date" && (
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      localeText={
                        esES.components.MuiLocalizationProvider.defaultProps
                          .localeText
                      }
                    >
                      <DatePicker
                        label="Ingresa una fecha"
                        value={defaultDate}
                        inputFormat="YYYY-MM-DD"
                        className={styles.InputText}
                        onChange={(newValue: any) => {
                 
                          setDefaultDate(
                            newValue?.$d
                              ? format(newValue.$d, "yyyy-MM-dd")
                              : ""
                          );
                        }}
                        renderInput={(params) => (
                          <ThemeProvider theme={PersonalizedTextDatePicker}>
                            <TextField fullWidth variant="filled" {...params} />{" "}
                          </ThemeProvider>
                        )}
                      />
                    </LocalizationProvider>
                  )}
                  {getGroup(SelectedGroup).type === "select" && (
                    <>
                      <ThemeProvider theme={PersonalizedSelect}>
                        <TextField
                          label="Selecciona"
                          name="text"
                          type="text"
                          variant="filled"
                          fullWidth
                          select
                          value={defaultText}
                          onChange={(e) => {
                            setDefaultText(e.target.value);
                           
                          }}
                          className={styles.InputText}
                        >
                          {getGroupOptions(SelectedGroup).map(
                            (option, index) => {
                              return (
                                <MenuItem key={index} value={option.value}>
                                  {option.name}
                                </MenuItem>
                              );
                            }
                          )}
                        </TextField>
                      </ThemeProvider>
                    </>
                  )}

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

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{}}>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    className={styles.ImageLikeDescription}
                  >
                    Recuerda que puedes agregar multiples filtros.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ textAlign: "right", mb: "2rem" }}>
                    <Button
                      title="Aplicar Filtro"
                      variant="contained"
                      disableElevation
                      className={styles.ButtonPrincipal}
                      onClick={(e) => {
                        getField(SelectedField).value =
                          getGroup(SelectedGroup).type === "date"
                            ? defaultDate.toString()
                            : defaultText;
                        setfieldsState(fields);
                        applyFilter(
                          SelectedField,
                          getField(SelectedField).value
                        );
                        handleCloseModalFilters();
                      }}
                    >
                      Aplicar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <Container
            sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
          >
            <Typography
              variant="inherit"
              component="h1"
              className={
                styles.StartActionTitle + " " + styles.ColorTextPrimaryA
              }
            >
              Listado de Usuarios
            </Typography>

            <Box sx={{ marginBottom: "1rem" }}>
              <Grid container>
                <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                  <ThemeProvider theme={PersonalizedTextSearchWhite}>
                    <TextField
                      sx={{ marginBottom: "0.5rem" }}
                      label="Buscar usuario..."
                      name="search"
                      type="text"
                      variant="filled"
                      fullWidth
                      className={
                        styles.WhiteInputText +
                        " " +
                        styles.InputTextFilterSearch
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        getField("search").value = e.target.value;
                   
                        setfieldsState(fields);
                      }}
                      value={getFieldState("search").value}
                      onKeyUp={(e: any) => {
                        if (e.key === "Enter") {
                          applyFilter("search");
                        }
                      }}
                      InputProps={{
                        disableUnderline: false,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={(e: any) => {
                                applyFilter("search");
                              }}
                              aria-label="toggle password visibility"
                              edge="end"
                              className={styles.SearchButtonText}
                            >
                              <SearchIcon className={styles.SearchIconText} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </ThemeProvider>
                </Grid>
                <Grid item xs={12} sm={5} md={5} lg={5} xl={5}></Grid>
              </Grid>
            </Box>
            <Box sx={{ marginBottom: "1rem" }}>
              <>
                {fieldsState
                  .filter((field) => {
                    return (
                      field.type != "explicit" && validateString(field.value)
                    );
                  })
                  .map((field: any, index: number) => {
                    return (
                      <Box className={styles.FilterTableBox} key={index}>
                        <b>{getGroup(field.group).name}</b> {field.name}{" "}
                        <b>
                          {getGroup(field.group).type == "select"
                            ? getGroupOption(field.group, field.value).name
                            : field.value}{" "}
                        </b>{" "}
                        <ClearIcon
                          className={styles.FilterTableIcon}
                          onClick={(e) => {
                            getField(field.field).value = "";
                            setfieldsState(fields);
                            applyFilter(field.field, "");
                          }}
                        ></ClearIcon>
                      </Box>
                    );
                  })}
              </>

              <Box
                className={styles.FilterTableBox + " " + styles.AddFilters}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenFiltersMenu}
              >
                <b>Filtros</b>{" "}
                <AddIcon className={styles.FilterTableIcon}></AddIcon>
              </Box>
            </Box>
            <ThemeProvider theme={FiltersMenu}>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElFilters}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElFilters)}
                onClose={handleCloseFiltersMenu}
                sx={{
                  display: { xs: "block" },
                }}
              >
                {fieldsGroups.map((group) => (
                  <MenuItem
                    key={group.id}
                    onClick={(e) => {
                      handleOpenModalFilters();
                      setSelectedGroup(group.id);
                      setSelectedField(getGroup(group.id).group[0]);
                      handleCloseFiltersMenu();
                    }}
                  >
                    <Typography
                      textAlign="center"
                      className={styles.ItemMenuFilters}
                    >
                      {group.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </ThemeProvider>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  className={styles.ElementContainer}
                  sx={{ height: "100%" }}
                >
                  <table
                    className={styles.tableData + " " + styles.tableCenter}
                  >
                    <thead>
                      <tr>
                        {/*<th>Tipo de Reclamo</th>*/}
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Creación</th>
                        
                        <th>Roles</th>
                        <th>Confirmado</th>
                        
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
                      ) : !Users.length && !isLoading ? (
                        <tr>
                          <td data-label="" colSpan={6}>
                            <b>No se encontraron resultados</b>
                          </td>
                        </tr>
                      ) : (
                        Users.map((User: any, index: number) => {
                          return (
                            <tr
                              key={index}
                            >
                              {/*<td data-label="Tipo de Reclamo">Consulta</td>*/}
                              <td data-label="Nombre">
                               
                                  {User.nombres} {User.apellidos}
                              
                              </td>
                              <td data-label="Correo">
                                <Typography
                                  title={User.correo}
                                  variant="inherit"
                                  component="div"
                                  sx={{
                                    overflowX: "clip",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {User.correo} 
                                </Typography>
                              </td>
                              <td data-label="Creación">
                                {getDateFormat(User.fecha_creacion)}
                              </td>
                              <td data-label="Roles">
                                    {User.roles}
                              
                              </td>
                              <td data-label="Confirmado">
                                {User.confirmacion}
                              </td>
                       
                              <td data-label="">
                            
                                  <Button
                                    title="Editar"
                                    variant="contained"
                                    disableElevation
                                    className={
                                      styles.ButtonPrincipal +
                                      " " +
                                      styles.ButtonSmall
                                    }
                                    sx={{ mr: 1 }}
                                    onClick={()=>{
                                      if(User.roles!='Ninguno'){
                                        setUserRoles(User.roles.split(', '));
                                      }else{
                                        setUserRoles([]);
                                      }
                                      setUserUser(User.usuario);
                                      setUserEmail(User.correo)
                                      setUserNames(User.nombres);
                                      handleOpenModalRoles();
                                      /*
                                        setDialog({title:"Cambio de Roles",body:"¿Esta seguro que desea cambiar los roles de este usuario?",doTrue:()=>()=>{
                                          deleteTweet(Post.id_tweet);
                                        
                                        
                                        }});*/
                                    
                                      
                                      }}
                                  >
                                    Editar
                                  </Button>
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
                      {PaginationState.actualPage > 1 && (
                        <Link
                          href={
                            pageRoute +
                            getFiltersString({
                              page: PaginationState.actualPage - 1,
                            })
                          }
                        >
                          <div className={styles.PaginationBefore}>
                            <NavigateBeforeIcon></NavigateBeforeIcon>
                          </div>
                        </Link>
                      )}
                      {PaginationState.pages.map((page: any, index: number) => {
                        return page == "..." ? (
                          <Link
                            key={index}
                            href={
                              pageRoute +
                              getFiltersString({
                                page: PaginationState.pages[index - 1] + 1,
                              })
                            }
                          >
                            <div
                              key={index}
                              className={styles.PaginationNumber}
                            >
                              {page}
                            </div>
                          </Link>
                        ) : (
                          <Link
                            key={index}
                            href={pageRoute + getFiltersString({ page: page })}
                          >
                            <div
                              className={
                                styles.PaginationNumber +
                                " " +
                                (page == PaginationState.actualPage
                                  ? styles.Active
                                  : "")
                              }
                            >
                              {page}
                            </div>
                          </Link>
                        );
                      })}

                      {PaginationState.actualPage <
                        PaginationState.totalPages && (
                        <Link
                          href={
                            pageRoute +
                            getFiltersString({
                              page: PaginationState.actualPage + 1,
                            })
                          }
                        >
                          <div className={styles.PaginationNext}>
                            <NavigateNextIcon></NavigateNextIcon>
                          </div>
                        </Link>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Layout>
    </>
  );
};

export default AppUsers;
