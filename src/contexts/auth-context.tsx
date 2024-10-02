/* eslint-disable react-hooks/exhaustive-deps */
import { CognitoUser } from "amazon-cognito-identity-js";
import React, { createContext, ReactElement, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/local-storage";
import { User, Token } from "../interfaces/user";
import { USER_KEY, TOKEN_KEY } from "../utils/constants";
import { Auth } from "aws-amplify";
import { useAlertContext } from "./alert-context";
import { useRouter } from "next/router";
import fetchData from "../../src/utils/fetch";

export type AuthProviderValue = {
  user: User | null;
  token: Token | null;
  signIn: (data: CognitoUser,login?:number|string) => void;
  signOut: () => void;
  getActualUser:() => Promise<User | null>;
};

const AuthContext = createContext<AuthProviderValue>({
  user: null,
  token: null,
  signIn: () => {},
  signOut: () => {},
  getActualUser: () => Promise.resolve(null),
});

type AuthProviderProps = {
  children: ReactElement;
};

async function getFetchGetUserRoles(usr: User | null): Promise<User | null> {
  try {
    if (usr) {
      const user = { ...usr };
      //const data: Array<string>|null = await fetchData("getUserRoles",{},"POST",true);
      const data:any|null = await fetchData("getUser",{},"POST",true);
      user.roles = data?.roles?data.roles:[];
      user.notifications=data?.notications ?? 'SI';
      return user;
    }
  } catch (e) {
    if (usr) {
      const user = { ...usr };
      user.roles = [];
      return user;
    }
  }
  return null;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage<User | null>(USER_KEY, null);
  const [token, setToken] = useLocalStorage<Token | null>(TOKEN_KEY, null);
  const { setAlertMessage } = useAlertContext();
  const router = useRouter();
  
  React.useEffect(() => {
    getActualUser(true);
  }, []);

  const signIn = async (data: CognitoUser,login?:number|string) => {
    const attributes = (data as any).attributes;
    const user = await getFetchGetUserRoles({...attributes, ...{login:login}});
    const session = data.getSignInUserSession();
    const token: Token = {
      username: user?.sub ?? "",
      accessToken: session?.getAccessToken().getJwtToken() ?? "",
      refreshToken: session?.getRefreshToken().getToken() ?? "",
      expired: session?.getAccessToken().getExpiration() ?? 0,
    };
    setUser(user);
    setToken(token);
    return user;
  };

  const signOut = async () => {
    
    setUser(null);
    setToken(null);
    user && user.signOut && user.signOut();
  };
  const returnUser = () => {
    if(/^\/app\//g.test(router.pathname)){
      setAlertMessage({
        severity: "info",
        message:"Tu sesión a caducado"
      });
      router.push("/login");
    }
  }

  const getActualUser = async (updateUser?:boolean): Promise<User | null> => {
    if(user){
      try {
        const userCheck=await Auth.currentAuthenticatedUser();
        if(user?.sub!==userCheck.attributes.sub){
          return await signIn(userCheck)
        }else{
          if(updateUser){
            return await signIn(userCheck,user?.login);
          }
          return user;
        }
      } catch (err) {
        signOut();
        returnUser();
        return null;
      }
    }else{
      returnUser();
      return null;
    }
    
  };


  const value: AuthProviderValue = useMemo(
    () => ({
      user,
      token,
      signIn,
      signOut,
      getActualUser
    }),
    [user, signIn, signOut,getActualUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
