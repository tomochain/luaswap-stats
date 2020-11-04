import React, { useState } from "react";
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
  TableContainer,
  CircularProgress,
  Link,
} from "@material-ui/core";
import {
  ArrowRightAlt as ArrowRightAltIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from "@material-ui/icons";
import _orderBy from "lodash.orderby";
import { useDashboardData } from "../hooks/dashboard.js";
import { reduceFractionDigit } from "../utils/number.js";

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: 5,
  },
  tableContainer: {
    borderRadius: 8,
  },
  table: {
    backgroundColor: theme.palette.secondary.light,
  },
  tableHeader: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
  sortable: {
    cursor: "pointer",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 600,
  },
  tableRow: {
    cursor: "pointer",
  },
  tableCell: {
    minHeight: 200,
    borderColor: theme.palette.secondary.main,
    color: "white",
  },
  positive: {
    color: "green",
  },
  negative: {
    color: "red",
  },
  // iconSwapRight: {
  //   animation: "swappingRight 5s linear infinite",
  // },
  // iconSwapLeft: {
  //   animation: "swappingLeft 5s linear infinite",
  // },
  redirectBtn: {
    marginLeft: 10,
    fontSize: 12,
    wordBreak: "keep-all",
  },
  redirectIcon: {
    width: 15,
    height: 15,
    color: theme.palette.primary.main,
  },
  sortIcon: {
    marginLeft: 10,
    fontSize: 20,
  },
}));

const TABLE_COL_WIDTH = ["15%", "10%", "45%", "15%", "15%"];
const TABLE_COL_MIN_WIDTH = [150, 70, 500, 100, 100];

const LoadingRow = () => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell colSpan={7} className={classes.tableCell}>
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress color="primary" size={70} thickness={3} />
        </Box>
      </TableCell>
    </TableRow>
  );
};

const PoolRow = ({ row }) => {
  const commonData = useDashboardData((store) => store.commonData);
  const classes = useStyles();

  const handleForwardToPool = ({ poolSymbol }, event) => {
    event.preventDefault();
    // const link = document.createElement("a");
    // link.href = `https://luaswap.org/#/farms/${poolSymbol}`;
    // link.target = "_blank";
    // document.body.appendChild(link);
    // link.click();
    // document.body.remove(link);
    window.open(`https://luaswap.org/#/farms/${poolSymbol}`, "_blank").focus();
  };

  return (
    row && (
      <TableRow className={classes.tableRow}>
        <TableCell className={classes.tableCell}>
          <Box display="flex" alignItems="center">
            <Tooltip title={row.token1Symbol}>
              <img
                alt={row.token1Symbol}
                src={row.token1Icon}
                style={{ margin: 0, width: 30, height: 30 }}
              />
            </Tooltip>
            <Tooltip title={row.token2Symbol}>
              <img
                alt={row.token2Symbol}
                src={row.token2Icon}
                style={{ marginLeft: -10, width: 30, height: 30 }}
              />
            </Tooltip>
            <Tooltip title={`Open ${row.poolSymbolShort} farm`}>
              <Link
                variant="nav"
                onClick={(event) => handleForwardToPool(row, event)}
                className={classes.redirectBtn}
              >
                {row.poolSymbolShort}
              </Link>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Typography style={{ fontSize: 15, fontWeight: 600 }}>
            {`${reduceFractionDigit(row.apy, 2)}%`}
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
            {`${reduceFractionDigit(row.totalStaked, 3)}`}
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
  const [sortData, setSortData] = useState({});
  const pools = useDashboardData((store) => store.pools);
  const classes = useStyles();

  const getSortedPools = (pools, sortData) => {
    const sortingCols = Object.keys(sortData);

    if (sortingCols.length) {
      return _orderBy(pools, sortingCols, Object.values(sortData));
    }

    return pools;
  };

  const handleSort = (name) => {
    setSortData((oldData) => ({
      [name]: oldData[name] === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <>
      <Typography
        variant="h5"
        style={{ marginBottom: 30, fontWeight: "bolder" }}
      >
        {"LuaSwap / Farms"}
      </Typography>
      <TableContainer
        component={Paper}
        elevation={2}
        className={classes.tableContainer}
      >
        <Table aria-label="Pool table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                width={TABLE_COL_WIDTH[0]}
                style={{ minWidth: TABLE_COL_MIN_WIDTH[0] }}
                className={classes.tableHeader}
              >
                <Typography className={classes.tableHeaderText}>
                  FARM
                </Typography>
              </TableCell>
              <TableCell
                onClick={() => handleSort("apy")}
                width={TABLE_COL_WIDTH[1]}
                style={{ minWidth: TABLE_COL_MIN_WIDTH[1] }}
                className={`${classes.tableHeader} ${classes.sortable}`}
              >
                <Box display="flex" alignItems="center">
                  <Typography className={classes.tableHeaderText}>
                    APY
                  </Typography>
                  {sortData.apy &&
                    (sortData.apy === "asc" ? (
                      <ArrowDropDownIcon className={classes.sortIcon} />
                    ) : (
                      <ArrowDropUpIcon className={classes.sortIcon} />
                    ))}
                </Box>
              </TableCell>
              <TableCell
                width={TABLE_COL_WIDTH[2]}
                colSpan={3}
                style={{ minWidth: TABLE_COL_MIN_WIDTH[2] }}
                className={classes.tableHeader}
              >
                <Typography className={classes.tableHeaderText}>
                  TOTAL VALUE STAKED
                </Typography>
              </TableCell>
              <TableCell
                onClick={() => handleSort("usdValue")}
                width={TABLE_COL_WIDTH[3]}
                style={{ minWidth: TABLE_COL_MIN_WIDTH[3] }}
                className={`${classes.tableHeader} ${classes.sortable}`}
              >
                <Box display="flex" alignItems="center">
                  <Typography className={classes.tableHeaderText}>
                    TOTAL VALUE LOCKED
                  </Typography>
                  {sortData.usdValue &&
                    (sortData.usdValue === "asc" ? (
                      <ArrowDropDownIcon className={classes.sortIcon} />
                    ) : (
                      <ArrowDropUpIcon className={classes.sortIcon} />
                    ))}
                </Box>
              </TableCell>
              <TableCell
                width={TABLE_COL_WIDTH[4]}
                style={{ minWidth: TABLE_COL_MIN_WIDTH[4] }}
                className={classes.tableHeader}
              >
                <Typography className={classes.tableHeaderText}>
                  REWARD / BLOCK
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pools.length > 0 ? (
              getSortedPools(pools, sortData).map((row, rowIdx) => {
                return <PoolRow key={rowIdx + 1} row={row} />;
              })
            ) : (
              <LoadingRow />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PoolTable;
