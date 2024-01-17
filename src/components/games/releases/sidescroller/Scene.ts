import Phaser from "phaser";
import { BaseScene, InputManager, GameState } from "../../lib"; // Adjust the path as needed

class SideScrollerScene extends BaseScene {
  private player: Phaser.Physics.Arcade.Sprite; // Declare the player property
  private ground: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("SideScrollerScene");
  }

  preload() {
    super.preload();
    // Load player spritesheet and other assets here
    this.load.spritesheet("player", "/rabbit.png", {
      frameWidth: 200,
      frameHeight: 300,
    });
    // Load the ground image (adjust the key and path)
    this.load.image("ground", "/ground.png");
    // Load other assets (background, platforms, etc.)
  }

  create() {
    super.create();

    this.physicsManager.initGround();

    // Create and set up player sprite
    this.physicsManager.addSprite("player", 100, 100, 0.25);

    // Setup animations for the player
    this.animationManager.createAnimation("run", "player", 0, 4);
    this.animationManager.createAnimation("jump", "player", 1, 1);

    // Setup collider between player and ground
    this.physicsManager.setupCollider(
      this.gameState.state.player,
      this.gameState.state.ground
    );

    this.initInput();

    // Set global gravity
    this.physicsManager.setGlobalGravity(0, 300);
  }

  update(time, delta) {
    super.update(time, delta);

    this.handlePlayerMovement();
    this.physicsManager.screenWrap(this.gameState.state.player);
  }

  initInput() {
    // Register keys
    this.inputManager.registerKey("LEFT");
    this.inputManager.registerKey("RIGHT");
    this.inputManager.registerKey("UP");
    this.inputManager.registerKey("A");
    this.inputManager.registerKey("D");
    this.inputManager.registerKey("W");
    this.inputManager.registerKey("SPACE");

    // Setup input for running and jumping
    this.inputManager.bindActionToKeys("moveLeft", ["LEFT", "A"]);
    this.inputManager.bindActionToKeys("moveRight", ["RIGHT", "D"]);
    this.inputManager.bindActionToKeys("jump", ["UP", "W", "SPACE"]);
    this.inputManager.bindActionToGamepadButtons("moveLeft", [14]); // Example gamepad button code
    this.inputManager.bindActionToGamepadButtons("moveRight", [15]); // Example gamepad button code
    this.inputManager.bindActionToGamepadButtons("jump", [0]); // Example gamepad button code
  }

  handlePlayerMovement() {
    const speed = 160;
    const isOnGround = this.gameState.state.player.body.touching.down;

    if (this.inputManager.isActionActive("moveLeft")) {
      this.gameState.state.player.setFlipX(true); // Flip the sprite horizontally
      this.gameState.state.player.setVelocityX(-speed);
      if (isOnGround) {
        this.animationManager.playAnimationOn(
          this.gameState.state.player,
          "run",
          true
        );
      }
    } else if (this.inputManager.isActionActive("moveRight")) {
      this.gameState.state.player.setFlipX(false); // Reset the sprite's horizontal flip
      this.gameState.state.player.setVelocityX(speed);
      if (isOnGround) {
        this.animationManager.playAnimationOn(
          this.gameState.state.player,
          "run",
          true
        );
      }
    } else {
      this.gameState.state.player.setVelocityX(0);
      if (isOnGround)
        this.animationManager.stopAnimationOn(this.gameState.state.player);
    }

    if (isOnGround && this.inputManager.isActionActive("jump")) {
      this.gameState.state.player.setVelocityY(-330);
      this.animationManager.playAnimationOn(
        this.gameState.state.player,
        "jump"
      );
    }
  }
}

export const SideScrollerGame = (domElement) => {
  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: domElement,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: true,
      },
    },
    scene: [SideScrollerScene],
  };
};
