import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate = ( {children} ) => {
    const navigate = useNavigate();

    const domain = process.env.REACT_APP_AUTH0_DOMAIN || 'dev-nq48llbln54g6wrm.us.auth0.com' ;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || 'PWd5qy3LGwa4N74FYlROj5EDgGmoYwqG';
    const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL ||'https://zeush1bportal.azurewebsites.net/callback';
    const cache = "localstorage"

    const onRedirectCallback = (appState) => {
        navigate(appState?.returnTo || window.location.pathname);
      };

    if (!(domain && clientId && redirectUri)) {
    return null;
    }
    return(
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
            redirect_uri: redirectUri,
            }}
            cacheLocation={cache}
            onRedirectCallback={onRedirectCallback}
         >
          {children}
            <Outlet />
        </Auth0Provider>
  );
    
}