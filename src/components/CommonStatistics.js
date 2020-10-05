import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  makeStyles,
  Box,
  Typography,
  Link,
} from "@material-ui/core";
import { reduceFractionDigit, reduceLongNumber } from "../utils/number";
import mockData from "../mockData/common.json";

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: 10,
    padding: 30,
  },
  cardImg: {
    marginRight: 30,
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 500,
    opacity: 0.9,
  },
  cardValue: {
    marginRight: 10,
    fontSize: 24,
    fontWeight: "bolder",
  },
  cardPercent: {
    fontSize: 16,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.9,
  },
  positive: {
    color: "green",
  },
  negative: {
    color: "red",
  },
}));

const CardItem = ({ imgSrc, title, valueContainer, descriptionContainer }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper elevation={2} className={classes.card}>
        <Box display="flex" alignItems="center">
          {/* <img src={imgSrc} alt={title} className={classes.cardImg} /> */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginRight="30px"
            width={70}
            height={70}
            border="1px solid"
            borderColor="blue"
            borderRadius={8}
            fontSize={32}
          >
            {"\ud83c\udf63"}
          </Box>
          <Grid
            container
            direction="column"
            spacing={1}
            style={{ width: "calc(100% - 100px)" }}
          >
            <Grid item className={classes.cardTitle}>
              {title}
            </Grid>
            <Grid item>{valueContainer}</Grid>
            <Grid item className={classes.cardDescription}>
              {descriptionContainer}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

const CommonStatistics = () => {
  const [commonData, setCommonData] = useState({});
  const classes = useStyles();

  const handleCalculateStakeRate = (staked, liquidity) => {
    return `${reduceFractionDigit((staked / liquidity) * 100, 1)}%`;
  };

  useEffect(() => {
    setCommonData({
      totalLiquidity: mockData.liquidity_amount,
      liquidityChange24h: mockData.liquidity_change_24h,
      totalStaked: mockData.staked_amount,
      stakedChange24h: mockData.staked_change_24h,
      luaPrice: mockData.lua_price,
      luaMarketCap: mockData.lua_market_cap,
    });
  }, []);

  return (
    <Grid container spacing={3} style={{ width: "100%", margin: 0 }}>
      <CardItem
        imgSrc="\ud83c\udf63"
        title="Liquidity (USD)"
        valueContainer={
          <Box display="flex" alignItems="center">
            <Typography className={classes.cardValue}>
              {`$${reduceFractionDigit(commonData.totalLiquidity)}`}
            </Typography>
            <Typography
              className={`${classes.cardPercent} ${
                (commonData.liquidityChange24h > 0 && classes.positive) ||
                (commonData.liquidityChange24h < 0 && classes.negative) ||
                ""
              }`}
            >
              {`${
                (commonData.liquidityChange24h > 0 && "+") ||
                (commonData.liquidityChange24h < 0 && "-") ||
                ""
              }${
                reduceFractionDigit(commonData.liquidityChange24h, 1) || "0.0"
              }%`}
            </Typography>
          </Box>
        }
        descriptionContainer={
          <Box display="flex" alignItems="center">
            <span style={{ marginRight: 5 }}>{`See `}</span>
            <Link href="luaswap.org">{"LuaSwap.org"}</Link>
          </Box>
        }
      />
      <CardItem
        imgSrc="\ud83c\udf63"
        title="Total Value Staked (USD)"
        valueContainer={
          <Box display="flex" alignItems="center">
            <Typography className={classes.cardValue}>
              {`$${reduceFractionDigit(commonData.totalStaked)}`}
            </Typography>
            <Typography
              className={`${classes.cardPercent} ${
                (commonData.liquidityChange24h > 0 && classes.positive) ||
                (commonData.liquidityChange24h < 0 && classes.negative) ||
                ""
              }`}
            >
              {`${
                (commonData.stakedChange24h > 0 && "+") ||
                (commonData.stakedChange24h < 0 && "-") ||
                ""
              }${reduceFractionDigit(commonData.stakedChange24h, 1) || "0.0"}%`}
            </Typography>
          </Box>
        }
        descriptionContainer={`${handleCalculateStakeRate(
          commonData.totalStaked,
          commonData.totalLiquidity
        )} of Liquidity`}
      />
      <CardItem
        imgSrc="\ud83c\udf63"
        title="The LUA Token"
        valueContainer={
          <Box display="flex" alignItems="center">
            <Typography className={classes.cardValue}>
              {`$${reduceFractionDigit(commonData.luaPrice, 2)}`}
            </Typography>
          </Box>
        }
        descriptionContainer={`Market Cap / $${reduceLongNumber(
          commonData.luaMarketCap
        )}`}
      />
    </Grid>
  );
};

export default CommonStatistics;
