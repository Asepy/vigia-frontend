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
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';

const PersonalizedTextArea = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root":{
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "1.5rem",
            border:"3px solid #6817FF!important",
            backgroundColor:"#ffffff"
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
            border:"3px solid #6817FF!important",
            backgroundColor:"#ffffff!important"
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

const Login: NextPage = () => {
  return (
    <>
    

    <Head>
        <title>VigiA</title>
        <meta name="description" content="Iniciar Sesión" />
        <link rel="icon" href="/favicon.ico" />
         
        </Head>
    <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 200px)'}}} className={styles.BackgroundSecondaryColor}>
      <Container sx={{paddingTop:{xs:"6rem"},paddingBottom:{xs:"6rem"}}}>
      <Box className={styles.FormContainer} >
       
        <Typography variant="inherit" component="h1"  className={styles.StartActionTitle+" "+styles.ColorTextGray }>
        Perfil
        </Typography>
     
      <Typography variant="inherit" component="h2" className={styles.StartActionSubTitle+" "+styles.ColorTextGray} sx={{marginBottom:"0rem"}}>
      Datos Personales
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box className={styles.InputTitle}> Nombres <span className={styles.ColorDanger}>*</span>  </Box>
        <ThemeProvider theme={PersonalizedText}>
        <TextField
          
          label="Ingresa tus nombres"
          name="text"
          type="text"
          variant="filled"
          fullWidth
           className={styles.InputText +" "+"InputTest"}
        />
      </ThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box className={styles.InputTitle}> Apellidos <span className={styles.ColorDanger}>*</span>  </Box>
        <ThemeProvider theme={PersonalizedText}>
        <TextField
          
          label="Ingresa tus apellidos"
          name="text"
          type="text"
          variant="filled"
          fullWidth
           className={styles.InputText +" "+"InputTest"}
        />
      </ThemeProvider>
          </Grid>
        
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          
          </Grid>
        </Grid>
        <Typography variant="inherit" component="h2" className={styles.StartActionSubTitle+" "+styles.ColorTextGray} sx={{marginTop:"1rem"}}>
      Cuenta
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box className={styles.InputTitle}> Correo Electrónico <span className={styles.ColorDanger}>*</span>  </Box>
        <ThemeProvider theme={PersonalizedText}>
        <TextField
          
          label="jose@correo.com"
          name="email"
          type="email"
          variant="filled"
          fullWidth
           className={styles.InputText +" "+"InputTest"}
        />
      </ThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box className={styles.InputTitle}> Contraseña <span className={styles.ColorDanger}>*</span>  </Box>
        <ThemeProvider theme={PersonalizedText}>
        <TextField
          label="Ingresa la contraseña actual"
          name="passwor"
          type="password"
          variant="filled"
          fullWidth
           className={styles.InputText +" "+"InputTest"}
        />
      </ThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box className={styles.InputTitle}> Nueva Contraseña <span className={styles.ColorDanger}>*</span>  </Box>
        <ThemeProvider theme={PersonalizedText}>
        <TextField
          label="Ingresa una nueva contraseña"
          name="passwor"
          type="password"
          variant="filled"
          fullWidth
           className={styles.InputText +" "+"InputTest"}
        />
      </ThemeProvider>
          </Grid>
        </Grid>
       
        <Box>

        
      
        <Box sx={{paddingTop: "5px",margin:"0 auto",textAlign: {
        xs:"center",
        sm:"right"
      }}} className={styles.MultipleButtons}>
    


      <Link href="/app/panelAgent">
      <Button title="Consultar" 
          variant="contained" disableElevation 
          className={styles.ButtonPrincipal+" "+styles.ButtonGray}> 
          Cancelar</Button>
      </Link>


      <Link href="/app/panelAgent">
      <Button title="Reclamar" 
          variant="contained" disableElevation 
          className={styles.ButtonPrincipal+" "+styles.ButtonContrast_3}> 
          Guardar</Button>
        </Link>
      
       </Box>
          
        </Box>
      </Box>
      </Container>
    
    </Box>
   
  </Layout>
    </>
  )
}

export default Login
