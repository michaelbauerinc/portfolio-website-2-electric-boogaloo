"use client";

import React, { useEffect, useState } from "react";
// Function to generate random Tailwind classes for size and color
const generateRandomClasses = (): string => {
  const sizes = ["w-6 h-6", "w-12 h-12", "w-16 h-16", "w-24 h-24"];
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  const size = sizes[Math.floor(Math.random() * sizes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return `${size} ${color} animate-pulse`;
};

interface AnimatedElementProps {
  onEnd: () => void;
}

// Component for individual animated elements
const AnimatedElement: React.FC<AnimatedElementProps> = ({ onEnd }) => {
  const randomClasses = generateRandomClasses();

  useEffect(() => {
    const duration = Math.random() * 5000 + 5000; // Random duration between 5 to 10 seconds
    const timeout = setTimeout(onEnd, duration);

    return () => clearTimeout(timeout);
  }, [onEnd]);

  return (
    <div
      className={`absolute ${randomClasses}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    ></div>
  );
};

interface DynamicBackgroundProps {
  creationInterval?: number;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  creationInterval = 100,
}) => {
  const [elements, setElements] = useState<JSX.Element[]>([]);

  // Function to add a new element
  const addElement = (): void => {
    setElements((prevElements) => [
      ...prevElements,
      <AnimatedElement key={Math.random()} onEnd={removeElement} />,
    ]);
  };

  // Function to remove an element
  const removeElement = (): void => {
    setElements((prevElements) => prevElements.slice(1));
  };

  useEffect(() => {
    addElement(); // Add the first element on mount
    const interval = setInterval(addElement, creationInterval); // Add a new element at the specified interval

    return () => clearInterval(interval);
  }, [creationInterval]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {elements}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: `rgba(var(--background-start-rgb), 0.8)`, // Updated line for dynamic theme-based background
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

export default DynamicBackground;
