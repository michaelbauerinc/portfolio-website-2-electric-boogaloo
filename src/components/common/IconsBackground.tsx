import React, { useEffect, useState, useRef } from "react";
import { iconsAndTitles } from "../lib/Static";

const rainbowColors = [
  "text-red-500",
  "text-orange-500",
  "text-yellow-500",
  "text-green-500",
  "text-blue-500",
  "text-indigo-500",
  "text-purple-500",
];

const generateInitialPositionAndVelocity = () => {
  return {
    x:
      Math.random() *
      (typeof window !== "undefined" ? window.innerWidth : 1000),
    y:
      Math.random() *
      (typeof window !== "undefined" ? window.innerHeight : 1000),
    vx: (Math.random() - 0.5) * 5,
    vy: (Math.random() - 0.5) * 5,
    color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
  };
};

const IconsBackground = () => {
  const [numberOfIcons, setNumberOfIcons] = useState(50); // Set the default number of icons
  const [speedFactor, setSpeedFactor] = useState(0.01); // Set the default speed factor
  const [positions, setPositions] = useState([]);
  const requestRef = useRef();
  const lastTimestamp = useRef();

  useEffect(() => {
    setPositions(
      Array.from({ length: numberOfIcons }, () =>
        generateInitialPositionAndVelocity()
      )
    );
  }, [numberOfIcons]);

  const updatePositions = (timestamp) => {
    if (!lastTimestamp.current) lastTimestamp.current = timestamp;
    const deltaTime = timestamp - lastTimestamp.current;

    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        let newX = pos.x + pos.vx * deltaTime * speedFactor;
        let newY = pos.y + pos.vy * deltaTime * speedFactor;
        const windowWidth =
          typeof window !== "undefined" ? window.innerWidth : 1000;
        const windowHeight =
          typeof window !== "undefined" ? window.innerHeight : 1000;

        if (newX < 0 || newX > windowWidth) {
          newX = Math.max(0, Math.min(newX, windowWidth));
          pos.vx = -pos.vx;
        }
        if (newY < 0 || newY > windowHeight) {
          newY = Math.max(0, Math.min(newY, windowHeight));
          pos.vy = -pos.vy;
        }
        return { ...pos, x: newX, y: newY };
      })
    );

    lastTimestamp.current = timestamp;
    requestRef.current = requestAnimationFrame(updatePositions);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {positions.map((position, index) => (
        <div
          key={index}
          className={`absolute ${position.color}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {React.cloneElement(
            iconsAndTitles[index % iconsAndTitles.length].icon,
            {
              className: `text-8xl ${position.color}`,
            }
          )}
        </div>
      ))}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: `rgba(var(--background-start-rgb), 0.6)`, // This line has been updated
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

export default IconsBackground;
