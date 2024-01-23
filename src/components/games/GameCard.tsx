// src/components/games/GameCard.tsx
import React from "react";
import Link from "next/link";

type GameCardProps = {
  title: string;
  gameId: string; // unique identifier for each game
};

const GameCard: React.FC<GameCardProps> = ({ title, gameId }) => {
  return (
    <Link
      href={`/play/game?gameId=${gameId}`}
      passHref
      className="flex flex-col h-full border rounded-lg shadow-lg p-4 m-4 bg-gradient-to-r from-gray-50 to-gray-200 hover:from-gray-200 hover:to-gray-50 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
    >
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mt-2 text-center">
          {title}
        </h3>
      </div>
      <div className="flex justify-center mt-4">
        <span className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-yellow-300 bg-purple-600 hover:bg-purple-700 transition duration-300 ease-in-out">
          Play Game
        </span>
      </div>
    </Link>
  );
};

export default GameCard;
