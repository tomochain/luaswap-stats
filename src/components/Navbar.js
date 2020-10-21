import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Tabs,
  IconButton,
  Tab,
  makeStyles,
} from "@material-ui/core";
import { Assessment as AssessmentIcon } from "@material-ui/icons";
import homepageIcon from "../assets/images/luaswap.png";
import { ROUTE } from "../constants";

const MENU_TAB = [ROUTE.HOMEPAGE];

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: theme.palette.secondary.light,
    color: "white",
  },
  tab: {
    marginLeft: 40,
  },
  tabItem: {
    padding: 0,
    minWidth: "auto",
    minHeight: 64,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    fontSize: 14,
    fontWeight: 600,
  },
  chartIcon: {
    position: "absolute",
    top: 5,
    right: -15,
    fontSize: 26,
  },
}));

const Navbar = ({ history, location }) => {
  const [tabValue, setTabValue] = useState(0);
  const classes = useStyles();

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
    <AppBar position="fixed" className={classes.navbar}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Go to Homepage"
          onClick={() => history.push(ROUTE.HOMEPAGE)}
        >
          <img alt="Homepage" src={homepageIcon} width="auto" height={40} />
          <AssessmentIcon color="primary" className={classes.chartIcon} />
        </IconButton>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="App menu"
          indicatorColor="primary"
          className={classes.tab}
        >
          <Tab
            id="app-menu-tab-0"
            label="Dashboard"
            aria-label="Dashboard"
            className={classes.tabItem}
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
