import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Box,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
} from "@material-ui/core";
import _get from "lodash.get";
import { Help as HelpIcon } from "@material-ui/icons";
import POOL_LIST from "../mockData/pools.json";
import { reduceFractionDigit } from "../utils/number.js";

const useStyles = makeStyles(() => ({
  chip: {
    marginRight: 5,
  },
  tableHeader: {
    marginRight: 10,
    color: "gray",
    fontSize: 14,
    fontWeight: 600,
  },
  tableCell: {
    // display: "flex",
    // alignItems: "center",
    minHeight: 200,
  },
  positive: {
    color: "green",
  },
  negative: {
    color: "red",
  },
}));

const TABLE_COL_WIDTH = [300, 150, 200, 200, 90, 90];

const PoolRow = ({ row, key }) => {
  const classes = useStyles();
  const currentBal = row.balance || 0;
  const yesterdayBal = _get(row, "history.dayAgo.balance", 1);
  const balanceChangeRate = (currentBal / yesterdayBal) * 100 - 100;

  return (
    <TableRow key={key}>
      <TableCell className={classes.tableCell}>
        <Box display="flex" alignItems="stretch">
          <Typography style={{ marginRight: 20, fontSize: 32 }}>
            {row.icon}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography
              component="span"
              style={{ fontWeight: 600, fontSize: 14 }}
            >
              {row.name}
            </Typography>
            <Typography
              component="span"
              style={{ color: "gray", fontSize: 14 }}
            >
              {`${row.company} ${row.swapPair.name}`}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <Box display="flex" alignItems="stretch">
          <Typography style={{ fontSize: 15, fontWeight: 500 }}>
            {`${reduceFractionDigit(row.balance, 4)} LP`}
          </Typography>
        </Box>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <Typography style={{ marginRight: 10, fontSize: 16 }}>
              {row.icon}
            </Typography>
            <Typography style={{ fontSize: 14 }}>
              {`${reduceFractionDigit(row.swapPair.reserve0, 2)} ${
                row.swapPair.token0.symbol
              }`}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography style={{ marginRight: 10, fontSize: 16 }}>
              {row.icon}
            </Typography>
            <Typography style={{ fontSize: 14 }}>
              {`${reduceFractionDigit(row.swapPair.reserve1, 2)} ${
                row.swapPair.token1.symbol
              }`}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="baseline">
            <Typography
              component="span"
              style={{ marginRight: 5, fontSize: 16 }}
            >
              {`$${reduceFractionDigit(row.balanceUSD)}`}
            </Typography>
            <Typography
              component="span"
              className={
                (balanceChangeRate > 0 && classes.positive) ||
                (balanceChangeRate < 0 && classes.negative) ||
                ""
              }
              style={{ fontSize: 14 }}
            >
              {`(${(balanceChangeRate > 0 && "+") || ""}${reduceFractionDigit(
                balanceChangeRate,
                1
              )}%)`}
            </Typography>
          </Box>
          <Typography component="span" style={{ color: "gray", fontSize: 14 }}>
            {`11,6% of total`}
          </Typography>
        </Box>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <Box display="flex" alignItems="stretch" mb={1}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginRight="10px"
            width={40}
            height={40}
            border="1px solid"
            borderColor="red"
            borderRadius={5}
            fontSize={20}
          >
            {row.icon}
          </Box>
          <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography style={{ fontSize: 15 }}>{"2.65"}</Typography>
            <Typography style={{ color: "gray", fontSize: 14 }}>
              {"LUA/day"}
            </Typography>
          </Box>
        </Box>
        <Tooltip
          title={
            <>
              <Typography style={{ fontSize: 15 }}>
                {`This pool receives ${reduceFractionDigit(
                  row.rewards.multiplier,
                  1
                )}x of the base reward.`}
              </Typography>
              <Typography style={{ fontSize: 15 }}>
                {`Shown yield already includes that.`}
              </Typography>
            </>
          }
        >
          <Chip
            label={`${reduceFractionDigit(row.rewards.multiplier, 1)}x Reward`}
            onDelete={() => {}}
            deleteIcon={<HelpIcon />}
            size="small"
            style={{
              backgroundColor: "rgb(0,255,0,0.2)",
              color: "green",
              fontSize: 12,
            }}
          />
        </Tooltip>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography style={{ fontSize: 16 }}>
            {`${reduceFractionDigit(
              row.rewards.hourlyROI * 24 * 100,
              2
            )}% daily`}
          </Typography>
          <Typography style={{ color: "gray", fontSize: 14 }}>
            {`${reduceFractionDigit(
              row.rewards.hourlyROI * 720 * 100,
              2
            )}% monthly`}
          </Typography>
          <Typography style={{ color: "gray", fontSize: 14 }}>
            {`${reduceFractionDigit(
              row.rewards.hourlyROI * 8760 * 100,
              2
            )}% yearly`}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const PoolTable = () => {
  const [pools, setPools] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setPools(POOL_LIST);
  });

  return (
    <>
      <Typography
        variant="h4"
        style={{ marginBottom: 30, fontWeight: "bolder" }}
      >
        {"LuaSwap/Farms"}
      </Typography>
      <Box display="flex" alignItems="center" mb={4}>
        <Chip size="small" label="YIELD PER $1,000" className={classes.chip} />
        <Typography>
          {"is amount of LUA rewarded per day for a $1,000 investment"}
        </Typography>
      </Box>
      <Paper elevation={2} style={{ overflowY: "auto" }}>
        <Table aria-label="Pool table">
          <TableHead>
            <TableRow>
              <TableCell width={TABLE_COL_WIDTH[0]}>
                <Typography className={classes.tableHeader}>FARM</Typography>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[1]}>
                <Typography className={classes.tableHeader}>STAKED</Typography>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[2]}>
                <Typography className={classes.tableHeader}>
                  UNDERLYING TOKENS
                </Typography>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[3]}>
                <Box display="flex" alignItems="baseline">
                  <Typography className={classes.tableHeader}>
                    TOTAL VALUE LOCKED
                  </Typography>
                  <Typography
                    style={{ color: "gray", fontSize: 13, opacity: 0.8 }}
                  >
                    (24H)
                  </Typography>
                </Box>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[4]}>
                <Typography className={classes.tableHeader}>
                  YIELD PER $1,000
                </Typography>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[5]}>
                <Typography className={classes.tableHeader}>ROI</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pools.map((row, rowIdx) => {
              return <PoolRow key={rowIdx + 1} row={row} />;
            })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default PoolTable;
