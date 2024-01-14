// src/pages/about.tsx
// import React from "react";
import Navbar from "../components/Navbar";
import "../app/globals.css";
import type { NextPage } from "next";
import ProfileCarousel from "../components/about/ProfileCarousel";
import ProfileSection from "../components/about/ProfileSection";
import TextSection from "../components/about/TextSection";

const About: NextPage = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 mx-auto p-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 py-10">
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
