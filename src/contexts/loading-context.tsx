import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type LoadingContextValue = {
  loading: boolean;
  setLoading: (_: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextValue>({
  setLoading: () => {},
  loading: false,
});

export const useLoading = () => useContext(LoadingContext);

type LoadingProviderProps = {
  children: ReactElement;
};

const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loading, setLoad] = useState(false);
  const [reqCount, setReqCount] = useState(0);

  const setLoading = useCallback(
    (isLoading: boolean) => {
      if (isLoading) {
        setReqCount(reqCount + 1);
        setLoad(true);
      } else {
        setReqCount(reqCount - 1);
        if (reqCount === 1) {
         
        }
        setLoad(false);
      }
    },
    [reqCount, setLoad, setReqCount]
  );

  const value: LoadingContextValue = useMemo(
    () => ({
      loading,
      setLoading,
    }),
    [loading, setLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export default LoadingProvider;
