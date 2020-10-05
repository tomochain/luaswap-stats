import { ChainId, Token, Fetcher } from "@uniswap/sdk";

const chainId = ChainId.MAINNET;
const tokenAddress = "0xB1f66997A5760428D3a87D68b90BfE0aE64121cC";
let LUA = null;

console.log("chainId", chainId);

try {
  LUA = new Token(chainId, tokenAddress, 18);
} catch (err) {
  console.error("[ERROR]", err);
}
console.log("LUA", LUA);

Fetcher.fetchTokenData(chainId, tokenAddress).then((decimals) => {
  console.log("fetchTokenData", decimals);
});

export { LUA };
