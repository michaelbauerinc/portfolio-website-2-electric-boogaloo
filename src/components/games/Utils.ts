import Phaser from "phaser";
import { PongGame } from "./releases/pong/PongGame";
import { KartRace } from "./releases/racing/KartRace";

export const getGameInstance = (
  gameId: string,
  domElement: HTMLDivElement
): Phaser.Types.Core.GameConfig => {
  switch (gameId) {
    case "pong":
      return PongGame(domElement);
    case "racing":
      return KartRace(domElement);
    // case 'otherGameId':
    //   return OtherGame(domElement);
    default:
      throw new Error("Game not found");
  }
};
