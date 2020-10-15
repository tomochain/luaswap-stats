import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Tabs,
  IconButton,
  Tab,
  // makeStyles,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { ROUTE } from "../constants";

const MENU_TAB = [ROUTE.HOMEPAGE];

// const useStyles = makeStyles(() => ({}));

const Navbar = ({ location }) => {
  const [tabValue, setTabValue] = useState(0);
  // const classes = useStyles();

  const handleChangeTab = (_, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (location.pathname) {
      const chosenTabId = MENU_TAB.indexOf(location.pathname);
      if (chosenTabId !== tabValue) {
        setTabValue(chosenTabId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="Go to Homepage">
          <MenuIcon />
        </IconButton>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="App menu">
          <Tab id="app-menu-tab-0" label="Dashboard" aria-label="Dashboard" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
