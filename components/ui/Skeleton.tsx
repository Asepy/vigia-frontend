
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import styles from '../../styles/Login.module.scss';
export function SkeletonSearch(quantity:number){
    return <Grid container spacing={2} sx={{justifyContent:"stretch"}}>
    {
       (Array(quantity).fill(0).map((e,i)=>i+1)).map((element,index:number)=>{
            return <Grid item xs={12} sm={12} md={12} lg={6} xl={6} key={index} sx={{display:"flex"}}>
            <Box className={styles.SearchContainerResult} sx={{width:"100%"}}>
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
             </Box></Grid>;
        })
    }
    </Grid>
    
    
}