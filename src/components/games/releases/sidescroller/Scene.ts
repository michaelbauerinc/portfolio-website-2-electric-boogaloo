// src/components/games/releases/sidescroller/Scene.ts

import Phaser from "phaser";
import { BaseScene, InputManager, GameState } from "../../lib"; // Adjust the path as needed

export class CollectibleObject {
  private scene: BaseScene;
  public collectible: Phaser.GameObjects.Sprite;

  constructor(scene: BaseScene, x: number, y: number) {
    this.scene = scene;
    this.collectible = this.scene.physics.add
      .sprite(x, y, "coin")
      .setScale(0.1, 0.1)
      .setImmovable(true);

    this.scene.physics.world.enable(this.collectible);

    const body = this.collectible.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    // Adjust the size of the collider
    body.setSize(
      this.collectible.width * 0.5, // Adjust the width of the collider
      this.collectible.height * 0.5 // Adjust the height of the collider
    );

    // Optionally, you can also offset the collider if needed
    body.setOffset(
      (this.collectible.width - body.width) / 2,
      (this.collectible.height - body.height) / 2
    );

    this.scene.gameState.state.collectibleGroup.add(this.collectible);

    this.scene.physicsManager.setupOverlap(
      this.scene.gameState.state.player,
      this.collectible,
      this.onPlayerCollectibleCollision.bind(this)
    );
  }

  private onPlayerCollectibleCollision(
    player: Phaser.Physics.Arcade.Sprite, // Ensure player reference is passed
    collectible: Phaser.Physics.Arcade.Sprite // Ensure collectible reference is passed
  ) {
    // First, check if the collectible still exists
    if (collectible && collectible.active) {
      collectible.destroy();

      this.removeFromSpawnedObjects(collectible);
      this.updateScore();
    }
  }

  private removeFromSpawnedObjects(collectible: Phaser.Physics.Arcade.Sprite) {
    const index =
      this.scene.gameState.state.spawnedObjects.indexOf(collectible);
    if (index !== -1) {
      this.scene.gameState.state.spawnedObjects.splice(index, 1);
    }
  }

  private updateScore() {
    this.scene.gameState.state.score += 10;
    this.scene.uiManager.updateText(
      this.scene.gameState.state.scoreText,
      `Score: ${this.scene.gameState.state.score}`
    );
  }
}

class SideScrollerScene extends BaseScene {
  private boundsX: number = 1600;
  private boundsY: number = 2000;

  constructor() {
    super("SideScrollerScene");
  }

  preload() {
    super.preload();
    this.loadAssets();
  }

  create() {
    super.create();
    this.initializeState();
    this.configureWorld();
    this.setupPlayer();
    this.setupCollectibles();
    this.setupPlatforms();
    this.setupCamera();
    this.initInput();
    this.physicsManager.createBoundaries();
    this.uiManager.createOnScreenControls();
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.handlePlayerMovement();
    this.physicsManager.oscillateObjects(time);
    this.physicsManager.handleMovingPlatformPayloads(time);
    this.uiManager.resizeGameCanvas();
  }

  private loadAssets() {
    this.load.spritesheet("player", "/potato.png", {
      frameWidth: 180,
      frameHeight: 180,
    });
    this.load.spritesheet("player_fall", "/potato_fall.png", {
      frameWidth: 180,
      frameHeight: 180,
    });
    this.load.image("ground", "/ground.png");
    this.load.image("platform", "/platform.png");
    this.load.image("coin", "/coin.png");
  }

  private initializeState() {
    this.gameState.state.spawnedObjects = [];
    this.gameState.state.spawnedObjectPositions = [];
    this.gameState.state.score = 0;
    this.gameState.state.scoreText = this.uiManager.createText(
      5,
      10,
      "Score: 0",
      { fontSize: "32px", color: "purple" }
    );
  }

  private configureWorld() {
    this.physics.world.setBounds(0, 0, this.boundsX, this.boundsY);
    this.physicsManager.initGround();
  }

