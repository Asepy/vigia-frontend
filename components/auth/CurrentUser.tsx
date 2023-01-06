import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../../src/contexts/auth-context";
import useCurrentUser from "../../src/hooks/current-user";

const CurrentUser: any = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const { user } = useAuth();
  React.useEffect(() => {
    if (user && currentUser) {
      if (router.pathname === "/login") {
        router.push("/app/panel");
      }
    }
  }, [router, currentUser, user]);
  return <></>;
};

export default CurrentUser;
