import axios from "axios";
import API from "../constants/apis";

const route = axios.create({
  baseURL: "https://wallet.tomochain.com/api/luaswap",
});

const getTokenPrice = (token, callback) => {
  if (["USDT", "USDC"].includes(token)) {
    if (callback) {
      return callback({
        usdPrice: 1,
      });
    }
    return {
      usdPrice: 1,
    };
  }

  return route
    .get(`${API.GET_PRICE}/${token}`)
    .then((res) => {
      if (res.data) {
        if (callback) {
          return callback(res.data);
        }
        return res.data;
      }
    })
    .catch((err) => {
      console.error("[ERROR]:", err);
      return {
        usdPrice: 0,
      };
    });
};

export default {
  getTokenPrice,
};
