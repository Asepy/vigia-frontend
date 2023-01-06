import { Button, CircularProgress,LinearProgress,Box } from "@mui/material";
import { ButtonProps } from "@mui/material";
import { useLoading } from "../../src/contexts/loading-context";
import styles from "../../styles/Login.module.scss";

const LoadingButton = ({ children, ...props }: ButtonProps) => {
  const { loading } = useLoading();
  return (
    <>
    {(!loading) ? (<Button
      variant="contained"
      disableElevation
      disabled={loading}
      className={
        styles.ButtonPrincipal +
        " " +
        styles.BigButton +
        " " +
        (loading && styles.LoadingPrimaryButton)
      }
      {...props}
    >
      {children}
    </Button>
    ) : null
    }
    
    {loading ? (
      <Box sx={{ width: '100%',paddingBottom:"1rem",paddingTop:"1rem" }}>
      <LinearProgress className={styles.LoadingPrimary}/>
      </Box>
        
      ) : null}
    </>
    
  );
};

export default LoadingButton;
