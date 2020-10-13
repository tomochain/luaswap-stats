import axios from "axios";
import _get from "lodash.get";
import API from "../constants/apis";

const route = axios.create({
  baseURL: "https://wallet.tomochain.com/api/luaswap",
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

export default {
  getTokenPrice,
  getPools,
  getPoolDetails,
};
