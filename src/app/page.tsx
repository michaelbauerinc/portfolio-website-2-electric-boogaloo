// pages/index.tsx
import type { NextPage } from "next";
import Link from "next/link";
import { FiArrowRightCircle } from "react-icons/fi"; // Updated Icon
import Navbar from "../components/Navbar";
import DynamicBackground from "../components/DynamicBackground";

const Home: NextPage = () => {
  return (
    <div>
      <Navbar />
      <DynamicBackground />
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-black">Welcome to my world</h1>
          <p className="mt-4 text-2xl text-black">
            From the mind of Mike Bauer...
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
          >
            Enter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
