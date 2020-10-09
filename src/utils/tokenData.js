import {
  ChainId,
  Token,
  Fetcher,
  TokenAmount,
  Price,
  FACTORY_ADDRESS,
} from "@uniswap/sdk";
import { getAddress } from "@ethersproject/address";
import {} from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { PAIR_ADDRESS } from "../constants/tokens";
import luaAbi from "../contract/abi/lua.json";

const chainId = ChainId.MAINNET;
const luaAddress = "0xB1f66997A5760428D3a87D68b90BfE0aE64121cC";
const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

console.log(
  "getAddress",
  getAddress("0xB1f66997A5760428D3a87D68b90BfE0aE64121cC")
);
const contract = new Contract(PAIR_ADDRESS.LUA_USDC, luaAbi);
console.log("ContractFactory", contract.functions);

// const luaToken = new Token(chainId, luaAddress, undefined, "LUA", "LuaToken");
// const usdcToken = new Token(
//   chainId,
//   usdcAddress,
//   undefined,
//   "USDC",
//   "USD Coin"
// );

Promise.all([
  Fetcher.fetchTokenData(chainId, luaAddress, undefined, "LUA", "LuaToken"),
  Fetcher.fetchTokenData(chainId, usdcAddress, undefined, "USDC", "USD Coin"),
]).then(([luaToken, usdcToken]) => {
  console.log("Tokens", luaToken, usdcToken);
  Fetcher.fetchPairData(luaToken, usdcToken).then((pair) => {
    console.log("Pair data", pair.reserve0.toExact(), pair.reserve1.toExact());
    const price = new Price(
      luaToken,
      usdcToken,
      Math.floor(pair.reserve0.toExact()),
      Math.floor(pair.reserve1.toExact())
    );
    console.log("Price", price.toSignificant(luaToken.decimals));
  });
});
