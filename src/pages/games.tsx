// src/pages/games.tsx
import React from "react";
import type { NextPage } from "next";
import Navbar from "../components/common/Navbar";
import GameCard from "../components/games/GameCard";
import IconsBackground from "../components/common/IconsBackground";

import "../app/globals.css";

const gamesData = [
  { title: "Pong Game", gameId: "pong" },
  // Add more games here with unique gameId
  // Example: { title: 'Puzzle Game', gameId: 'puzzle-game' },
];

const Games: NextPage = () => (
  <div>
    <IconsBackground />
    <Navbar />
    <div className="bg-gradient-to-r mx-auto p-8 text-black">
      <div className="text-center bg-purple-600/50 backdrop-blur-md rounded-xl p-4 mx-8 my-4 shadow-lg hover:scale-105 transition-transform">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 py-10 text-yellow-300">
          Interactive Games
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-4 justify-center">
        {gamesData.map((game, index) => (
          <GameCard key={index} title={game.title} gameId={game.gameId} />
        ))}
      </div>
    </div>
  </div>
);

export default Games;
