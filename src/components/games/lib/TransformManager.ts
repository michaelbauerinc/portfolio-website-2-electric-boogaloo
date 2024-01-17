import Phaser from "phaser";
import { BaseScene } from "."; // Adjust the path as needed

export class TransformManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Move to a specific position
  moveTo(
    sprite: Phaser.GameObjects.Sprite,
    x: number,
    y: number,
    duration: number = 1000
  ) {
    this.scene.add.tween({
      targets: sprite,
      x: x,
      y: y,
      ease: "Power1",
      duration: duration,
    });
  }

  // Rotate to a specific angle
  rotateTo(
    sprite: Phaser.GameObjects.Sprite,
    angle: number,
    duration: number = 1000
  ) {
    this.scene.add.tween({
      targets: sprite,
      angle: angle,
      ease: "Power1",
      duration: duration,
    });
  }

  // Scale to a specific size
  scaleTo(
    sprite: Phaser.GameObjects.Sprite,
    scale: number,
    duration: number = 1000
  ) {
    this.scene.add.tween({
      targets: sprite,
      scale: scale,
      ease: "Power1",
      duration: duration,
    });
  }

  // Look at a specific point (similar to Unity's LookAt)
  lookAt(sprite: Phaser.GameObjects.Sprite, x: number, y: number) {
    const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, x, y);
    sprite.setRotation(angle);
  }

  // Translate relative to the sprite's current position
  translate(
    sprite: Phaser.GameObjects.Sprite,
    x: number,
    y: number,
    duration: number = 1000
  ) {
    this.scene.add.tween({
      targets: sprite,
      x: sprite.x + x,
      y: sprite.y + y,
      ease: "Power1",
      duration: duration,
    });
  }

  // Rotate around a point at a certain distance and angle
  rotateAround(
    sprite: Phaser.GameObjects.Sprite,
    point: { x: number; y: number },
    radius: number,
    angle: number,
    duration: number = 1000
  ) {
    const radianAngle = Phaser.Math.DegToRad(angle);
    const newX = point.x + radius * Math.cos(radianAngle);
    const newY = point.y + radius * Math.sin(radianAngle);

    this.scene.add.tween({
      targets: sprite,
      x: newX,
      y: newY,
      ease: "Power1",
      duration: duration,
    });
  }

  // utility method for creating a ground object that spans the canvas width. Useful for games such as sidescrollers that use y-gravity
  initGround(scene: BaseScene) {
    const groundTexture = scene.textures.get("ground").getSourceImage();
    const groundHeight = groundTexture.height;

    // Calculate the y-coordinate for the ground
    const groundY = scene.game.canvas.height - groundHeight / 2; // Adjust for the new scaled height

    // Create the ground sprite
    const ground = scene.physics.add.sprite(0, groundY, "ground");
    const groundScaleX = scene.game.canvas.width / ground.width;
    ground.setScale(groundScaleX, 0.5); // Scales ground to fit canvas width
    ground.setImmovable(true);
    ground.setOrigin(0, 0); // Keep the origin at the top-left
    ground.body.allowGravity = false;
    scene.gameState.state.ground = ground;
  }

  // Additional utility methods as needed
}
