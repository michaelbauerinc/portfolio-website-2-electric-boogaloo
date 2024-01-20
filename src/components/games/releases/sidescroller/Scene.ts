// src/components/games/releases/sidescroller/Scene.ts

import Phaser from "phaser";
import { BaseScene, InputManager, GameState } from "../../lib"; // Adjust the path as needed

export class CollectibleObject {
  private scene: Phaser.Scene;
  public collectible: Phaser.GameObjects.Polygon;

  constructor(scene: BaseScene, x: number, y: number) {
    this.scene = scene;

    const points = [0, 0, 40, 0, 20, 34];

    this.collectible = this.scene.add.polygon(
      x,
      y,
      points,
      0xffffff
    ) as Phaser.GameObjects.Polygon;

    this.scene.physics.world.enable(this.collectible);

    const body = this.collectible.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    this.scene.gameState.state.collectibleGroup.add(this.collectible);

    this.scene.physicsManager.setupOverlap(
      this.scene.gameState.state.player,
      this.collectible,
      this.onPlayerCollectibleCollision.bind(this)
    );
  }

  private onPlayerCollectibleCollision(
    player: Phaser.Physics.Arcade.Sprite,
    collectible: Phaser.GameObjects.Polygon
  ) {
    collectible.destroy();

    const index =
      this.scene.gameState.state.spawnedObjects.indexOf(collectible);
    if (index !== -1) {
      this.scene.gameState.state.spawnedObjects.splice(index, 1);
    }

    this.scene.gameState.state.score += 10;
    this.scene.uiManager.updateText(
      this.scene.gameState.state.scoreText,
      `Score: ${this.scene.gameState.state.score}`
    );
  }
}

class SideScrollerScene extends BaseScene {
  private player: Phaser.Physics.Arcade.Sprite;
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
  }

  update(time, delta) {
    super.update(time, delta);
    this.handlePlayerMovement();
    this.physicsManager.oscillateObjects(time, delta);
    this.physicsManager.handleMovingPlatformPayloads(time);
  }

  private loadAssets() {
    this.load.spritesheet("player", "/rabbit.png", {
      frameWidth: 200,
      frameHeight: 300,
    });
    this.load.image("ground", "/ground.png");
    this.load.image("platform", "/platform.png");
  }

  private initializeState() {
    this.gameState.state.spawnedObjects = [];
    this.gameState.state.spawnedObjectPositions = [];
    this.gameState.state.score = 0;
    this.gameState.state.scoreText = this.uiManager.createText(
      16,
      16,
      "Score: 0",
      { fontSize: "32px", fill: "#fff" }
    );
  }

  private configureWorld() {
    this.physics.world.setBounds(0, 0, this.boundsX, this.boundsY);
    this.physicsManager.initGround();
  }

  private setupPlayer() {
    this.physicsManager.addPlayer("player", 100, this.boundsY - 400, 0.25);
    this.animationManager.createAnimation("run", "player", 0, 4);
    this.animationManager.createAnimation("jump", "player", 1, 2);
    this.physicsManager.setupCollider(
      this.gameState.state.player,
      this.gameState.state.ground
    );
    // Setup collider between player and ground
    this.physicsManager.setupCollider(
      this.gameState.state.player,
      this.gameState.state.ground
    );
  }

  setupCollectibles() {
    // Assuming you have a group for collectibles
    this.gameState.state.collectibleGroup =
      this.physicsManager.createStaticGroup();

    this.spawnObjectInRandomLocation(
      20, // Number of collectibles
      30, // Buffer distance to avoid overlaps
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

    this.spawnObjectInRandomLocation(
      50, // Number of platforms
      200, // Buffer distance
      (x, y) => {
        // Define the oscillation properties
        const amplitude = Phaser.Math.FloatBetween(0.8, 2);
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

  spawnObjectInRandomLocation(
    numObjects,
    buffer = 50, // Default buffer set to 50
    createObjectCallback,
    group
  ) {
    for (let i = 0; i < numObjects; i++) {
      let position = this.findValidPosition(buffer, group);
      if (position.valid) {
        const newObject = createObjectCallback(position.x, position.y);
        group.add(newObject); // Add the new object to the group
        this.gameState.state.spawnedObjects.push({
          x: position.x,
          y: position.y,
        });
        this.gameState.state.spawnedObjectPositions.push({
          x: position.x,
          y: position.y,
        });
      }
    }
  }

  findValidPosition(buffer, group) {
    for (let attempts = 0; attempts < 100; attempts++) {
      let x = Phaser.Math.Between(buffer, this.boundsX - buffer);
      let y = Phaser.Math.Between(buffer, this.boundsY - buffer);

      if (this.isPositionValid(x, y, buffer, group)) {
        return { x, y, valid: true };
      }
    }
    return { x: 0, y: 0, valid: false };
  }

  isPositionValid(x, y, buffer, group) {
    // Check against other objects in the group
    const isClearOfGroup = !group.getChildren().some((object) => {
      return Phaser.Math.Distance.Between(x, y, object.x, object.y) < buffer;
    });

    // Check against world bounds with buffer
    const withinBoundsX = x > buffer && x < this.boundsX - buffer;
    const withinBoundsY = y > buffer && y < this.boundsY - buffer;

    return isClearOfGroup && withinBoundsX && withinBoundsY;
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
    const velocityX = this.gameState.state.player.body.velocity.x;
    const velocityY = this.gameState.state.player.body.velocity.y;
    // Check if the player is on the ground and moving horizontally
    if (velocityX !== 0 && isOnGround) {
      this.animationManager.playAnimationOn(
        this.gameState.state.player,
        "run",
        true
      );
    }
    // Check if the player is in the air
    else if (!isOnGround) {
      // Adjust this condition based on your jump and fall animations
      this.animationManager.playAnimationOn(
        this.gameState.state.player,
        "jump",
        false // Force the jump animation to play even if another animation is active
      );
    }
    // Player is on the ground but not moving horizontally
    else {
      this.animationManager.stopAnimationOn(this.gameState.state.player);
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
        debug: false,
      },
    },
    scene: [SideScrollerScene],
  };
};