  private setupPlayer() {
    this.physicsManager.addPlayer("player", 100, this.boundsY - 400, 0.5);
    this.animationManager.createAnimation("run", "player", 0, 16);
    this.animationManager.createAnimation("idle", "player", 0, 0);
    this.animationManager.createAnimation("jump", "player_fall", 0, 0);
    this.physicsManager.setupCollider(
      this.gameState.state.player,
      this.gameState.state.ground
    );
    // Setup collider between player and ground
    this.physicsManager.setupCollider(
      this.gameState.state.player,
      this.gameState.state.ground
    );
    const body = this.gameState.state.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(
      body.width * 0.5, // Adjust the width of the collider
      body.height * 0.65 // Adjust the height of the collider
    );
  }

  setupCollectibles() {
    // Assuming you have a group for collectibles
    this.gameState.state.collectibleGroup =
      this.physicsManager.createStaticGroup();

    this.physicsManager.spawnObjectInRandomLocation(
      100, // Number of collectibles
      50, // Buffer distance to avoid overlaps
      (x, y) => {
        // Create and return a collectible object here
        // Assuming CollectibleObject is a class that creates a collectible
        const collectible = new CollectibleObject(this, x, y);
        return collectible.collectible;
      },
      this.gameState.state.collectibleGroup
    );
  }

  setupPlatforms() {
    // Assuming you have a group for platforms
    this.gameState.state.platformGroup =
      this.physicsManager.createStaticGroup();

    this.physicsManager.spawnObjectInRandomLocation(
      50, // Number of platforms
      200, // Buffer distance
      (x, y) => {
        // Define the oscillation properties
        const amplitude = Phaser.Math.FloatBetween(0.5, 1.3);
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        const phaseOffset = Phaser.Math.FloatBetween(0, 6);

        // Create the platform
        const platform = this.physicsManager.createPlatform(
          x,
          y,
          "platform",
          0.15,
          0.1
        );

        // Add the platform to the platform group
        this.gameState.state.platformGroup.add(platform);

        // Add the platform as an oscillating object
        this.physicsManager.addOscillatingObject(
          platform,
          amplitude,
          direction,
          phaseOffset
        );

        return platform;
      },
      this.gameState.state.platformGroup
    );
  }

  setupCamera() {
    // Get a reference to the current scene's camera
    const camera = this.cameras.main;

    // Make the camera follow the player
    camera.startFollow(this.gameState.state.player);

    // Set camera bounds to match the world bounds
    camera.setBounds(0, 0, this.boundsX, this.boundsY); // Use the same values as your world bounds

    // Optional: Set a deadzone
    // camera.setDeadzone(100, 50); // Adjust the values according to your game's needs
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

    // Handle Player Velocity
    if (this.inputManager.isActionActive("moveLeft")) {
      this.gameState.state.player.setVelocityX(-speed);
      this.gameState.state.player.setFlipX(true); // Flip the sprite horizontally
    } else if (this.inputManager.isActionActive("moveRight")) {
      this.gameState.state.player.setVelocityX(speed);
      this.gameState.state.player.setFlipX(false); // Reset the sprite's horizontal flip
    } else {
      this.gameState.state.player.setVelocityX(0);
    }

    if (isOnGround && this.inputManager.isActionActive("jump")) {
      this.gameState.state.player.setVelocityY(-330);
    }

    // Handle Player Animation
    this.updatePlayerAnimation(isOnGround);
  }

  updatePlayerAnimation(isOnGround: boolean) {
    const playerVelocity = this.gameState.state.player.body.velocity;

    // Prioritize the jump animation when the player is in the air
    if (!isOnGround) {
      this.animationManager.playAnimationOn(
        this.gameState.state.player,
        "jump",
        true
      );
    }
    // Check if the player is on the ground and moving horizontally
    else if (playerVelocity.x !== 0) {
      this.animationManager.playAnimationOn(
        this.gameState.state.player,
        "run",
        true
      );
    }
    // Player is on the ground but not moving horizontally
    else {
      this.animationManager.playAnimationOn(
        this.gameState.state.player,
        "idle",
        true
      );
    }
  }
}

export const SideScrollerGame = (domElement: HTMLElement) => {
  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#87CEEB", // Sky blue color
    parent: domElement,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
    scene: [SideScrollerScene],
  };
};
