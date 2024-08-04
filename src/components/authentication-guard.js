import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { PageLoader } from "./page-loader";

export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => {
      window.localStorage.setItem('redirectPath', window.location.pathname);
      console.log(`rd  ${window.location.pathname}`)
      return (
        <div className="page-layout">
          <PageLoader />
        </div>
      );
    },
  });

  return <Component />;
};
