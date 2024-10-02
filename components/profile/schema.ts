import * as yup from "yup";
import { emailSchema as email } from "../../src/utils/schema";

export const profileSchema = yup.object().shape({
  names: yup.string().required("Ingresa tu nombre"),
  lastNames: yup.string().required("Ingresa tu apellido"),
  email,
  notifications:yup.string().required("Ingresa la configuracion de tus notificaciones"),
  // clave: yup.string().required("Ingresa una palabra clave"),
  oldPassword: yup.string(),
  password: yup.string().when(["oldPassword"], (oldPassword, schema) => {
    return oldPassword.length > 0
      ? schema.min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        /^.*([A-Z])+.*$/g,
        "La contraseña debe tener al menos una letra mayúscula"
      )
      .matches(
        /^.*([a-z])+.*$/g,
        "La contraseña debe tener al menos una letra minúscula"
      )
      .matches(
        /^.*(\d)+.*$/g,
        "La contraseña debe tener al menos un número"
      )
      .matches(
        /^.*([!@#$%^&*()_\-{}.,<>,.:;"'\[\]+=`~\\|])+.*$/g,
        "La contraseña debe tener al menos un caracter especial, !@#$%^&*()_\-{}.,<>,.:;\"'[]+=`~\\|"
      )
      : schema;
  }),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "La nueva contraseña debe coincidir con la de confirmación"
    ),
});


export const forcePasswordSchema = yup.object().shape({
  oldPassword: yup.string(),
  password: yup.string().when(["oldPassword"], (oldPassword, schema) => {
    return oldPassword.length > 0
      ? schema.min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        /^.*([A-Z])+.*$/g,
        "La contraseña debe tener al menos una letra mayúscula"
      )
      .matches(
        /^.*([a-z])+.*$/g,
        "La contraseña debe tener al menos una letra minúscula"
      )
      .matches(
        /^.*(\d)+.*$/g,
        "La contraseña debe tener al menos un número"
      )
      .matches(
        /^.*([!@#$%^&*()_\-{}.,<>,.:;"'\[\]+=`~\\|])+.*$/g,
        "La contraseña debe tener al menos un caracter especial, !@#$%^&*()_\-{}.,<>,.:;\"'[]+=`~\\|"
      )
      : schema;
  }),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "La nueva contraseña debe coincidir con la de confirmación"
    ),
});