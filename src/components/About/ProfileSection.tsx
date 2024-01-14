import React from "react";
import BigFiveChart from "./BigFiveChart";
import { bigFiveData, options } from "./ChartConfig"; // Import your chart configuration

const ProfileSection = () => {
  return (
    <div className="bg-white bg-opacity-70 p-4 rounded-lg">
      <div className="flex flex-col md:flex-row justify-center items-center mt-8">
        <div className="w-1/2 p-4">
          <img
            src="/self.jpg"
            alt="Self Photo"
            className="rounded-full w-48 h-48 object-cover mx-auto"
          />
        </div>
        <div className="w-1/2 p-4">
          <BigFiveChart data={bigFiveData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
