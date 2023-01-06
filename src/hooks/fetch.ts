import React, { useCallback } from "react";
import { useAlertContext } from "../contexts/alert-context";
import { useLoading } from "../contexts/loading-context";
import fetchData from "../utils/fetch";

type SetMessageErrorType = (_: string) => void;

const useFetch = <Data = any, Payload = any>(
  path: string,
  payload: Payload,
  method: string = "POST",
  useToken: boolean = false,
  messageError: string = "",
  setMessageError: SetMessageErrorType | null = null,
): Data | null => {
  const { setLoading } = useLoading();
  const { setAlertMessage } = useAlertContext();
  const [data, setData] = React.useState<Data | null>(null);
  const setErrorMessage = setMessageError || setAlertMessage;

  const fetching = useCallback(async () => {
    try {
      const newData = await fetchData<Data, Payload>(
        path,
        payload,
        method,
        useToken,
        messageError,
        setErrorMessage,
        setLoading
      );
      setData(newData);
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, payload, method, useToken, messageError, setErrorMessage, setLoading]);

  React.useEffect(() => {
    fetching();
  }, [fetching]);

  return data;
};

export default useFetch;
