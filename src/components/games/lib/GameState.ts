import Phaser from "phaser";

export class GameState {
  private proxy: any;

  constructor() {
    const state: { [key: string]: any } = {};
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
