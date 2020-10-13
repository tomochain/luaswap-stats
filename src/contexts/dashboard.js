import React from "react";
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
