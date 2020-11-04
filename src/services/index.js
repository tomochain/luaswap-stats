import axios from "axios";
import _get from "lodash.get";
import API from "../constants/apis";
import {
  LUA_MASTER_FARM_ADDRESS,
  NUMBER_BLOCKS_PER_YEAR,
  TOKEN_ADDRESS,
} from "../constants/tokens";
import { bnToDecimals } from "../utils/number";
import BigNumber from "bignumber.js";

const route = axios.create({
  baseURL: "https://wallet.tomochain.com/api/luaswap",
});
const graphRoute = axios.create({
  baseURL: "https://api.thegraph.com/subgraphs/name/phucngh/luaswap",
});

const getTokenPrice = (token, callback) => {
  if (["USDT", "USDC"].includes(token)) {
    if (typeof callback === "function") {
      return callback(1);
    }
    return 1;
  }

  return route
    .get(`${API.GET_PRICE}/${token}`)
    .then((res) => {
      if (_get(res, "data.usdPrice")) {
        if (typeof callback === "function") {
          return callback(res.data.usdPrice);
        }
        return res.data.usdPrice;
      }
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return 0;
    });
};

const getTotalSupply = (callback) => {
  const method = "totalSupply():(uint256)";
  const cache = true;

  return route
    .post(`${API.GET_CONTRACT_DATA}/${TOKEN_ADDRESS.LUA}`, {
      method,
      cache,
      params: [],
    })
    .then((res) => {
      if (_get(res, "data.data")) {
        const convertedNumber = new BigNumber(res.data.data)
          .div(10 ** 18)
          .toNumber();
        if (typeof callback === "function") {
          return callback(convertedNumber);
        }
        return convertedNumber;
      }
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return 0;
    });
};

const getPools = (callback) => {
  return route
    .get(API.GET_POOLS)
    .then((res) => {
      if (_get(res, "data")) {
        if (typeof callback === "function") {
          return callback(res.data);
        }
        return res.data;
      }
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return [];
    });
};

const getPoolDetails = (poolId, callback) => {
  return route
    .get(`${API.GET_POOLS}/${poolId}`)
    .then((res) => {
      if (_get(res, "data")) {
        if (typeof callback === "function") {
          return callback(res.data);
        }
        return res.data;
      }
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return {};
    });
};

const getTotalStaked = (lpAddress, callback) => {
  const method = "balanceOf(address):(uint256)";
  const params = [LUA_MASTER_FARM_ADDRESS];
  const cache = true;

  return route
    .post(`${API.GET_CONTRACT_DATA}/${lpAddress}`, {
      method,
      params,
      cache,
    })
    .then((res) => {
      if (_get(res, "data.data")) {
        if (typeof callback === "function") {
          return callback(bnToDecimals(res.data.data));
        }
        return bnToDecimals(res.data.data);
      }
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return 0;
    });
};

const getPoolAPY = ({ pid, luaPrice, usdValue }, callback) => {
  const method = "getNewRewardPerBlock(uint256):(uint256)";
  const params = [pid + 1];
  const cache = true;

  return route
    .post(`${API.GET_CONTRACT_DATA}/${LUA_MASTER_FARM_ADDRESS}`, {
      method,
      params,
      cache,
    })
    .then((res) => {
      if (_get(res, "data.data")) {
        const apy =
          (luaPrice *
            10 ** 18 *
            NUMBER_BLOCKS_PER_YEAR *
            bnToDecimals(res.data.data)) /
          (usdValue * 100 ** 8);

        if (typeof callback === "function") {
          return callback(apy);
        }
        return apy;
      }
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return 0;
    });
};

const getTotalLiquidityData = (callback) => {
  const operationName = "transactions";
  const query =
    "query transactions { uniswapFactories(first: 100) { id totalLiquidityUSD totalVolumeUSD } }";
  const variables = {};

  return graphRoute
    .post("", {
      operationName,
      query,
      variables,
    })
    .then((res) => {
      const result = _get(res, "data.data.uniswapFactories", []).map(
        (item) => ({
          totalLiquidity: item.totalLiquidityUSD,
          totalVolume: item.totalVolumeUSD,
        })
      )[0];

      if (typeof callback === "function") {
        return callback(result);
      }
      return result;
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return {};
    });
};

export default {
  getTokenPrice,
  getTotalSupply,
  getPools,
  getPoolDetails,
  getTotalStaked,
  getPoolAPY,
  getTotalLiquidityData,
};
