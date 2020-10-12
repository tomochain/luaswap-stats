import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Box, Grid, Paper } from "@material-ui/core";
import CommonStatistics from "../components/CommonStatistics";
import PoolTable from "../components/PoolTable";
import "../utils/tokenData";
import Service from "../services";

const Dashboard = () => {
  const [prices, setPrices] = useState({});

  const handleRequestPrice = (token) => {
    return Service.getTokenPrice(token);
  };

  useEffect(() => {
    const reloadPrices = () => {
      Promise.all([
        handleRequestPrice("LUA"),
        handleRequestPrice("USDC"),
        handleRequestPrice("TOMOE"),
        handleRequestPrice("ETH"),
        handleRequestPrice("USDT"),
        handleRequestPrice("FRONT"),
        handleRequestPrice("SUSHI"),
      ]).then(
        ([
          luaPrice,
          usdcPrice,
          tomoePrice,
          ethPrice,
          usdtPrice,
          frontPrice,
          sushiPrice,
        ]) => {
          setPrices({
            luaPrice: luaPrice.usdPrice,
            usdcPrice: usdcPrice.usdPrice,
            tomoePrice: tomoePrice.usdPrice,
            ethPrice: ethPrice.usdPrice,
            usdtPrice: usdtPrice.usdPrice,
            frontPrice: frontPrice.usdPrice,
            sushiPrice: sushiPrice.usdPrice,
          });
        }
      );
    };
    reloadPrices();
    const priceInterval = setInterval(() => {
      reloadPrices();
    }, 1000);

    return clearInterval(priceInterval);
  }, []);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item>
          <Paper elevation={3}>{`LUA: $${prices.luaPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`USDC: $${prices.usdcPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`TOMOE: $${prices.tomoePrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`ETH: $${prices.ethPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`USDT: $${prices.usdtPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`FRONT: $${prices.frontPrice}`}</Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>{`SUSHI: $${prices.sushiPrice}`}</Paper>
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
