import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import React from "react";

const useCurrentUser = () => {
  const [user, setUser] = React.useState<CognitoUser | null>(null);

  const checkUser = React.useCallback(async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch (err) {
      console.dir(err);
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    checkUser();
  }, [checkUser]);

  return user;
};

export default useCurrentUser;
