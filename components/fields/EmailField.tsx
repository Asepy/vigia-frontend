import { TextFieldProps } from "@mui/material/TextField";
import Field from "./Field";

const EmailField = (props: TextFieldProps) => {
  return (
    <Field
      title="Correo Electrónico"
      placeholder="jose@correo.com"
      name="email"
      type="email"
      {...props}
    />
  );
};

export default EmailField;
