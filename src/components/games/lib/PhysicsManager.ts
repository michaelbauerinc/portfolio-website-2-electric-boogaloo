import Phaser from "phaser";
import { BaseScene } from "./";

export class PhysicsManager {
  private scene: BaseScene;

  constructor(scene: BaseScene) {
    this.scene = scene;
  }

  // utility to add sprite and optionally set scale
  addSprite(name: string, x: number, y: number, scale: number) {
    const player = this.scene.physics.add.sprite(x, y, name);
    this.scene.gameState.state.player = player;
    this.scene.gameState.state.player.setScale(scale); // Set the scale to 25%
  }

  setupCollider(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject,
    callback: ArcadePhysicsCallback
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

  screenWrap(object: Phaser.GameObjects.GameObject) {
    this.scene.physics.world.wrap(object, 0);
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

  // utility method for creating a ground object that spans the canvas width. Useful for games such as sidescrollers that use y-gravity
  initGround() {
    const groundTexture = this.scene.textures.get("ground").getSourceImage();
    const groundHeight = groundTexture.height;

    // Calculate the y-coordinate for the ground
    const groundY = this.scene.game.canvas.height - groundHeight / 2; // Adjust for the new scaled height

    // Create the ground sprite
    const ground = this.scene.physics.add.sprite(0, groundY, "ground");
    const groundScaleX = this.scene.game.canvas.width / ground.width;
    ground.setScale(groundScaleX, 0.5); // Scales ground to fit canvas width
    ground.setImmovable(true);
    ground.setOrigin(0, 0); // Keep the origin at the top-left
    ground.body.allowGravity = false;
    this.scene.gameState.state.ground = ground;
  }
}

// ### Usage Example

// ```typescript
// // In your Phaser scene
// const physicsManager = new PhysicsManager(this);

// // Setting up a collider
// physicsManager.setupCollider(player, enemyGroup, (player, enemy) => {
//     // Handle collision between player and an enemy
// });

// // Creating a dynamic group
// const bullets = physicsManager.createDynamicGroup({
//     collideWorldBounds: true,
//     bounceX: 1,
//     bounceY: 1
// });

// // Changing gravity for an object
// physicsManager.setGravityFor(player, 0, 300);

// ### Usage Example

// ```typescript
// // In your Phaser scene
// const physicsManager = new PhysicsManager(this);

// // Check for collision
// if (physicsManager.isColliding(player, enemy)) {
//     // Handle player-enemy collision
// }

// // Set velocity
// physicsManager.setVelocity(player, 200, 0);

// // Apply impulse
// physicsManager.applyImpulse(player, 0, 10);

// // Screen wrap for an object
// physicsManager.screenWrap(player);

// // Calculate distance between two objects
// const distance = physicsManager.calculateDistance(player, enemy);

// // Calculate angle between two objects
// const angle = physicsManager.calculateAngleBetween(player, enemy);

// // In your Phaser scene
// const physicsManager = new PhysicsManager(this);

// // Define start and end points for the ray
// const startPoint = new Phaser.Math.Vector2(player.x, player.y);
// const endPoint = new Phaser.Math.Vector2(target.x, target.y);

// // Define the targets array (e.g., enemies, obstacles)
// const targets = [enemy1, enemy2, obstacle1];

// // Perform raycast
// const hitObject = physicsManager.raycast(startPoint, endPoint, targets);

// if (hitObject) {
//     console.log('Ray hit:', hitObject);
//     // Handle interaction with the hit object
// }
