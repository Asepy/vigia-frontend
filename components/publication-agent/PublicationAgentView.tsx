import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { CONSULTA, TypeClaimOrQuestion } from "../../src/interfaces/type-claim-or-question";
import styles from "../../styles/Login.module.scss";
import { OnChangeProps } from "../fields/interface";
import TextArea from "../fields/TextArea";


import ContentCopy from "@mui/icons-material/ContentCopy";
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const TWITTER_USER = process.env.NEXT_PUBLIC_TWITTER_USER;

interface PublicationAgentViewProps extends OnChangeProps {
  enlace: string
  tipo: TypeClaimOrQuestion;
  sourceUrl: string;
  onSubmit: () => void;
  form:any;
  onCopy: () => void;
}

const PublicationAgentView = ({
  enlace,
  sourceUrl,
  tipo,
  onChange,
  onSubmit,
  form,
  onCopy
}: PublicationAgentViewProps) => {
  const shortUrl = `${FRONTEND_URL}/${sourceUrl}/?id=${enlace}`;
  const backUrl = `${FRONTEND_URL}/${tipo === CONSULTA ? 'app/questionAgent': 'app/claimAgent'}/?id=${enlace}`;
  return (
    <Box
      sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 259px)" } }}
      className={styles.BackgroundSecondaryColor}
    >
      <Container
        sx={{ paddingTop: { xs: "3rem" }, paddingBottom: { xs: "3rem" } }}
      >
        <Box className={styles.FormContainer}>
          <Typography
            variant="inherit"
            component="h2"
            className={styles.TitleContainerFormGray}
          >
            Postear Caso, {tipo===CONSULTA?'Consulta':"Reclamo"}
            <span className={styles.ColorText}> #{enlace} </span>
          </Typography>
          <Typography
            variant="inherit"
            component="p"
            className={styles.InputTitle}
            sx={{fontSize:"2rem!important",cursor:"pointer",alignContent:"center",display:"flex"}}  onClick={onCopy}

          >
            
           <ContentCopy sx={{fontSize:"20px"}}/> 
            &nbsp;URL del caso:
            
          </Typography>
          <Typography
            variant="inherit"
            component="p"
            className={styles.ItemsContainerText}
          >
           
            <Link
              href={{
                pathname: sourceUrl,
                query: {
                  id: enlace,
                },
              }}
            >
              <a className={styles.LinkedText}>{shortUrl}</a>
            </Link>
          </Typography>

          <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <TextArea
              label={`Da un breve contexto y pega el enlace del caso.`}
              name="tweet"
              title="Tweet"
              inputProps={{ maxLength: 280 }}
              valueLength={form.tweet.length}
              onChange={onChange}
            />
            <Typography
              variant="inherit"
              component="p"
              className={styles.ItemsContainerText}
              sx={{ mt: 1 }}
            >
              <span>Se publicará con el usuario </span>
              <Link href={`https://twitter.com/${TWITTER_USER}`}>
                  <a ><span className={styles.ColorText}>
                  
                  <b> @{TWITTER_USER}</b>
                </span></a></Link>
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: {
                xs: "center",
                sm: "right",
              },
            }}
            className={styles.MultipleButtons}
          >
            <Link href={backUrl}>
              <Button
                title="Consultar"
                variant="contained"
                disableElevation
                className={styles.ButtonPrincipal + " " + styles.ButtonGray}
              >
                Cancelar
              </Button>
            </Link>

            <Button
              title="Reclamar"
              variant="contained"
              disableElevation
              className={styles.ButtonPrincipal + " " + styles.ButtonContrast_3}
              onClick={onSubmit}
            >
              Publicar
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicationAgentView;
