// src/components/games/lib/PhysicsManager.ts

import Phaser from "phaser";
import { BaseScene } from "./";

export class PhysicsManager {
  private scene: BaseScene;

  constructor(scene: BaseScene) {
    this.scene = scene;
    if (!this.scene.gameState.state.oscillatingObjects) {
      this.scene.gameState.state.oscillatingObjects = [];
    }
  }

  // utility to add sprite and optionally set scale
  addPlayer(name: string, x: number, y: number, scale: number) {
    const player = this.scene.physics.add.sprite(x, y, name);
    this.scene.gameState.state.player = player;
    this.scene.gameState.state.player.setScale(scale); // Set the scale to 25%
  }

  setupCollider(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject,
    callback?: ArcadePhysicsCallback
  ) {
    this.scene.physics.add.collider(object1, object2, callback);
  }

  setupOverlap(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject,
    callback: ArcadePhysicsCallback
  ) {
    this.scene.physics.add.overlap(object1, object2, callback);
  }

  createDynamicGroup(
    options?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig
  ): Phaser.Physics.Arcade.Group {
    return this.scene.physics.add.group(options);
  }
  createStaticGroup(
    options?: Phaser.Types.Physics.Arcade.StaticGroupCreateConfig
  ): Phaser.Physics.Arcade.StaticGroup {
    return this.scene.physics.add.staticGroup(options);
  }

  setGravityFor(object: Phaser.GameObjects.GameObject, x: number, y: number) {
    if (object.body) {
      object.body.setGravity(x, y);
    }
  }

  setGlobalGravity(x: number, y: number) {
    this.scene.physics.world.gravity.x = x;
    this.scene.physics.world.gravity.y = y;
  }

  isColliding(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject
  ): boolean {
    return this.scene.physics.world.collide(object1, object2);
  }

  setBodyActive(object: Phaser.GameObjects.GameObject, isActive: boolean) {
    if (object.body) {
      object.body.enable = isActive;
    }
  }

  setVelocity(
    object: Phaser.GameObjects.GameObject,
    velocityX: number,
    velocityY: number
  ) {
    if (object.body) {
      object.body.setVelocity(velocityX, velocityY);
    }
  }

  applyImpulse(
    object: Phaser.GameObjects.GameObject,
    impulseX: number,
    impulseY: number
  ) {
    if (object.body) {
      object.body.applyForce({ x: impulseX, y: impulseY });
    }
  }

  // custom screen wrap built to support both x/y axis from phaser's implementation here
  // https://github.com/phaserjs/phaser/blob/91986c58e53149f73e786b1c1564be75463900a8/src/physics/arcade/World.js#L2464
  screenWrap(object, wrapX = true, wrapY = false) {
    if (wrapX) {
      object.x = Phaser.Math.Wrap(
        object.x,
        this.scene.physics.world.bounds.left,
        this.scene.physics.world.bounds.right
      );
    }
    if (wrapY) {
      object.y = Phaser.Math.Wrap(
        object.y,
        this.scene.physics.world.bounds.top,
        this.scene.physics.world.bounds.bottom
      );
    }
  }

  lockScreen(
    object: Phaser.GameObjects.GameObject,
    lockX: boolean = true,
    lockY: boolean = false
  ) {
    if (object.body) {
      // Constrain movement in the X direction
      if (lockX) {
        if (object.x < this.scene.physics.world.bounds.left) {
          object.x = this.scene.physics.world.bounds.left;
          object.body.velocity.x = Math.max(0, object.body.velocity.x);
        } else if (object.x > this.scene.physics.world.bounds.right) {
          object.x = this.scene.physics.world.bounds.right;
          object.body.velocity.x = Math.min(0, object.body.velocity.x);
        }
      }

      // Constrain movement in the Y direction
      if (lockY) {
        if (object.y < this.scene.physics.world.bounds.top) {
          object.y = this.scene.physics.world.bounds.top;
          object.body.velocity.y = Math.max(0, object.body.velocity.y);
        } else if (object.y > this.scene.physics.world.bounds.bottom) {
          object.y = this.scene.physics.world.bounds.bottom;
          object.body.velocity.y = Math.min(0, object.body.velocity.y);
        }
      }
    }
  }

  createBoundaries() {
    const worldBounds = this.scene.physics.world.bounds;
    const thickness = 2; // Thickness of the boundary walls

    // Create boundary walls
    let topBoundary = this.createBoundary(
      worldBounds.centerX,
      worldBounds.top - thickness / 2,
      worldBounds.width,
      thickness
    );
    let bottomBoundary = this.createBoundary(
      worldBounds.centerX,
      worldBounds.bottom + thickness / 2,
      worldBounds.width,
      thickness
    );
    let leftBoundary = this.createBoundary(
      worldBounds.left + thickness / 2,
      worldBounds.centerY,
      thickness,
      worldBounds.height
    );
    let rightBoundary = this.createBoundary(
      worldBounds.right - thickness / 2,
      worldBounds.centerY,
      thickness,
      worldBounds.height
    );

    this.scene.gameState.state.boundaries = {
      topBoundary,
      bottomBoundary,
      leftBoundary,
      rightBoundary,
    }; // Storing the boundaries for later use

    this.setupCollider(
      this.scene.gameState.state.player,
      this.scene.gameState.state.boundaries.topBoundary
    );
    this.setupCollider(
      this.scene.gameState.state.player,
      this.scene.gameState.state.boundaries.bottomBoundary
    );
    this.setupCollider(
      this.scene.gameState.state.player,
      this.scene.gameState.state.boundaries.leftBoundary
    );
    this.setupCollider(
      this.scene.gameState.state.player,
      this.scene.gameState.state.boundaries.rightBoundary
    );
  }

