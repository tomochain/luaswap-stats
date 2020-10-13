import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Box, Grid, Paper } from "@material-ui/core";
import CommonStatistics from "../components/CommonStatistics";
import PoolTable from "../components/PoolTable";
import Service from "../services";
import { useDashboardData } from "../hooks/dashboard";
import { EMPTY_TEXT } from "../constants/misc";
// import "../utils/tokenData";

const Dashboard = () => {
  const { commonData, setCommonData, setPools } = useDashboardData();
  const priceInterval = useRef(null);

  const handleRequestPrice = (token) => {
    return Service.getTokenPrice(token);
  };

  const reloadDashboardData = () => {
    // Request token prices
    Promise.all([
      handleRequestPrice("LUA"),
      handleRequestPrice("USDC"),
      handleRequestPrice("TOMOE"),
      handleRequestPrice("ETH"),
      handleRequestPrice("USDT"),
      handleRequestPrice("FRONT"),
      handleRequestPrice("SUSHI"),
      handleRequestPrice("SRM"),
      handleRequestPrice("FTT"),
      handleRequestPrice("KAI"),
      handleRequestPrice("OM"),
    ]).then(
      ([
        luaPrice,
        usdcPrice,
        tomoePrice,
        ethPrice,
        usdtPrice,
        frontPrice,
        sushiPrice,
        srmPrice,
        fttPrice,
        kaiPrice,
        omPrice,
      ]) => {
        setCommonData({
          luaPrice,
          usdcPrice,
          tomoePrice,
          ethPrice,
          usdtPrice,
          frontPrice,
          sushiPrice,
          srmPrice,
          fttPrice,
          kaiPrice,
          omPrice,
        });
      }
    );

    // Request pool list
    Service.getPools().then((newPools) => {
      setPools(newPools);
    });
  };

  useEffect(() => {
    // Initialize common data
    setCommonData({
      luaPrice: EMPTY_TEXT,
      usdcPrice: EMPTY_TEXT,
      tomoePrice: EMPTY_TEXT,
      ethPrice: EMPTY_TEXT,
      usdtPrice: EMPTY_TEXT,
      frontPrice: EMPTY_TEXT,
      sushiPrice: EMPTY_TEXT,
    });

    // Set price request interval
    reloadDashboardData();
    priceInterval.current = setInterval(reloadDashboardData, 15000);

    return () => clearInterval(priceInterval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item>
          <Paper elevation={3}>{`LUA: $${commonData.luaPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`USDC: $${commonData.usdcPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`TOMOE: $${commonData.tomoePrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`ETH: $${commonData.ethPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`USDT: $${commonData.usdtPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`FRONT: $${commonData.frontPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`SUSHI: $${commonData.sushiPrice}`}</Paper>
        </Grid>
      </Grid>
      <Box mb={4}>
        <Navbar />
      </Box>
      <Box mb={4}>
        <CommonStatistics />
      </Box>
      <Box mb={4}>
        <PoolTable />
      </Box>
    </Box>
  );
};

export default Dashboard;
