import React from "react";
import { Radar } from "react-chartjs-2";
import "chart.js/auto";

const BigFiveChart = ({ data, options }) => {
  return <Radar data={data} options={options} />;
};

export default BigFiveChart;
