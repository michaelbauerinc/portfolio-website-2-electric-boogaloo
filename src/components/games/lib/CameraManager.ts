import Phaser from "phaser";

export class CameraManager {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.camera = scene.cameras.main;
  }

  followPlayer(
    player: Phaser.GameObjects.GameObject,
    roundPixels: boolean = true,
    lerpX: number = 0.1,
    lerpY: number = 0.1
  ) {
    this.camera.startFollow(player, roundPixels, lerpX, lerpY);
  }

  stopFollowing() {
    this.camera.stopFollow();
  }

  smoothlyTransitionTo(
    targetX: number,
    targetY: number,
    duration: number = 2000
  ) {
    this.scene.tweens.add({
      targets: this.camera,
      scrollX: targetX,
      scrollY: targetY,
      ease: "Sine.easeInOut",
      duration: duration,
    });
  }

  zoomInOut(
    zoomInFactor: number,
    zoomOutFactor: number,
    duration: number = 1500
  ) {
    this.scene.tweens.add({
      targets: this.camera,
      zoom: zoomInFactor,
      yoyo: true,
      hold: 1000,
      duration: duration,
      onComplete: () => {
        this.camera.zoom = zoomOutFactor;
      },
    });
  }

  cinematicBars(show: boolean, duration: number = 800) {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, this.scene.sys.canvas.width, 50);
    graphics.fillRect(
      0,
      this.scene.sys.canvas.height - 50,
      this.scene.sys.canvas.width,
      50
    );

    if (show) {
      graphics.setVisible(true);
      this.scene.tweens.add({
        targets: graphics,
        alpha: { from: 0, to: 1 },
        duration: duration,
      });
    } else {
      this.scene.tweens.add({
        targets: graphics,
        alpha: { from: 1, to: 0 },
        duration: duration,
        onComplete: () => {
          graphics.setVisible(false);
          graphics.destroy();
        },
      });
    }
  }
}
