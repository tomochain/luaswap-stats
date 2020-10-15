import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const DashboardContext = createContext({});

const DashboardProvider = ({ children }) => {
  const [commonData, setCommonData] = useState({});
  const [pools, setPools] = useState([]);

  const mergeCommonData = (newData) => {
    setCommonData((oldData) => ({
      ...oldData,
      ...newData,
    }));
  };

  useEffect(() => {
    if (pools.length > 0) {
      let allStaked = 0;
      pools.forEach((item) => {
        allStaked += item.totalToken2Value;
      });
      mergeCommonData({
        allStaked,
      });
    }
  }, [pools]);

  return (
    <DashboardContext.Provider
      value={{
        commonData,
        pools,
        setCommonData: mergeCommonData,
        setPools,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
