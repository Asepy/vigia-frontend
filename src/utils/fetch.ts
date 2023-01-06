import { Auth } from "aws-amplify";
import ifetch from "isomorphic-fetch";

async function fetchData<Data = any, Payload = any>(
  path: string,
  payload: Payload,
  method: string = "POST",
  useToken: boolean = false,
  messageError: string = "",
  setMessageError: (_: string) => void = () => {},
  setLoading: (_: boolean) => void = () => {}
): Promise<Data | null> {
  let data = null;
  try {
    setLoading(true);
    let headers: any = {
      "Content-Type": "application/json",
    };

    if (useToken) {
      try {
        /*obtener los tokens directamente de cognito porque se pueden refrescar, el id token contiene los atributos del usuario,
        los nombres de nuevos headers lambda los paso a minusculas
        */
        const user = await Auth.currentAuthenticatedUser();
        headers = {
          ...headers,
          "c-access-token": user
            .getSignInUserSession()
            .getAccessToken()
            .getJwtToken(),
          "c-id-token": user.getSignInUserSession().getIdToken().getJwtToken(),
          "c-refresh-token": user
            .getSignInUserSession()
            .getRefreshToken()
            .getToken(),
        };
      } catch (e) {}
    }
    if(process.env.NEXT_PUBLIC_API_KEY){
      headers={...headers,...{
        "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`
      }}
    }
    const response = await ifetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
      {
        method,
        //mode: "no-cors",
        body: JSON.stringify(payload),
        headers,
      }
    );
    const json = await response.json();
    if (json) {
      data = json;
    } else if (messageError) {
      setMessageError(messageError);
    }
  } catch (error: any) {
    setMessageError(messageError || error.toString());
    throw error;
  } finally {
    setLoading(false);
  }
  return data;
}

export default fetchData;
