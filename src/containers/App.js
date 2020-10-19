import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { ROUTE } from "../constants";
import Dashboard from "./Dashboard";
import DashboardProvider from "../contexts/dashboard";
import "../styles/common.css";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FABC45",
    },
    secondary: {
      light: "#313535",
      main: "#242828",
    },
  },
});

const Providers = ({ children }) => {
  return <DashboardProvider>{children}</DashboardProvider>;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
