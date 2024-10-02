import {
  // Autocomplete,
  Box,
  Button,
  // Chip,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import styles from "../../styles/Login.module.scss";
import EmailField from "../fields/EmailField";
import Field from "../fields/Field";
import { OnChangeProps } from "../fields/interface";
import PasswordField from "../fields/PasswordField";
// import TextArea from "../fields/TextArea";
import BoxContainer from "../ui/BoxContainer";
import { ProfileForm } from "./interface";


import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';

const comidas = [
  { texto: "Sandwich" },
  { texto: "Catering" },
  { texto: "Pasta" },
  { texto: "Comida" },
  { texto: "Hamburguesa" },
  { texto: "Camarones" },
  { texto: "Carne" },
  { texto: "Res" },
  { texto: "Cerdo" },
];

interface ProfileViewProps extends OnChangeProps {
  form: ProfileForm;
  updateProfile: () => void;
  loading?:boolean;
}

const ProfileView = ({ form, onChange, updateProfile,loading=false }: ProfileViewProps) => {
  return (
    <BoxContainer
      sx={{ paddingTop: { xs: "6rem" }, paddingBottom: { xs: "6rem" } }}
    >
      <Box className={styles.FormContainer}>
        <Typography
          variant="inherit"
          component="h1"
          className={styles.StartActionTitle + " " + styles.ColorTextGray}
        >
          Perfil
        </Typography>

        <Typography
          variant="inherit"
          component="h2"
          className={styles.StartActionSubTitle + " " + styles.ColorTextGray}
          sx={{ marginBottom: "0rem" }}
        >
          Datos Personales
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Field
              title="Nombres"
              name="names"
              value={form.names}
              placeholder="Ingresa tus nombres"
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Field
              title="Apellidos"
              name="lastNames"
              value={form.lastNames}
              placeholder="Ingresa tus apellidos"
              onChange={onChange}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Field
              title="Registro Único de Contribuyente"
              name="ruc"
              value={form.ruc}
              placeholder="80078755-2"
              onChange={onChange}
            />
          </Grid> */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}></Grid>
        </Grid>
        <Typography
          variant="inherit"
          component="h2"
          className={styles.StartActionSubTitle + " " + styles.ColorTextGray}
          sx={{ marginBottom: "0rem" }}
        >
          Notificaciones de Oportunidades
        </Typography>
        <Grid  item xs={12}  sm={6} md={12} lg={12} xl={12}>
            <RadioGroup
            row
            aria-labelledby="group"
            name="notifications"
            value={form.notifications}
            onChange={onChange}
          >
            <FormControlLabel value="SI" control={<Radio 
            sx={{
              color: '#6817FF',
              '&.Mui-checked': {
                color: '#6817FF',
              },
            }}
            />} label="Accesibles para MIPYMES" className={styles.labelRadio}/>
            <FormControlLabel value="TODAS" control={<Radio 
            sx={{
              color: '#6817FF',
              '&.Mui-checked': {
                color: '#6817FF',
              },
            }}
            />} label="Todas"  className={styles.labelRadio}/>
            <FormControlLabel value="NINGUNA" control={<Radio 
            sx={{
              color: '#6817FF',
              '&.Mui-checked': {
                color: '#6817FF',
              },
            }}
            />} label="Ninguna"  className={styles.labelRadio}/>
          </RadioGroup>
        </Grid>


        <Typography
          variant="inherit"
          component="h2"
          className={styles.StartActionSubTitle + " " + styles.ColorTextGray}
          sx={{ marginTop: "1rem" }}
        >
          Cuenta
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <EmailField value={form.email} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}></Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <PasswordField
              title="Contraseña"
              name="oldPassword"
              placeholder="Ingresa la contraseña actual"
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <PasswordField
              title="Nueva contraseña"
              name="password"
              placeholder="Ingresa una nueva contraseña"
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <PasswordField
              title="Confirmación de contraseña"
              name="confirmPassword"
              placeholder="Confirme la nueva contraseña"
              onChange={onChange}
            />
          </Grid>
        </Grid>
        {/* <Typography
          variant="inherit"
          component="h2"
          className={styles.StartActionSubTitle + " " + styles.ColorTextGray}
          sx={{ marginTop: "1rem" }}
        >
          Información
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Box className={styles.InputTitle}>
              {" "}
              Palabras Clave <span className={styles.ColorDanger}>*</span>{" "}
            </Box>
            <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <Autocomplete
                multiple
                id="size-small-filled-multi"
                size="small"
                options={comidas}
                getOptionLabel={(option) => option.texto}
                defaultValue={[comidas[0], comidas[1], comidas[2]]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.texto}
                      size="small"
                      {...getTagProps({ index })}
                      className={styles.ChipAutoComplete}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextArea
                    {...params}
                    title="Palabra Clave"
                    name="clave"
                    value={form.clave}
                    label="Ingresa palabras clave"
                    placeholder=""
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography
              variant="inherit"
              component="p"
              className={styles.ItemsContainerText}
            >
              Ingresa palabras clave que te interesen en los llamados, pueden
              ser nombres de tus productos u otros servicios que ofrezcas.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box className={styles.InputTitle}>
              {" "}
              Rubro <span className={styles.ColorDanger}>*</span>{" "}
            </Box>
            <Box sx={{ textAlign: "" }}>
              <Box className={styles.SelectionImageItem}>
                <img
                  src="/images/icons/categorias/construccion.svg"
                  alt="Obras"
                />
                <Box className={styles.Title}>Obras</Box>
              </Box>
              <Box className={styles.SelectionImageItem}>
                <img src="/images/icons/categorias/bienes.svg" alt="Obras" />
                <Box className={styles.Title}>Bienes</Box>
              </Box>
              <Box className={styles.SelectionImageItem}>
                <img src="/images/icons/categorias/servicios.svg" alt="Obras" />
                <Box className={styles.Title}>Servicios</Box>
              </Box>
            </Box>

            <Box className={styles.FormDescription} sx={{ paddingTop: "10px" }}>
              Selecciona el tipo de rubro según las actividades que realizas
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box className={styles.InputTitle}>
              {" "}
              Actividad <span className={styles.ColorDanger}>*</span>{" "}
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Box
                className={
                  styles.SelectionImageItem +
                  " " +
                  styles.SelectionImageItemActive
                }
              >
                <img
                  src="/images/icons/categorias/alimentos.svg"
                  alt="Servicios Gastronómicos"
                />
                <Box className={styles.Title}>
                  Servicios <br /> Gastronómicos
                </Box>
                <Box className={styles.SelectionImageNumber}>1</Box>
              </Box>
              <Box className={styles.SelectionImageItem}>
                <img
                  src="/images/icons/categorias/confeccion.svg"
                  alt="Textiles"
                />
                <Box className={styles.Title}>
                  Textiles,
                  <br /> vestuarios...
                </Box>
              </Box>
              <Box
                className={
                  styles.SelectionImageItem +
                  " " +
                  styles.SelectionImageItemActive
                }
              >
                <img
                  src="/images/icons/categorias/construccion.svg"
                  alt="Construcción , Restauración..."
                />
                <Box className={styles.Title}>
                  Construcción , Restauración...
                </Box>
                <Box className={styles.SelectionImageNumber}>2</Box>
              </Box>
              <Box className={styles.SelectionImageItem}>
                <img
                  src="/images/icons/categorias/limpieza.svg"
                  alt="Servicios de Limpiezas..."
                />
                <Box className={styles.Title}>Servicios de Limpiezas...</Box>
              </Box>
              <Box className={styles.SelectionImageItem}>
                <img src="/images/icons/categorias/mas.svg" alt="Más" />
                <Box className={styles.Title}>Más...</Box>
              </Box>
            </Box>
            <Typography
              variant="inherit"
              component="p"
              className={styles.ItemsContainerText}
            >
              Selecciona dos rubros que mejor describa tu actividad principal y
              secundaria en el orden que los elijas
            </Typography>
          </Grid>
        </Grid> */}

        <Box>
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
            <Link href="/app/panel">
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
              className={
                styles.ButtonPrincipal + " " + styles.ButtonContrast_3
              }
              onClick={updateProfile}
              disabled={loading}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Box>
    </BoxContainer>
  );
};

export default ProfileView;
