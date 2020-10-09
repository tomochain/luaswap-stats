import React from "react";
import Navbar from "../components/Navbar";
import { Box } from "@material-ui/core";
import CommonStatistics from "../components/CommonStatistics";
import PoolTable from "../components/PoolTable";
import "../utils/tokenData";

const Dashboard = () => {
  return (
    <Box>
      <Box mb={4}>
        <Navbar />
      </Box>
      <Box mb={4}>
        <CommonStatistics />
      </Box>
      <Box mb={4}>
        <PoolTable />
      </Box>
    </Box>
  );
};

export default Dashboard;
