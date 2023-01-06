
import React from "react";
import { useDialogContext } from "../../src/contexts/dialog-context";

import styles from "../../styles/Login.module.scss";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
const GlobalAlert = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { dialogConfig, setDialog } = useDialogContext();

  const [title, setTitle] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");
  const [caseTrue, setCaseTrue] = React.useState<Function>(()=>()=>{});
  
  React.useEffect(() => {
    

    
      if(dialogConfig.title!== ""){
        setTitle(dialogConfig.title);
        setBody(dialogConfig.body);
        setCaseTrue(dialogConfig.doTrue);
      }
      
    
    setOpen(dialogConfig.title !== "" );
    
  }, [dialogConfig]);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
  };


  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: { borderRadius: 20,padding:"1rem" }   }}
        
      >
        <DialogTitle id="alert-dialog-title">
        <Typography
          variant="inherit"
          component="span"
          className={styles.StartActionTitle + " " + styles.ColorTextGray}
        >
          {title}
        </Typography>
         
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <Typography
          variant="inherit"
          component="span"
          className={styles.StartActionSubTitle + " " + styles.ColorTextGray}
          sx={{ marginBottom: "0rem" }}
        >
         {body}
        </Typography>
          
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Box
            sx={{
              paddingTop: "5px",
              margin: "0 auto",
              textAlign: {
                xs: "center",
                sm: "right",
              },
            }}
            className={styles.MultipleButtons}
          >
              <Button
                title="Consultar"
                variant="contained"
                disableElevation
                className={styles.ButtonPrincipal + " " + styles.ButtonGray}
                onClick={handleClose}
              >
                Cancelar
              </Button>

            <Button
              title="Reclamar"
              variant="contained"
              disableElevation
              className={
                styles.ButtonPrincipal + " " + styles.ButtonContrast_3
              }
              onClick={()=>{
                caseTrue();
                handleClose();
                
              }} autoFocus
            >
              Aceptar
            </Button>
          </Box>
      
        </DialogActions>
      </Dialog>
  );
};

export default GlobalAlert;
