import { useState, createContext, useEffect, useRef } from "react";

export const DashboardContext = createContext({});

const DashboardProvider = ({ children }) => {
  const [commonData, setCommonData] = useState({});
  const [pools, setPools] = useState([]);
  const priceInterval = useRef(null);

  const handleRequestPrice = (token) => {
    return Service.getTokenPrice(token);
  };

  useEffect(() => {
    const getPrices = () => {
      Promise.all([
        handleRequestPrice("LUA"),
        handleRequestPrice("USDC"),
        handleRequestPrice("TOMOE"),
        handleRequestPrice("ETH"),
        handleRequestPrice("USDT"),
        handleRequestPrice("FRONT"),
        handleRequestPrice("SUSHI"),
      ]).then(
        ([
          luaPrice,
          usdcPrice,
          tomoePrice,
          ethPrice,
          usdtPrice,
          frontPrice,
          sushiPrice,
        ]) => {
          setCommonData((data) => ({
            ...data,
            luaPrice,
            usdcPrice,
            tomoePrice,
            ethPrice,
            usdtPrice,
            frontPrice,
            sushiPrice,
          }));
        }
      );
    };
    getPrices();
    priceInterval.current = setInterval(getPrices, 3000);

    return clearInterval(priceInterval.current);
  });

  return (
    <DashboardContext.Provider
      value={{
        commonData,
        pools,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
