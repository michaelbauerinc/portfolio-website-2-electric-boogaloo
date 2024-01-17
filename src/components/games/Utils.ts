import { PongGame } from "./releases/pong/PongGame";
import { KartRace } from "./releases/racing/KartRace";
import { SideScrollerGame } from "./releases/sidescroller/Scene";

export const getGameInstance = (
  gameId: string,
  domElement: HTMLDivElement
): any => {
  switch (gameId) {
    case "pong":
      return PongGame(domElement);
    case "racing":
      return KartRace(domElement);
    case "sidescroller":
      return SideScrollerGame(domElement);
    // case 'otherGameId':
    //   return OtherGame(element);
    default:
      throw new Error("Game not found");
  }
};
