import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../../../styles/Footer.module.scss'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import MenuItem from '@mui/material/MenuItem';
const Footer: NextPage = () => {
   
//disableGutters
    return (
      <>
        <Box className={styles.BackgroundPrincipal}>
        <Container>
        <Grid container >
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{}}>
            <Box >
            <a href='https://www.open-contracting.org/es/'>
            <img alt="OCP" src="/images/logos/ocp.png" style={{width:'80%',maxWidth:"400px",display:"block",margin:"0 auto"}}/>
            </a>
            </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{}}>
            <Box >
            <a href='https://www.caf.com/'>
            <img alt="CAF" src="/images/logos/caf.png" style={{width:'80%',maxWidth:"400px",display:"block",margin:"0 auto"}}/>
            </a>
            </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{}}>
            <Box >
            <a href='https://asepy.org/'>
            <img alt="ASEPY" src="/images/logos/asepy.png" style={{width:'80%',maxWidth:"400px",display:"block",margin:"0 auto"}}/>
            </a>
            </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{}}>
            <Box >
            <a href='https://standard.open-contracting.org'>
            <img alt="OCDS" src="/images/logos/ocds.png" style={{width:'80%',maxWidth:"400px",display:"block",margin:"0 auto"}}/>
            </a>
            </Box>
            </Grid>
        </Grid>
        </Container>
        </Box>
        <Box className={styles.BackgroundSecondary}>
           <Container>
            <Box sx={{paddingTop:"0.8rem",paddingBottom:"0.8rem", textAlign:{xs:"center",sm:"right"}}}>
              <a href="https://cds.com.py/">
              <span className={styles.DeveloperText}>
              Código fuente abierto desarrollado por &nbsp;
              </span>
              <img src="/images/logos/cds_gray.svg" alt="Logo CDS" className={styles.DeveloperLogo}/>
              </a>
              
            </Box>
           </Container>
        </Box>
      </>
    )
  }
export default Footer

