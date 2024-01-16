// src/pages/play/game.tsx
import React from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/common/Navbar";
import dynamic from "next/dynamic";
import "../../app/styles.css";

const PhaserGame = dynamic(() => import("../../components/games/PhaserGame"), {
  ssr: false,
});

const GamePage = () => {
  const router = useRouter();
  const { gameId } = router.query;

  return (
    <div>
      <Navbar />
      {gameId && <PhaserGame gameId={gameId as string} />}
    </div>
  );
};

export default GamePage;
