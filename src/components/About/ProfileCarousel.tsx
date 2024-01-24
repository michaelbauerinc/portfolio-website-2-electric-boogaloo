import React, { useState, useEffect } from "react";
import { iconsAndTitles } from "../lib/Static";

const ProfileCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % iconsAndTitles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getIconAndTitleForCarousel = (carouselNumber: number) => {
    const index = (currentIndex + carouselNumber) % iconsAndTitles.length;
    return iconsAndTitles[index];
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-8 py-20">
      {Array.from({ length: 3 }).map((_, i) => {
        const iconAndTitle = getIconAndTitleForCarousel(i);
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-center text-white" // Adjusted for responsive design
          >
            <span className="text-4xl">{iconAndTitle.icon}</span>
            <p className="text-sm mt-2">{iconAndTitle.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileCarousel;
