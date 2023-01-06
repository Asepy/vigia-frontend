import * as yup from "yup";
import { emailSchema as email } from "../../src/utils/schema";

export const confirmSchema = yup.object().shape({
  email,
  code: yup.string().required("Ingresa un Código"),
});

export const loginSchema = yup.object().shape({
  email:yup.string().required("Ingresa un Correo Electrónico").email("Ingresa un Correo Electrónico Válido"),
  password: yup.string().required("Ingresa una Contraseña"),
});

export const forgotSchema = yup.object().shape({
  email:yup.string().required("Ingresa un Correo Electrónico").email("Ingresa un Correo Electrónico Válido"),
});

export const forgotConfirmSchema = yup.object().shape({
  email,
  code: yup.string().required("Ingresa un Código"),
  password: yup
    .string()
    .required("Ingresa una Contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
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
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir"),
});

export const registerSchema = yup.object().shape({
  names: yup.string().required("Ingresa un Nombre"),
  lastNames: yup.string().required("Ingresa un Apellido"),
  email:yup.string().required("Ingresa un Correo Electrónico").email("Ingresa un Correo Electrónico Válido"),
  password: yup
    .string()
    .required("Ingresa una Contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
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
    ),
});


export const forcePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Ingresa una Contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
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
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir"),
});
