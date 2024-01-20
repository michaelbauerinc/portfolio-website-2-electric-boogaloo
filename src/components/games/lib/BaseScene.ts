import Phaser from "phaser";
import {
  AnimationManager,
  InputManager,
  UIManager,
  PhysicsManager,
  TransformManager,
  GameState,
  CameraManager,
} from ".";

export class BaseScene extends Phaser.Scene {
  protected animationManager: AnimationManager;
  protected inputManager: InputManager;
  protected uiManager: UIManager;
  protected physicsManager: PhysicsManager;
  protected transformManager: TransformManager;
  public gameState: GameState;
  public cameraManager: CameraManager;

  constructor(sceneKey: string) {
    super(sceneKey);
  }

  preload() {
    // Common asset preloading
  }

  create() {
    this.gameState = new GameState();
    this.animationManager = new AnimationManager(this);
    this.inputManager = new InputManager(this);
    this.uiManager = new UIManager(this);
    this.physicsManager = new PhysicsManager(this);
    this.transformManager = new TransformManager(this);
    this.cameraManager = new CameraManager(this);

    // Set up animations, UI, inputs, physics, etc.
    this.setupAnimations();
    this.setupUI();
    this.setupInput();
    this.setupPhysics();
  }

  update(time: number, delta: number) {
    // Common update logic
    this.handleInput();
  }

  protected setupAnimations() {
    // Common animation setup
  }

  protected setupUI() {
    // Common UI setup
  }

  protected setupInput() {
    // Common input setup
  }

  protected setupPhysics() {
    // Common physics setup
  }

  protected handleInput() {
    // Common input handling
  }
}
