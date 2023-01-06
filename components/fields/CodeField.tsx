import { TextFieldProps } from "@mui/material/TextField";
import Field from "./Field";

const CodeField = (props: TextFieldProps) => {
  return (
    <Field
      title="Código de Confirmación"
      placeholder="999999"
      name="code"
      {...props}
    />
  );
};

export default CodeField;
