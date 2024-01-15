// src/pages/play/game.tsx
"use client";

import React from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/common/Navbar";
import PhaserGame from "../../components/games/PhaserGame";

const GamePage = () => {
  const router = useRouter();
  const { gameId } = router.query;

  return (
    <div>
      <Navbar />
      <PhaserGame gameId={gameId as string} />
    </div>
  );
};

export default GamePage;
