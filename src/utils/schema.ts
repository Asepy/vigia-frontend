import type { AnySchema } from "yup";
import * as yup from "yup";
import { ValidationError } from "yup";
import { AlertConfig } from "../interfaces/alert";

export const emailSchema = yup
  .string()
  .required("Ingresa un Correo Electrónico")
  .email("Ingresa un Correo Electrónico Válido");

export function validateSchema(
  schema: AnySchema,
  value: any,
  setAlertMessage: (_: string | AlertConfig) => void
) {
  try {
    schema.validateSync(value, { abortEarly: false });
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      setAlertMessage(error.inner[0].message);
    }
    return false;
  }
}
