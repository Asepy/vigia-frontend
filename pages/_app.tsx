import "animate.css";
import Amplify from 'aws-amplify';
import React, { useEffect } from "react";
//import awsconfig from '../src/aws-exports.js';
Amplify.configure({
  "aws_project_region": process.env.NEXT_PUBLIC_COGNITO_REGION,
  "aws_cognito_identity_pool_id": process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  "aws_cognito_region": process.env.NEXT_PUBLIC_COGNITO_REGION,
  "aws_user_pools_id": process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  "aws_user_pools_web_client_id": process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  "oauth": {},
  "aws_cognito_username_attributes": [
      "EMAIL"
  ],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [
      "EMAIL"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
      "SMS"
  ],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ]
});
import type { AppProps } from "next/app";
import CurrentUser from "../components/auth/CurrentUser";
import GlobalAlert from "../components/ui/GlobalAlert";
import GlobalDialog from "../components/ui/GlobalDialog";
import AlertProvider from "../src/contexts/alert-context";
import DialogProvider from "../src/contexts/dialog-context";
import AuthProvider from "../src/contexts/auth-context";
import LoadingProvider from "../src/contexts/loading-context";
import TagManager from "react-gtm-module";
import ReactGA from 'react-ga';

import "../styles/globals.css";



function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GOOGLE_TAG) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_TAG);
      
      /*TagManager.initialize({
        gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG
      });*/
      
      
    }
  }, []);
  return (
    <>
    
    <AlertProvider>
      <DialogProvider>
      <AuthProvider>
          <LoadingProvider>
            <>
              <CurrentUser />
              <GlobalAlert />
              <GlobalDialog/>
              <Component {...pageProps} />
            </>
          </LoadingProvider>
      </AuthProvider>
      </DialogProvider>
    </AlertProvider>
    </>
  );
}

export default MyApp;
