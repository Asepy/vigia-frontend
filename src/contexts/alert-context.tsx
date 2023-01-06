import { createContext, ReactElement, useContext, useState } from "react";
import { AlertConfig } from "../interfaces/alert";

export type AlertContextValue = {
  alertMessage: string | AlertConfig;
  setAlertMessage: (_: string | AlertConfig) => void;
};

export const AlertContext = createContext<AlertContextValue>({
  setAlertMessage: () => {},
  alertMessage: "",
});

export const useAlertContext = () => useContext(AlertContext);

type AlertProviderProps = {
  children: ReactElement;
};

const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alertMessage, setAlertMessage] = useState<string | AlertConfig>("");
  return (
    <AlertContext.Provider value={{ alertMessage, setAlertMessage }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
