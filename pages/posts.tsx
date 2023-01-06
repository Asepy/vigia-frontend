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
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';

import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';

const Posts: NextPage = () => {
  return (
    <>
    
    <Head>
        <title>VigiA - Publicaciones</title>
        <meta name="description" content="Publicaciones" />
        <link rel="icon" href="/favicon.ico" />
         
        </Head>
    <Layout>
    <Box sx={{minHeight: {xs:"unset",sm: 'calc( 100vh - 200px)'}}} className={styles.BackgroundLightColor}>
      <Container sx={{paddingTop:{xs:"3rem"},paddingBottom:{xs:"3rem"}}}>
      <Typography variant="inherit" component="h1"  className={styles.StartActionTitle + " "+ styles.ColorTextPrimaryA}>
      Nuestros tweets
        </Typography>
     
      <Typography variant="inherit" component="h2" className={styles.StartActionSubTitle+ " "+ styles.ColorTextGray} sx={{marginBottom:"1rem"}}>
      
      Mantente actualizado con nuestras publicaciones
        </Typography>
        <Box sx={{marginBottom:"1rem",maxWidth:{xs:"100%",sm:"800px"}}}>
        <TwitterTimelineEmbed
  sourceType="profile"
  screenName="SomosASEPY"
  options={{height: 800}}
/>
        </Box>



      
        
   
  
      

    
</Container>
    
    </Box>
    </Layout>
    
    </>
  )
}

export default Posts
