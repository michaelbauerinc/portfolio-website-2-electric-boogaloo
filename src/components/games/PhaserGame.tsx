// src/components/games/PhaserGame.tsx
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { getGameInstance } from "./Utils";

type PhaserGameProps = {
  gameId: string;
};

const PhaserGame: React.FC<PhaserGameProps> = ({ gameId }) => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gameInstance: Phaser.Game | null = null;

    if (gameRef.current) {
      // Pass the game configuration to the Phaser game
      gameInstance = new Phaser.Game(getGameInstance(gameId, gameRef.current));

      // Cleanup function to destroy the game when the component unmounts
      return () => gameInstance?.destroy(true);
    }
  }, [gameId]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 py-4 text-yellow-300">
        Game: {gameId}
      </h1>
      <div ref={gameRef} className="flex items-center justify-center" />
    </div>
  );
};

export default PhaserGame;
