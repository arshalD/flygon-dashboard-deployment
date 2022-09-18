import React from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        console.log(firebase.auth().currentUser)
        if (firebase.auth().currentUser !== null || sessionStorage.getItem("user") !== null) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};
