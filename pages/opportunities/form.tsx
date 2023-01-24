import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Login.module.scss";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import Layout from "../../components/ui/Layout/Layout";

import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { mainProcurementCategoryDetails } from "../../components/imports/StaticData";
import {
  pagination,
  validate,
  validateString,
  getString,
  getNumber,
  getDateFormat,
  likeText,
  minText,
} from "../../components/imports/Functions";
import { Category } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
const steps = ["paso1", "paso2", "paso3", "paso4"];
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
import InputMask from "react-input-mask";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

import InputAdornment from "@mui/material/InputAdornment";
import {
  PersonalizedTextArea,
  PersonalizedText,
  PersonalizedTextSearch,
  PersonalizedTextKeywords,
} from "../../components/ui/DesignElements";

import LinearProgress from "@mui/material/LinearProgress";
import { LVL1Items } from "../../components/imports/StaticData";
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import { createFilterOptions } from "@mui/material/Autocomplete";

import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

import { Auth } from "aws-amplify";
import * as yup from "yup";
import { ValidationError } from "yup";

import { useRouter } from "next/router";
import fetchData from "../../src/utils/fetch";

let schemaOpportunities = yup.object().shape({
  categories_lvl1: yup.string().required("Selecciona Categorias"),
  //categories: yup.string().required('Selecciona Categorias'),
  formalization: yup
    .string()
    .required("Selecciona cuál es tu rango de formalizacion"),
  experience: yup
    .string()
    .required("Selecciona cuál es tu rango de experiencia"),

  keywords: yup.string().required("Ingresa palabras clave"),
});

const filterOptions = createFilterOptions({
  ignoreAccents: true,
  ignoreCase: true,
  trim: true,
  limit: 10,
});

