import React from "react";
import { Redirect, Route } from 'react-router'

export default function PrivateRoute({ component: Component, currentUser, ...rest }) {
  return (
    <Route
      {...rest}
      render={({match, props}) =>
        currentUser ? (
          <Component match={match} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }
    />
  );
}