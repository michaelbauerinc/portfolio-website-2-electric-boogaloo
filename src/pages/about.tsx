// src/pages/about.tsx
// import React from "react";
import Navbar from "../components/common/Navbar";
import "../app/globals.css";
import type { NextPage } from "next";
import ProfileCarousel from "../components/about/ProfileCarousel";
import ProfileSection from "../components/about/ProfileSection";
import TextSection from "../components/about/TextSection";
import IconsBackground from "../components/common/IconsBackground";

const About: NextPage = () => {
  return (
    <div>
      <Navbar />
      <IconsBackground />
      <div className="bg-purple-600/50 backdrop-blur-md rounded-xl p-8 mx-8 my-4 shadow-lg text-black">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 py-10 text-yellow-300">
            About Me - Michael Bauer
          </h1>
          <TextSection />
          <ProfileCarousel />
        </div>
        <ProfileSection />
      </div>
    </div>
  );
};

export default About;
