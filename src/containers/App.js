import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { ROUTE } from "../constants";
import Dashboard from "./Dashboard";
import DashboardProvider from "../contexts/dashboard";

const Providers = ({ children }) => {
  return <DashboardProvider>{children}</DashboardProvider>;
};

const App = () => {
  return (
    <Providers>
      <BrowserRouter>
        <Route exact path={ROUTE.HOMEPAGE} component={Dashboard} />
        <Route
          exact
          path={ROUTE.DEFAULT}
          render={() => <Redirect to={ROUTE.HOMEPAGE} />}
        />
        <Route path="*" render={() => <Redirect to={ROUTE.HOMEPAGE} />} />
      </BrowserRouter>
    </Providers>
  );
};

export default App;
