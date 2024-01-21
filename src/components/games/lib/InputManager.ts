import Phaser from "phaser";
import { BaseScene } from ".";

type ActionCondition = (() => boolean) & { isMobileControl?: boolean };

export class InputManager {
  private scene: BaseScene;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keyMap: Map<string, Phaser.Input.Keyboard.Key>;
  private gamepad: Phaser.Input.Gamepad.Gamepad | null = null;
  private actionMap: Map<string, Array<ActionCondition>>;

  constructor(scene: BaseScene) {
    this.scene = scene;
    if (this.scene.input.keyboard != null)
      this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyMap = new Map();
    this.actionMap = new Map();

    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.once(
        "connected",
        (pad: Phaser.Input.Gamepad.Gamepad) => {
          this.gamepad = pad;
        }
      );
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
    this.actionMap.set(actionName, [...existingConditions, ...newConditions]);
  }

  bindActionToGamepadButtons(actionName: string, buttonCodes: Array<number>) {
    const newConditions = buttonCodes.map(
      (buttonCode) => () => this.isGamepadButtonDown(buttonCode)
    );
    const existingConditions = this.actionMap.get(actionName) || [];
    this.actionMap.set(actionName, [...existingConditions, ...newConditions]);
  }

  isActionActive(actionName: string): boolean {
    const conditions = this.actionMap.get(actionName);
    if (!conditions) return false;

    for (const condition of conditions) {
      if (condition()) return true;
    }

    return false;
  }

  activateAction(actionName: string) {
    const mobileControlCondition = () => true;
    mobileControlCondition.isMobileControl = true; // Tagging the condition

    const existingConditions = this.actionMap.get(actionName) || [];
    this.actionMap.set(actionName, [
      ...existingConditions,
      mobileControlCondition,
    ]);
  }

  deactivateAction(actionName: string) {
    const existingConditions = this.actionMap.get(actionName) || [];
    const filteredConditions = existingConditions.filter(
      (condition) => !condition.isMobileControl
    );

    if (filteredConditions.length > 0) {
      this.actionMap.set(actionName, filteredConditions);
    } else {
      this.actionMap.delete(actionName); // Remove the action if no conditions are left
    }
  }
}