const OpportunitiesForm: NextPage = () => {
  const { query, isReady } = useRouter();
  var router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);
  const [LVL1State, setLVL1State]: any = React.useState(
    LVL1Items.map((data) => {
      return {
        code: data.code,
        value: "",
        name: `${data.code} - ${data.name}`,
      };
    })
  );
  const [LVL5State, setLVL5State]: any = React.useState([]);
  const [SearchValueLVL1State, setSearchValueLVL1State]: any =
    React.useState("");

  function getLVL1Option(code: string) {
    return LVL1State.filter((data: any) => {
      return data.code == code;
    })[0];
  }

  function getLVL1OptionsData() {
    return {
      selected: LVL1State.filter((data: any) => {
        return data.value == "SI";
      }).length,
      total: LVL1State.length,
    };
  }
  function getLVL1SelectedOptions() {
    return LVL1State.filter((data: any) => {
      return data.value == "SI";
    });
  }
  const [CategoriesState, setCategoriesState]: any = React.useState([]);
  const [KeywordsState, setKeywordsState] = React.useState<Array<any>>([]);
  const [KeywordsInputState, setKeywordsInputState] = React.useState("");
  const [isLoadingRUC, setIsLoadingRUC]: any = React.useState(false);
  const [isLoadingSaveConfig, setIsLoadingSaveConfig]: any =
    React.useState(false);

  const [RUCState, setRUCState]: any = React.useState("");
  const [RUCData, setRUCData]: any = React.useState({});

  const [RUCMaskState, setRUCMaskState]: any = React.useState("");
  const [FormalizationRangeState, setFormalizationRangeState]: any =
    React.useState("");
  const [ExperienceRangeState, setExperienceRangeState]: any =
    React.useState("");

  const [openMessage, setOpenMessage] = React.useState(false);
  const [Message, setMessage] = React.useState("");

  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  React.useEffect(() => {
    getOpportunitiesConfig();
  }, []);
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  async function getOpportunitiesConfig() {
    let user: any = {};
    try {
      user = await Auth.currentAuthenticatedUser();
    } catch (err) {}

    if (user?.attributes?.sub) {
      try {
        let data: any = await fetchData("getOpportunitiesConfig",{},"POST",true);
        if (data.palabras_clave) {
          setCategoriesState(getString(data.categorias).split("|"));
          setKeywordsState(getString(data.palabras_clave).split("|"));

          for (let LVL1 of getString(data.categorias_nivel1).split("|")) {
            getLVL1Option(LVL1).value = "SI";
          }
          setLVL1State(LVL1State);
          setLVL5State(getString(data.categorias_nivel5).split("|"));
          setFormalizationRangeState(getString(data.rango_formalizacion));
          setExperienceRangeState(getString(data.rango_experiencia));

          setRUCMaskState(getString(data.ruc));
          setRUCState(getString(data.ruc));
          setRUCData({
            LVL1Array: [],
            LVL4Array: [],
            LVL5Array: [],
            itemsDescriptions: [],
            mainProcurementCategoryArray: [],
            party: {
              id: RUCState,
              legalName: "",
              scheme: "PY-RUC",
            },
            mainProcurementCategoryDetailsArray: [],
            procurementMethodDetailsArray: [],
          });
          setMessage("Hemos llenado algunas secciones con tu información");
          setOpenMessage(true);
        }
      } catch (e) {}
    }
  }

  async function sendOpportunitiesForm() {
    if (isLoadingSaveConfig) {
      return;
    }

    let user: any = {};
    try {
      user = await Auth.currentAuthenticatedUser();
    } catch (err) {}

    let params = {
      ruc: RUCState,
      keywords: KeywordsState.join("|"),
      experience: ExperienceRangeState,
      formalization: FormalizationRangeState,
      categories_lvl1: getLVL1SelectedOptions()
        .map((data: any) => {
          return data.code;
        })
        .join("|"),
      categories_lvl5: LVL5State.join("|"),
      categories: CategoriesState.join("|")
      
    };


    try {
      schemaOpportunities.validateSync(params, { abortEarly: false });
    } catch (error) {
      if (error instanceof ValidationError) {
        setMessage(error.inner[0].message);
        setOpenMessage(true);
      }
      return;
    }
    if (validateString(params.ruc)) {
      if (!checkRUC(params.ruc)) {
        setMessage("RUC no válido");
        setOpenMessage(true);
        return;
      }
    }

    if (user?.attributes?.sub) {
      setIsLoadingSaveConfig(true);
      try {
        let data: any = await fetchData("addOpportunitiesConfig",{
          ...params,
          ...{},
        },"POST",true);
        
        if (data?.updated) {
          setMessage(
            "Se ha actualizado tu configuración para mostrarte más oportunidades"
          );
          setOpenMessage(true);
        } else {
          setMessage(
            "Se ha guardado tu configuración para mostrarte más oportunidades"
          );
          setOpenMessage(true);
        }
      } catch (e) {
        setMessage("Ocurrio un error a la hora de guardar tu configuración");
        setOpenMessage(true);
      } finally {
        setIsLoadingSaveConfig(false);
      }
    } else {
    }
    let dataOpportunities = window.btoa(
      JSON.stringify({
        ruc: RUCState,
        keywords: KeywordsState.join("|"),
        experience: ExperienceRangeState,
        formalization: FormalizationRangeState,
        categories_lvl1: getLVL1SelectedOptions()
          .map((data: any) => {
            return data.code;
          })
          .join("|"),
        categories_lvl5: LVL5State.join("|"),
        categories: CategoriesState.join("|"),
      })
    );
    
    router.push(
      `/opportunities/results?data=${encodeURIComponent(dataOpportunities)}`
    );
  }
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  async function getPartyData() {
    if (isLoadingRUC) {
      return;
    }
    setIsLoadingRUC(true);
    try {
      let data: any = await fetchData("getPartyProcessesDNCP",{
        ruc: RUCState,
      },"POST",false);
      setRUCData(data);

      for (let LVL1 of data.LVL1Array) {
        getLVL1Option(LVL1).value = "SI";
      }
      let words: Array<string> = [];
      for (let text of data.itemsDescriptions) {
        let elements = text.trim().split(/\s+/);
        words = [
          ...words,
          ...elements
            .filter((word: string) => {
              return word.length > 4 && /^\w+$/g.test(word);
            })
            .map((word: string) => {
              return word.toLowerCase();
            }),
        ];
      }

      setCategoriesState(
        data.mainProcurementCategoryDetailsArray.map((data: string) => {
          return data.replace(/^\w+\s+-\s+/g, "");
        })
      );

   
      words = words.filter((x, i, a) => a.indexOf(x) === i);
      setKeywordsState(words.slice(0, 10));

      setLVL1State(LVL1State);
      setLVL5State(data.LVL5Array);
      setMessage("Hemos llenado algunas secciones con tu información");
      setOpenMessage(true);
    } catch (e) {
      setMessage("No se encontraron llamados en los que estes involucrado");
      setOpenMessage(true);
      setRUCData({
        LVL1Array: [],
        LVL4Array: [],
        LVL5Array: [],
        itemsDescriptions: [],
        mainProcurementCategoryArray: [],
        party: {
          id: RUCState,
          legalName: "Nuevo Proveedor",
          scheme: "PY-RUC",
        },
        mainProcurementCategoryDetailsArray: [],
        procurementMethodDetailsArray: [],
      });

      EmptyStates();
    } finally {
      setIsLoadingRUC(false);
    }
  }

  function EmptyStates() {
    setKeywordsState([]);
    setCategoriesState([]);
    setLVL1State(
      LVL1Items.map((data) => {
        return {
          code: data.code,
          value: "",
          name: `${data.code} - ${data.name}`,
        };
      })
    );

    setLVL5State([]);
    setFormalizationRangeState("");
    setExperienceRangeState("");
  }

  function checkRUC(text: string) {
    return /^\d{8}-\d$/g.test(text);
  }

  return (
    <>
      <Head>
        <title>VigiA - Formulario de Oportunidades</title>
        <meta name="description" content="Formulario de Oportunidades" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <Layout>
        <Box
          sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 200px)" } }}
          className={styles.BackgroundSecondaryColor}
        >
          <Container
            sx={{ paddingTop: { xs: "6rem" }, paddingBottom: { xs: "6rem" } }}
          >
            <Box className={styles.FormContainer}>
              <div>
                {allStepsCompleted() ? (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {activeStep == 1 && (
                      <>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={styles.TitleContainerFormGray}
                        >
                          ¿Cuál es el rubro de tu actividad principal?
                        </Typography>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          Selecciona categorías que mejor describan las
                          actividades que realices{" "}
                          <b>{`${getLVL1OptionsData().selected}/${
                            getLVL1OptionsData().total
                          }`}</b>
                        </Typography>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          sx={{ padding: "0.5rem" }}
                        >
                          <ThemeProvider theme={PersonalizedTextSearch}>
                            <TextField
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setSearchValueLVL1State(e.target.value);
                              }}
                              value={SearchValueLVL1State}
                              label="Buscar Categoría..."
                              name="search"
                              type="text"
                              variant="filled"
                              fullWidth
                              className={
                                styles.InputTextSmall +
                                " " +
                                styles.GrayInputText
                              }
                              InputProps={{
                                disableUnderline: false,
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      edge="end"
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

                        <Box
                          className={styles.ChecksContainer}
                          sx={{ minHeight: "300px" }}
                        >
                          {LVL1State.filter((data: any) => {
                            return SearchValueLVL1State.trim()
                              ? likeText(data.name, SearchValueLVL1State)
                              : true;
                          }).map((data: any, index: number) => (
                            <Grid
                              container
                              sx={{ borderBottom: "2px dashed #F8F8F8" }}
                              key={index}
                            >
                              <Grid
                                item
                                xs={10}
                                sm={11}
                                md={11}
                                lg={11}
                                xl={11}
                                sx={{
                                  verticalAlign: "middle",
                                  textAlign: "left",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="inherit"
                                  component="p"
                                  className={styles.ItemsContainerText}
                                >
                                  {data.name}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={2}
                                sm={1}
                                md={1}
                                lg={1}
                                xl={1}
                                sx={{
                                  verticalAlign: "middle",
                                  textAlign: "left",
                                }}
                              >
                                <Checkbox
                                  {...{ inputProps: { "aria-label": "" } }}
                                  checked={
                                    getLVL1Option(data.code).value == "SI"
                                  }
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    getLVL1Option(e.target.name).value = e
                                      .target.checked
                                      ? "SI"
                                      : "NO";
                                    setLVL1State([...LVL1State]);
                                  }}
                                  name={data.code}
                                  sx={{
                                    [`&.${checkboxClasses.checked}`]: {
                                      color: "#8A49FF",
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          ))}
                        </Box>

                        <Box className={styles.InputTitle}>
                          <span className={styles.ColorDanger}>*</span>
                          <span>&nbsp;Selecciona al menos una </span>
                        </Box>
                      </>
                    )}
                    {activeStep == 2 && (
                      <>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={styles.TitleContainerFormGray}
                        >
                          Busca más oportunidades
                        </Typography>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          Ingresa nombres de productos o servicios que ofrezcas, separados por espacio, coma, o enter
                          (max. 10)
                        </Typography>
                        <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                          {/*
          options={comidas}
        getOptionLabel={(option) => option.texto}
        defaultValue={[comidas[0],comidas[1],comidas[2]]}

        */}
                          <Autocomplete
                            onChange={(event, newValue) => {
                              if(!(newValue.length>10)){
                                setKeywordsState(newValue);
                                setKeywordsInputState("");
                              }
                              
                              
                            }}
                            inputValue={KeywordsInputState}
                            onInputChange={(event, newInputValue) => {
                              const options = newInputValue.split(/[\s,]+/).filter((x:string) => {return (!KeywordsState.includes(x))&&x!=='';});
                     
                              if (options.length > 1 || (options.length==1 && /[\s,]+/g.test(newInputValue))) {
                                let keywords=KeywordsState
                                .concat(options)
                                .map((x:string) =>{ return x.trim()})
                                .filter((x:string) => {return x;});

                                if(keywords.length<=10){
                                  setKeywordsState(
                                    keywords
                                  );
                                  
                                }
                                setKeywordsInputState("");
                              } else {
                                
                                  setKeywordsInputState(newInputValue.replace(/[\s,]+/g,""));
                                
                                
                              }
                            }}
                            onBlur={(event) => {
                              
                              const options = KeywordsInputState.split(/[\s,]+/).filter((x:string) => {return (!KeywordsState.includes(x))&&x!=='';});
                            
                              if (options.length >= 1 ) {
                                let keywords=KeywordsState
                                .concat(options)
                                .map((x:string) =>{ return x.trim()})
                                .filter((x:string) => {return x;});
                                if(keywords.length<=10){
                                  setKeywordsState(
                                    keywords
                                  );
                                  
                                }
                                setKeywordsInputState("");
                                
                              } 
                            }}
                            value={KeywordsState}
                            multiple
                            id="size-small-filled-multi"
                            size="small"
                            filterOptions={filterOptions}
                            options={[]}
                            getOptionLabel={(option) => option}
                            freeSolo
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
                                  label="Ingresa palabras clave"
                                  placeholder=""
                                  className={styles.InputTextKeywords}
                                />
                              </ThemeProvider>
                            )}
                          />
                        </Box>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          Ingresa palabras clave que te interesen en los
                          llamados, pueden ser nombres de tus productos u otros
                          servicios que ofrezcas.
                        </Typography>

                        <Box className={styles.InputTitle}>
                          <span className={styles.ColorDanger}>*</span>
                          <span>&nbsp;Ingresa al menos una, <b>{KeywordsState.length}/10 </b></span>
                        </Box>
                      </>
                    )}
                    {activeStep == 3 && (
                      <>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={styles.TitleContainerFormGray}
                        >
                          Hablemos de experiencia.
                        </Typography>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          ¿Hace cuánto tiempo formalizaste tu empresa?{" "}
                        </Typography>
                        <RadioGroup
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="NUEVO"
                            control={
                              <Radio
                                checked={FormalizationRangeState == "NUEVO"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setFormalizationRangeState(e.target.value);
                                }}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="Soy nuevo"
                            className={styles.RadioText}
                          />

                          <FormControlLabel
                            value="1-2"
                            control={
                              <Radio
                                checked={FormalizationRangeState == "1-2"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setFormalizationRangeState(e.target.value);
                                }}
                                sx={{
                                  /* color: "#8A49FF!important",*/
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="1 - 2 años"
                            className={styles.RadioText}
                          />

                          <FormControlLabel
                            value="3-5"
                            control={
                              <Radio
                                checked={FormalizationRangeState == "3-5"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setFormalizationRangeState(e.target.value);
                                }}
                                sx={{
                                  /* color: "#8A49FF!important",*/
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="3 - 5 años"
                            className={styles.RadioText}
                          />

                          <FormControlLabel
                            value="6-10"
                            control={
                              <Radio
                                checked={FormalizationRangeState == "6-10"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setFormalizationRangeState(e.target.value);
                                }}
                                sx={{
                                  /* color: "#8A49FF!important",*/
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="6 - 10 años"
                            className={styles.RadioText}
                          />

                          <FormControlLabel
                            value="10<"
                            control={
                              <Radio
                                checked={FormalizationRangeState == "10<"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setFormalizationRangeState(e.target.value);
                                }}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="más de 10 años"
                            className={styles.RadioText}
                          />
                        </RadioGroup>
                        <Box className={styles.InputTitle}>
                          <span className={styles.ColorDanger}>*</span>
                          <span>&nbsp;Selecciona uno </span>
                        </Box>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          ¿Cuántos años de experiencia tienes en la venta de tu
                          producto o servicio? recuerda que se están usando
                          fondos públicos, asi que debes de poder demostrar con
                          documentos dicha experiencia.
                        </Typography>
                        <RadioGroup
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="NUEVO"
                            control={
                              <Radio
                                checked={ExperienceRangeState == "NUEVO"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setExperienceRangeState(e.target.value);
                                }}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="Soy nuevo"
                            className={styles.RadioText}
                          />
                          <FormControlLabel
                            value="1-2"
                            control={
                              <Radio
                                checked={ExperienceRangeState == "1-2"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setExperienceRangeState(e.target.value);
                                }}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="1 - 2 años"
                            className={styles.RadioText}
                          />

                          <FormControlLabel
                            value="3-5"
                            control={
                              <Radio
                                checked={ExperienceRangeState == "3-5"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setExperienceRangeState(e.target.value);
                                }}
                                sx={{
                                  /* color: "#8A49FF!important",*/
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="3 - 5 años"
                            className={styles.RadioText}
                          />

                          <FormControlLabel
                            value="6-10"
                            control={
                              <Radio
                                checked={ExperienceRangeState == "6-10"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setExperienceRangeState(e.target.value);
                                }}
                                sx={{
                                  /* color: "#8A49FF!important",*/
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="6 - 10 años"
                            className={styles.RadioText}
                          />

                          <FormControlLabel
                            value="10<"
                            control={
                              <Radio
                                checked={ExperienceRangeState == "10<"}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setExperienceRangeState(e.target.value);
                                }}
                                sx={{
                                  /* color: "#8A49FF!important",*/
                                  "&.Mui-checked": {
                                    color: "#8A49FF!important",
                                  },
                                }}
                              />
                            }
                            label="más de 10 años"
                            className={styles.RadioText}
                          />
                        </RadioGroup>
                        <Box className={styles.InputTitle}>
                          <span className={styles.ColorDanger}>*</span>
                          <span>&nbsp;Selecciona uno </span>
                        </Box>
                      </>
                    )}
                    {activeStep == 0 && (
                      <>
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={styles.TitleContainerFormGray}
                        >
                          Ayudanos a conocerte mejor
                        </Typography>
                        <Typography
                          variant="inherit"
                          component="p"
                          className={styles.ItemsContainerText}
                        >
                          Ingresando tu RUC, podemos buscar las oportunidades
                          que mejor se adecuen a tu empresa, en base a tu
                          histórico de postulaciones y adjudicaciones.
                        </Typography>

                        <Box
                          sx={{
                            display: "block",
                            margin: "0 auto",
                            maxWidth: "400px",
                            marginBottom: "1rem",
                          }}
                        >
                          <Box className={styles.InputTitle}>
                            {" "}
                            Registro Unico de Contribuyente{" "}
                            <span> (Opcional)</span>{" "}
                          </Box>

                          <ThemeProvider theme={PersonalizedText}>
                            <InputMask
                              mask="99999999-9"
                              value={RUCMaskState}
                              alwaysShowMask={false}
                              disabled={isLoadingRUC ? true : false}
                              onKeyUp={(e: any) => {
                                if (e.key === "Enter" && checkRUC(RUCState)) {
                                  getPartyData();
                                }
                              }}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setRUCMaskState(e.target.value);
                                if (checkRUC(e.target.value)) {
                                  setRUCState(e.target.value);
                                 
                                } else {
                                  setRUCState("");
                                  setRUCData({});
                                }
                              }}
                            >
                              <TextField
                                label="Ej: 80078755-2"
                                name="ruc"
                                type="text"
                                variant="filled"
                                fullWidth
                                className={styles.InputText}
                                InputProps={{
                                  disableUnderline: false,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                        onClick={(e: any) => {
                                          if (checkRUC(RUCState)) {
                                            getPartyData();
                                          }
                                        }}
                                      >
                                        <SearchIcon
                                          className={styles.SearchIconText}
                                        />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {/*(inputProps) => {

          return <TextField
            {...inputProps}
            label="Ej: 80078755-2"
            name="ruc"
            type="text"
            variant="filled"
            fullWidth
            className={styles.InputText }

          />
    }

    */}
                            </InputMask>
                          </ThemeProvider>
                        </Box>

                        {isLoadingRUC && (
                          <Box
                            sx={{
                              textAlign: "center",
                              width: "80%",
                              maxWidth: "300px",
                              margin: "0 auto",
                            }}
                          >
                            <Typography
                              variant="inherit"
                              component="h2"
                              className={
                                styles.TitleContainerFormGray +
                                " " +
                                styles.ColorTextGray
                              }
                              sx={{ textAlign: "center" }}
                            >
                              Cargando
                            </Typography>
                            <LinearProgress className={styles.LoadingPrimary} />
                          </Box>
                        )}
                        <Typography
                          variant="inherit"
                          component="h2"
                          className={
                            styles.TitleContainerFormGray +
                            " " +
                            styles.ColorText
                          }
                          sx={{ textAlign: "center" }}
                        >
                          {RUCData?.party?.legalName}
                        </Typography>
                      </>
                    )}
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        className={styles.FontBold}
                      >
                        Atrás
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {activeStep === totalSteps() - 1 ? (
                        <Button
                          title="Finalizar"
                          onClick={sendOpportunitiesForm}
                          variant="contained"
                          disableElevation
                          className={styles.ButtonPrincipal}
                          sx={{ mr: 1 }}
                        >
                          Finalizar
                        </Button>
                      ) : checkRUC(RUCState) &&
                        !isLoadingRUC &&
                        !RUCData.party ? (
                        <Button
                          title="Continuar"
                          variant="contained"
                          disableElevation
                          className={styles.ButtonPrincipal}
                          onClick={(e: any) => {
                            getPartyData();
                          }}
                          sx={{ mr: 1 }}
                        >
                          Obtener
                        </Button>
                      ) : (
                        <Button
                          title="Continuar"
                          disabled={isLoadingRUC}
                          variant="contained"
                          disableElevation
                          className={styles.ButtonPrincipal}
                          onClick={handleNext}
                          sx={{ mr: 1 }}
                        >
                          Continuar
                        </Button>
                      )}

                      {/*activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))*/}
                    </Box>
                  </React.Fragment>
                )}
              </div>

              {/*
       <Box className={styles.FormDescription} sx={{paddingTop: "10px"}}>
       Selecciona dos rubros que mejor describa tu actividad principal y secundaria
en el orden que los elijas
       </Box>*/}
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

export default OpportunitiesForm;
