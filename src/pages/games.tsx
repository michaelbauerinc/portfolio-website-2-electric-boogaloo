// src/pages/games.tsx
import React from "react";
import type { NextPage } from "next";
import Navbar from "../components/common/Navbar";
import GameCard from "../components/games/GameCard";
import IconsBackground from "../components/common/IconsBackground";

import "../app/globals.css";

const gamesData = [
  { title: "Trololol Pong", gameId: "pong" },
  { title: "Kart Race", gameId: "racing" },
  { title: "Potato Bird Platforming", gameId: "sidescroller" },
];

const Games: NextPage = () => (
  <div>
    <IconsBackground />
    <Navbar />
    <div className="bg-gradient-to-r mx-auto p-8 text-black">
      <div className="text-center bg-purple-600/50 backdrop-blur-md rounded-xl p-6 mx-6 my-6 shadow-lg hover:scale-105 transition-transform">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 py-12 text-yellow-300">
          Interactive Games
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
        {gamesData.map((game, index) => (
          <GameCard key={index} title={game.title} gameId={game.gameId} />
        ))}
      </div>
    </div>
  </div>
);

export default Games;
