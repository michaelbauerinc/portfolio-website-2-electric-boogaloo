import React from "react";
import { Radar } from "react-chartjs-2";
import "chart.js/auto";

// Define the structure of your data and options objects
interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }>;
}

interface ChartOptions {
  // Define the structure of the options object
  // For example:
  scales: {
    r: {
      angleLines: {
        display: boolean;
      };
      suggestedMin: number;
      suggestedMax: number;
    };
  };
}

interface BigFiveChartProps {
  data: ChartData;
  options: ChartOptions;
}

const BigFiveChart: React.FC<BigFiveChartProps> = ({ data, options }) => {
  return <Radar data={data} options={options} />;
};

export default BigFiveChart;
