import React from "react";
import Image from "next/image"; // Import Image component from next/image
import BigFiveChart from "./BigFiveChart";
import { bigFiveData, options } from "./ChartConfig"; // Import your chart configuration

const ProfileSection = () => {
  return (
    <div className="bg-white bg-opacity-70 p-4 rounded-lg">
      <h1 className="text-center text-3xl font-semibold text-gray-800 py-6">
        Get To Know Me
      </h1>
      <h2 className="text-center text-xl font-semibold text-gray-800">
        &quot;Big 5&quot; Trait Personality Profile
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center mt-8">
        <div className="flex justify-center items-center w-full md:w-1/2 p-4">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
            <Image
              src="/self.jpg"
              alt="Self Photo"
              width={192}
              height={192}
              className="object-cover object-center"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <BigFiveChart data={bigFiveData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
