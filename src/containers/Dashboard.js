import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Box } from "@material-ui/core";
import _get from "lodash.get";
import CommonStatistics from "../components/CommonStatistics";
import PoolTable from "../components/PoolTable";
import Service from "../services";
import { useDashboardData } from "../hooks/dashboard";
import { POOL_CONFIG, TOKEN_ADDRESS, TOKEN_ICON } from "../constants/tokens";
// import "../utils/tokenData";

const Dashboard = () => {
  const { commonData, setCommonData, setPools } = useDashboardData();
  const [firstTime, setFirstTime] = useState(true);
  const priceInterval = useRef(null);

  const reloadCommonData = () => {
    Promise.all([Service.getTokenPrice("LUA"), Service.getTotalSupply()]).then(
      ([luaPrice, totalSupply]) => {
        setCommonData({ luaPrice, totalSupply });
      }
    );
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

            return {
              ...row,
              ...rowConfig,
              totalStaked: valueList[rowIdx],
              apy: apyList[rowIdx],
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
    <Box>
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
