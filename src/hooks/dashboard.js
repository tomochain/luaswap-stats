import { useContext } from "react";
import { DashboardContext } from "../contexts/dashboard";

export const useDashboardData = (getCustomData) => {
  const dashboardData = useContext(DashboardContext);

  return typeof getCustomData === "function"
    ? getCustomData(dashboardData)
    : dashboardData;
};
