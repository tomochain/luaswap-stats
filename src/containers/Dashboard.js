import React, { useEffect, useRef, useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import _get from "lodash.get";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import CommonStatistics from "../components/CommonStatistics";
import PoolTable from "../components/PoolTable";
import Service from "../services";
import { useDashboardData } from "../hooks/dashboard";
import { POOL_CONFIG, TOKEN_ADDRESS, TOKEN_ICON } from "../constants/tokens";
// import "../utils/tokenData";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

const Dashboard = () => {
  const { commonData, setCommonData, setPools } = useDashboardData();
  const [firstTime, setFirstTime] = useState(true);
  const priceInterval = useRef(null);
  const classes = useStyles();

  const reloadCommonData = () => {
    // Get token prices
    Promise.all([
      Service.getTokenPrice("LUA"),
      Service.getTokenPrice("USDC"),
      Service.getTokenPrice("TOMOE"),
      Service.getTokenPrice("ETH"),
      Service.getTokenPrice("USDT"),
      Service.getTokenPrice("FRONT"),
      Service.getTokenPrice("SUSHI"),
      Service.getTokenPrice("SRM"),
      Service.getTokenPrice("FTT"),
      Service.getTokenPrice("KAI"),
      Service.getTokenPrice("OM"),
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

    // Get total supply
    Service.getTotalSupply().then((totalSupply) => {
      setCommonData({ totalSupply });
    });
  };

  const reloadDashboardData = (data) => {
    // Request pool list
    Service.getPools()
      .then((newPools) => {
        const stakedRequests = newPools.map((row) => {
          const poolAddress = _get(
            POOL_CONFIG.find((item) => item.pid === row.pid),
            "poolAddress"
          );

          return Service.getTotalStaked(poolAddress);
        });
        const apyRequests = newPools.map((row) => {
          return Service.getPoolAPY({
            pid: row.pid,
            luaPrice: data.luaPrice,
            usdValue: row.usdValue,
          });
        });

        return Promise.all([
          Promise.all(stakedRequests),
          Promise.all(apyRequests),
        ]).then(([valueList, apyList]) => {
          return newPools.map((row, rowIdx) => {
            const rowConfig =
              POOL_CONFIG.find((item) => item.pid === row.pid) || {};
            const totalLiquidity =
              _get(
                commonData,
                [`${_get(rowConfig, "token1Symbol", "").toLowerCase()}Price`],
                0
              ) *
                row.tokenAmount +
              _get(
                commonData,
                [`${_get(rowConfig, "token2Symbol", "").toLowerCase()}Price`],
                0
              ) *
                row.token2Amount;

            return {
              ...row,
              ...rowConfig,
              totalStaked: valueList[rowIdx],
              apy: apyList[rowIdx],
              totalLiquidity,
            };
          });
        });
      })
      .then((newPools) => {
        const updatedPools = newPools.map((row) => ({
          ...row,
          token1Address: TOKEN_ADDRESS[row.token1Symbol] || "",
          token2Address: TOKEN_ADDRESS[row.token2Symbol] || "",
          token1Icon: TOKEN_ICON[row.token1Symbol] || "",
          token2Icon: TOKEN_ICON[row.token2Symbol] || "",
        }));
        setPools(updatedPools);
      });
  };

  useEffect(() => {
    // Initialize common data
    reloadCommonData();

    return () => clearInterval(priceInterval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstTime && commonData && commonData.luaPrice) {
      setFirstTime(false);
      reloadDashboardData(commonData);
      // Set price request interval
      priceInterval.current = setInterval(
        () => reloadDashboardData(commonData),
        60000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstTime, commonData]);

  return (
    <>
      <Helmet>
        <title>LuaSwap Board</title>
      </Helmet>
      <Box className={classes.root}>
        <Navbar />
        <Box mt={15} mb={4}>
          <CommonStatistics />
        </Box>
        <Box mb={4} p={2}>
          <PoolTable />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
