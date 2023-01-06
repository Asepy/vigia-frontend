import { createContext, ReactElement, useContext, useState } from "react";
import { DialogConfig } from "../interfaces/dialog";

export type DialogContextValue = {
  dialogConfig: DialogConfig;
  setDialog: (_: DialogConfig) => void;
};

export const DialogContext = createContext<DialogContextValue>({
  setDialog: () => {},
  dialogConfig: {title:"",body:"",doTrue:()=>{}},
});

export const useDialogContext = () => useContext(DialogContext);

type DialogProviderProps = {
  children: ReactElement;
};

const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialogConfig, setDialog] = useState<DialogConfig>({title:"",body:"",doTrue:()=>{}});
  return (
    <DialogContext.Provider value={{ dialogConfig, setDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
