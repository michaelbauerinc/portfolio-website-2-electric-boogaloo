// File: SideScrollerScene.js
import Phaser from "phaser";
import { BaseScene, GameState } from "../../lib"; // Adjust the path as needed

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

    // Create platforms, background, etc.
    // Example: this.platforms = this.physicsManager.createStaticGroup();

    this.transformManager.initGround(this);

    // Create and set up player sprite

    const player = this.physics.add.sprite(100, 100, "player");
    this.gameState.state.player = player;
    this.gameState.state.player.setScale(0.25); // Set the scale to 25%

    // Setup animations for the player
    this.animationManager.createAnimation("run", "player", {
      key: "run",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1, // To make it loop continuously
    });

    this.animationManager.createAnimation("jump", "player", {
      key: "jump",
      frames: this.anims.generateFrameNumbers("jump", { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1, // To make it loop continuously
    });

    // Setup collider between player and ground
    this.physicsManager.setupCollider(
      this.gameState.state.player,
      this.gameState.state.ground
    );

    // Setup input for running and jumping
    this.inputManager.registerKey("LEFT");
    this.inputManager.registerKey("RIGHT");
    this.inputManager.registerKey("UP");

    // Set global gravity
    this.physicsManager.setGlobalGravity(0, 300);
  }

  update(time, delta) {
    super.update(time, delta);

    this.handlePlayerMovement();
    this.physicsManager.screenWrap(this.gameState.state.player);
  }

  // Inside the handlePlayerMovement method
  handlePlayerMovement() {
    const speed = 160;
    const isOnGround = this.gameState.state.player.body.touching.down;

    if (this.inputManager.isKeyDown("LEFT")) {
      this.gameState.state.player.setFlipX(true); // Flip the sprite horizontally
      this.gameState.state.player.setVelocityX(-speed);
      if (isOnGround) {
        this.animationManager.playAnimationOn(
          this.gameState.state.player,
          "run",
          true
        );
      }
    } else if (this.inputManager.isKeyDown("RIGHT")) {
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

    if (isOnGround && this.inputManager.isKeyDown("UP")) {
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
