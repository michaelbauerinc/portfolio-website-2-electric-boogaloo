import Phaser from "phaser";

export class GameState {
  private proxy: any;

  constructor() {
    const state: { [key: string]: any } = {
      spawnedObjects: [], // Initialize an array for spawned objects
      spawnedObjectPositions: [], // Initialize an array for object positions
      // Other properties in your game state
    };

    this.proxy = new Proxy(state, {
      get: (target, prop) => {
        return target[prop.toString()];
      },
      set: (target, prop, value) => {
        target[prop.toString()] = value;
        return true;
      },
    });
  }

  public get state() {
    return this.proxy;
  }
}