  createBoundary(x, y, width, height) {
    let boundary = this.scene.physics.add
      .staticImage(x, y, null)
      .setScale(width, height)
      .setImmovable(true);
    boundary.refreshBody().setVisible(false); // Set visibility as needed
    return boundary;
  }

  calculateDistance(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject
  ): number {
    return Phaser.Math.Distance.Between(
      object1.x,
      object1.y,
      object2.x,
      object2.y
    );
  }

  calculateAngleBetween(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject
  ): number {
    return Phaser.Math.Angle.Between(
      object1.x,
      object1.y,
      object2.x,
      object2.y
    );
  }

  // Raycast method
  raycast(
    startPoint: Phaser.Math.Vector2,
    endPoint: Phaser.Math.Vector2,
    targets: Phaser.GameObjects.GameObject[]
  ): Phaser.GameObjects.GameObject | null {
    let closestIntersection = null;
    let closestDistance = Number.MAX_VALUE;

    targets.forEach((target) => {
      if (target.body) {
        const hitArea = target.body.isCircle
          ? new Phaser.Geom.Circle(target.x, target.y, target.body.radius)
          : new Phaser.Geom.Rectangle(
              target.x - target.body.halfWidth,
              target.y - target.body.halfHeight,
              target.body.width,
              target.body.height
            );

        const intersection = Phaser.Geom.Intersects.GetLineToRectangle(
          startPoint,
          endPoint,
          hitArea
        );
        if (intersection) {
          const distance = Phaser.Math.Distance.Between(
            startPoint.x,
            startPoint.y,
            intersection.x,
            intersection.y
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIntersection = target;
          }
        }
      }
    });

    return closestIntersection;
  }

  createPlatform(
    x: number,
    y: number,
    texture: string,
    scaleX: number = 1,
    scaleY: number = 0.5,
    callback?: ArcadePhysicsCallback,
    collisions: boolean = true,
    setImmovable: boolean = true // Platforms are typically immovable
  ): Phaser.Physics.Arcade.Sprite {
    const platform = this.scene.physics.add
      .sprite(x, y, texture)
      .setScale(scaleX, scaleY)
      .setImmovable(setImmovable); // Ensure the platform is immovable
    platform.body.allowGravity = false;
    platform.setOrigin(0.5, 0.5); // Center the origin if needed

    // Set up collision with the player or other objects here if necessary
    if (collisions) {
      this.setupCollider(this.scene.gameState.state.player, platform, callback);
    }

    this.scene.gameState.state.platformGroup.add(platform);

    return platform;
  }

  handleMovingPlatformPayloads(
    time,
    payloads = [this.scene.gameState.state.player]
  ) {
    // Check if the player is on a moving platform
    if (this.scene.gameState.state.player.currentPlatform) {
      const { object, amplitude, direction, phaseOffset } =
        this.scene.gameState.state.player.currentPlatform;

      // Only adjust the player's position if they are on the platform
      if (this.scene.gameState.state.player.body.touching.down) {
        // Calculate the oscillation velocity of the platform
        const oscillationVelocity =
          Math.sin(time / 1000 + phaseOffset) * amplitude;
        console.log(oscillationVelocity);
        // Apply the platform's horizontal velocity to the player
        payloads.forEach((payload) => {
          payload.body.setVelocityX(
            payload.body.velocity.x + oscillationVelocity
          );
          payload.body.setVelocityY(
            payload.body.velocity.y + oscillationVelocity
          );
        });
        // }
      } else {
        // If the player is not touching the platform, clear the current platform
        this.scene.gameState.state.player.currentPlatform = null;
      }
    }
  }

  // utility method for creating a ground object that spans the canvas width. Useful for games such as sidescrollers that use y-gravity
  initGround() {
    const groundTexture = this.scene.textures.get("ground").getSourceImage();
    const groundHeight = groundTexture.height;

    // Calculate the y-coordinate for the ground
    const groundY = this.scene.physics.world.bounds.height - groundHeight / 2; // Adjust for the new scaled height

    // Create the ground sprite
    const ground = this.scene.physics.add.sprite(0, groundY, "ground");
    const groundScaleX = this.scene.physics.world.bounds.width / ground.width;
    ground.setScale(groundScaleX, 0.5); // Scales ground to fit canvas width
    ground.setImmovable(true);
    ground.setOrigin(0, 0); // Keep the origin at the top-left
    ground.body.allowGravity = false;
    this.scene.gameState.state.ground = ground;
  }

  addOscillatingObject(object, amplitude, direction, phaseOffset = 0) {
    // Assign a unique ID to the object (if it doesn't already have one)
    object.id = object.id || Phaser.Math.RND.uuid();

    this.scene.gameState.state.oscillatingObjects.push({
      id: object.id,
      object,
      amplitude,
      direction,
      phaseOffset,
    });
  }

  oscillateObjects(time) {
    this.scene.gameState.state.oscillatingObjects.forEach(
      ({ object, amplitude, direction, phaseOffset }) => {
        const scaledTime = time * 0.002; // Adjust the scaling factor as needed
        const oscillationVelocity =
          Math.cos(scaledTime + phaseOffset) * amplitude * 100; // Increase amplitude

        if (direction === "horizontal") {
          object.body.setVelocityX(oscillationVelocity);
        } else if (direction === "vertical") {
          object.body.setVelocityY(oscillationVelocity);
        }
      }
    );
  }

  stopOscillating(object) {
    object.x = 0;
    object.y = 0;
    // Remove the object from the oscillating objects map
  }
}
