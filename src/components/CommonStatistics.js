import React, { useCallback } from "react";
import {
  Grid,
  Paper,
  makeStyles,
  Box,
  Typography,
  Link,
} from "@material-ui/core";
import { reduceFractionDigit, reduceLongNumber } from "../utils/number";
import { useDashboardData } from "../hooks/dashboard";
import { TOKEN_ICON } from "../constants/tokens";
import totalLiquidityIcon from "../assets/images/total-liquidity.svg";
import totalStakedIcon from "../assets/images/total-staked.svg";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 30,
    borderRadius: 10,
    backgroundColor: theme.palette.secondary.light,
    color: "white",
  },
  cardPreview: {
    marginRight: 30,
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 500,
    opacity: 0.9,
  },
  cardValue: {
    marginRight: 10,
    color: theme.palette.primary.main,
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
  primaryBg: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const CardItem = ({
  displayPreview,
  title,
  valueContainer,
  descriptionContainer,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper elevation={2} className={classes.card}>
        <Box display="flex" alignItems="center">
          {/* <img src={imgSrc} alt={title} className={classes.cardImg} /> */}
          <Box className={classes.cardPreview}>{displayPreview}</Box>
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
  const { commonData, pools } = useDashboardData();
  const classes = useStyles();

  const handleCalculateStakeRate = (staked, liquidity) => {
    return `${reduceFractionDigit((staked / liquidity) * 100 || 0, 1)}%`;
  };

  const getTotalStakedValue = useCallback(() => {
    let result = 0;
    pools.forEach((item) => {
      result += item.usdValue;
    });

    return result;
  }, [pools]);

  return (
    <Grid container spacing={3} style={{ width: "100%", margin: 0 }}>
      {/* <CardItem
        displayPreview={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            className={classes.primaryBg}
          >
            <img
              alt=""
              src={totalLiquidityIcon}
              style={{ width: 40, height: 40 }}
            />
          </Box>
        }
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
      /> */}
      <CardItem
        displayPreview={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            className={classes.primaryBg}
          >
            <img
              alt=""
              src={totalStakedIcon}
              style={{ width: 40, height: 40 }}
            />
          </Box>
        }
        title="Total Value Staked (USD)"
        valueContainer={
          <Box display="flex" alignItems="center">
            <Typography className={classes.cardValue}>
              {`$${reduceFractionDigit(getTotalStakedValue())}`}
            </Typography>
          </Box>
        }
        descriptionContainer={`${handleCalculateStakeRate(
          commonData.totalStaked,
          commonData.totalLiquidity
        )} of Liquidity`}
      />
      <CardItem
        displayPreview={
          <img
            alt="LUA"
            src={TOKEN_ICON.LUA}
            style={{ width: "100%", height: "100%" }}
          />
        }
        title="The LUA Token"
        valueContainer={
          <Box display="flex" alignItems="center">
            <Typography className={classes.cardValue}>
              {`$${reduceFractionDigit(commonData.luaPrice, 3)}`}
            </Typography>
          </Box>
        }
        descriptionContainer={`Total Supply: ${reduceLongNumber(
          commonData.totalSupply
        )} LUA`}
      />
    </Grid>
  );
};

export default CommonStatistics;
