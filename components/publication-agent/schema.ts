import * as yup from "yup";

export const publicationAgentSchema = yup.object().shape({
  tweet: yup.string().required("Ingresa el texto del reclamo").max(280, "Un tweet tiene un máximo de 280 caracteres"),
});
