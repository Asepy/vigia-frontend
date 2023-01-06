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
import FavoriteIcon from '@mui/icons-material/Favorite';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';

const FinishClaim: NextPage = () => {
  const router = useRouter();
  const [claimId, setClaimId] = React.useState('');
  React.useEffect( ()  => {
    
    if(getClaimId()){
      setClaimId(getClaimId())
    }
    
    
   
  }, [router.query['id']]);
  function getClaimId(){
    //let parts:Array<string> = location.href.split('/');
    let id:string='';
 
    return id+router.query['id'];//( parts.pop() || parts.pop()); 
  }
  return (
    <>
    
    <Head>
        <title>VigiA - Reclamo Enviado</title>
        <meta name="description" content="Reclamo Enviado" />
        <link rel="icon" href="/favicon.ico" />
         
        </Head>
    <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 259px)'}}} className={styles.BackgroundSecondaryColor}>
    

      <Container sx={{paddingTop:{xs:"3rem"},paddingBottom:{xs:"3rem"}}}>
     
      <Box className={styles.FormContainer} >
      <Typography variant="inherit" component="h2" className={styles.TitleContainerFormGray }>
      Reclamo Reportado
        </Typography>
        <Typography variant="inherit" component="p" className={styles.ItemsContainerText} >
        Tu reclamo ya fue enviado, se te notificará a través de un correo electrónico a medida se le vaya dando  seguimiento.
        </Typography>


        <Box sx={{marginTop:"1rem",marginBottom:"1rem"}}>
          <Grid container>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
              <img src="/images/icons/seguimiento.svg" className={styles.FinishImage}/> 
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
            <Typography variant="inherit" component="p" className={styles.ItemsContainerText +" " +styles.BiggerText} >
            <b> ID de Seguimiento:</b>
            </Typography>
            <Typography variant="inherit" component="p" className={styles.ItemsContainerText +" "+styles.BiggerText+" "+styles.ColorText} >
              <Link href={"/claims/claim?id="+encodeURIComponent(claimId)}>
                <a className={styles.LinkedText}>
                <b> {claimId}</b>
                </a>
              
              </Link>
           
            </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
        <Typography variant="inherit" component="p" className={styles.ItemsContainerText} >
        Los agentes de la comunidad harán su mayor esfuerzo, y en base a su conocimiento y experiencia, realizarán una de las siguientes acciones:
       
        
        </Typography>
        <Box className={styles.ItemsContainerText}>
        <ul>
          <li>Contactarte para que expliques mejor el problema encontrado</li>
          <li>Verificar si identificaste correctamente el llamado</li>
          <li>Comunicarte que tu reclamo no aplica </li>
          <li>Apoyarte para que tengas la mayor probabilidad de éxito con tu respuesta</li>
        </ul>
        </Box>
        <Typography variant="inherit" component="p" className={styles.ItemsContainerText} >
        En caso de que no estés satisfecho con nuestro desempeño, puedes dirigir tu reclamo al portal de la <a href="https://www.contrataciones.gov.py/reclamo.html" className={styles.LinkedText}> <b>DNCP</b></a>

        </Typography>
        </Box>
        
       
      
      
      </Box>
     
    
    
    
    
    
</Container>
    
    </Box>
    </Layout>
    
    </>
  )
}

export default FinishClaim
