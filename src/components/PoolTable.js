import React from "react";
import {
  makeStyles,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { useDashboardData } from "../hooks/dashboard.js";
import { reduceFractionDigit } from "../utils/number.js";
import { ArrowRightAlt as ArrowRightAltIcon } from "@material-ui/icons";

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
  iconSwapRight: {
    animation: "swappingRight 5s linear infinite",
  },
  iconSwapLeft: {
    animation: "swappingLeft 5s linear infinite",
  },
}));

const TABLE_COL_WIDTH = ["10%", "15%", "45%", "15%", "15%"];

const PoolRow = ({ row }) => {
  const commonData = useDashboardData((store) => store.commonData);
  const classes = useStyles();

  return (
    row && (
      <TableRow>
        <TableCell className={classes.tableCell}>
          <Box display="flex" alignItems="center">
            <Tooltip title={row.token1Symbol}>
              <img
                alt={row.token1Symbol}
                src={row.token1Icon}
                className={classes.iconSwapRight}
                style={{ margin: "0px 7px 0px 0px", width: 30, height: 30 }}
              />
            </Tooltip>
            <Tooltip title={row.token2Symbol}>
              <img
                alt={row.token2Symbol}
                src={row.token2Icon}
                className={classes.iconSwapLeft}
                style={{ margin: "0px 0px 0px 7px", width: 30, height: 30 }}
              />
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Typography style={{ fontSize: 15, fontWeight: 600 }}>
            {`${reduceFractionDigit(row.apy, 1)}%`}
          </Typography>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Box display="flex" alignItems="center" mb={1}>
            <Tooltip title={row.token1Symbol}>
              <img
                alt={row.token1Symbol}
                src={row.token1Icon}
                style={{ marginRight: 5, width: 15, height: 15 }}
              />
            </Tooltip>
            <Typography style={{ fontSize: 13 }}>
              {`${reduceFractionDigit(row.tokenAmount, 3)} ${
                row.token1Symbol || ""
              }`}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Tooltip title={row.token2Symbol}>
              <img
                alt={row.token2Symbol}
                src={row.token2Icon}
                style={{ marginRight: 5, width: 15, height: 15 }}
              />
            </Tooltip>
            <Typography style={{ fontSize: 13 }}>
              {`${reduceFractionDigit(row.token2Amount, 3)} ${
                row.token2Symbol || ""
              }`}
            </Typography>
          </Box>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <ArrowRightAltIcon />
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Typography
            component="span"
            style={{ fontSize: 15, fontWeight: 600 }}
          >
            {`$${reduceFractionDigit(row.totalStaked, 3)}`}
          </Typography>
          <Typography component="span" style={{ fontSize: 11 }}>
            {` ${row.poolSymbol || ""}`}
          </Typography>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Typography style={{ marginBottom: 5, fontSize: 15 }}>
            {`$${reduceFractionDigit(row.usdValue, 0)}`}
          </Typography>
          <Typography style={{ color: "grey", fontSize: 12 }}>
            {`${reduceFractionDigit(
              (row.usdValue / commonData.allStaked) * 100,
              1
            )}% of total`}
          </Typography>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Box mb={1}>
            <Typography
              component="span"
              style={{ marginRight: 5, fontSize: 15, fontWeight: 600 }}
            >
              {reduceFractionDigit(row.newRewardPerBlock, 2)}
            </Typography>
            <Typography component="span" style={{ fontSize: 11 }}>
              {"LUA"}
            </Typography>
          </Box>
          <Typography style={{ fontSize: 11 }}>
            {`~ $${reduceFractionDigit(
              Number(row.newRewardPerBlock) * commonData.luaPrice,
              2
            )}`}
          </Typography>
        </TableCell>
      </TableRow>
    )
  );
};

const PoolTable = () => {
  const pools = useDashboardData((store) => store.pools);
  const classes = useStyles();

  return (
    <>
      <Typography
        variant="h4"
        style={{ marginBottom: 30, fontWeight: "bolder" }}
      >
        {"LuaSwap/Farms"}
      </Typography>
      <Paper elevation={2} style={{ overflowY: "auto" }}>
        <Table aria-label="Pool table">
          <TableHead>
            <TableRow>
              <TableCell width={TABLE_COL_WIDTH[0]}>
                <Typography className={classes.tableHeader}>FARM</Typography>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[1]}>
                <Typography className={classes.tableHeader}>APY</Typography>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[2]} colSpan={3}>
                <Typography className={classes.tableHeader}>
                  TOTAL VALUE STAKED
                </Typography>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[3]}>
                <Box display="flex" alignItems="baseline">
                  <Typography className={classes.tableHeader}>
                    TOTAL VALUE LOCKED
                  </Typography>
                </Box>
              </TableCell>
              <TableCell width={TABLE_COL_WIDTH[4]}>
                <Typography className={classes.tableHeader}>
                  REWARD / BLOCK
                </Typography>
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
