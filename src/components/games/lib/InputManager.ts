import Phaser from "phaser";

export class InputManager {
  private scene: Phaser.Scene;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyMap: Map<string, Phaser.Input.Keyboard.Key>;
  private gamepad: Phaser.Input.Gamepad.Gamepad | null = null;
  private actionMap: Map<string, Array<() => boolean>>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyMap = new Map();
    this.actionMap = new Map();

    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.once("connected", (pad) => {
        this.gamepad = pad;
      });
    }

    // Enable touch input for the scene
    this.scene.input.addPointer(1);
  }

  registerKey(keyCode: string): Phaser.Input.Keyboard.Key | null {
    if (this.scene.input.keyboard) {
      const key = this.scene.input.keyboard.addKey(keyCode);
      this.keyMap.set(keyCode, key);
      return key;
    }
    return null;
  }

  isKeyDown(keyCode: string): boolean {
    const key = this.keyMap.get(keyCode);
    return key ? key.isDown : false;
  }

  isKeyUp(keyCode: string): boolean {
    const key = this.keyMap.get(keyCode);
    return key ? key.isUp : false;
  }

  isGamepadButtonDown(buttonCode: number): boolean {
    return this.gamepad ? this.gamepad.buttons[buttonCode].pressed : false;
  }

  getGamepadAxis(axisCode: number): number {
    return this.gamepad ? this.gamepad.axes[axisCode].getValue() : 0;
  }

  onPointerDown(
    callback: (pointer: Phaser.Input.Pointer) => void,
    context?: any
  ) {
    this.scene.input.on("pointerdown", callback, context);
  }

  onPointerUp(
    callback: (pointer: Phaser.Input.Pointer) => void,
    context?: any
  ) {
    this.scene.input.on("pointerup", callback, context);
  }

  bindActionToKeys(actionName: string, keyCodes: Array<string>) {
    const newConditions = keyCodes.map(
      (keyCode) => () => this.isKeyDown(keyCode)
    );
    const existingConditions = this.actionMap.get(actionName) || [];
    this.actionMap.set(actionName, existingConditions.concat(newConditions));
  }

  bindActionToGamepadButtons(actionName: string, buttonCodes: Array<number>) {
    const newConditions = buttonCodes.map(
      (buttonCode) => () => this.isGamepadButtonDown(buttonCode)
    );
    const existingConditions = this.actionMap.get(actionName) || [];
    this.actionMap.set(actionName, existingConditions.concat(newConditions));
  }

  isActionActive(actionName: string): boolean {
    const conditions = this.actionMap.get(actionName);
    if (!conditions) return false;

    for (const condition of conditions) {
      if (condition()) return true;
    }

    return false;
  }

  // Additional methods as needed
}
