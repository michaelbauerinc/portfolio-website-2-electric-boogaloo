import Phaser from "phaser";

interface Track {
  x: number;
  y: number;
  radius: number; // Add the 'radius' property
}

export class KartRaceUtils {
  private scene: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  keepCarOnTrack(
    car: Phaser.Physics.Arcade.Sprite,
    outerTrack: Track,
    innerTrack: Track,
    delta: number
  ) {
    const getScaledDimensions = (sprite: Phaser.GameObjects.Sprite) => {
      return {
        width: sprite.width * sprite.scaleX,
        height: sprite.height * sprite.scaleY,
      };
    };

    const { width: scaledWidth, height: scaledHeight } =
      getScaledDimensions(car);

    const distanceToOuter = Phaser.Math.Distance.Between(
      car.x,
      car.y,
      outerTrack.x,
      outerTrack.y
    );
    const distanceToInner = Phaser.Math.Distance.Between(
      car.x,
      car.y,
      innerTrack.x,
      innerTrack.y
    );

    const outerMaxDistance = outerTrack.radius - scaledWidth / 2;
    const innerMinDistance = innerTrack.radius + scaledWidth / 2;

    if (distanceToOuter > outerMaxDistance) {
      this.repositionCar(car, outerTrack, outerMaxDistance, delta);
    } else if (distanceToInner < innerMinDistance) {
      this.repositionCar(car, innerTrack, innerMinDistance, delta);
    }
  }

  repositionCar(car: any, track: any, distance: any) {
    const angle = Phaser.Math.Angle.Between(track.x, track.y, car.x, car.y);
    car.x = track.x + distance * Math.cos(angle);
    car.y = track.y + distance * Math.sin(angle);

    const velocity = car.body.velocity;
    const velocityAngle = Math.atan2(velocity.y, velocity.x);
    if (
      Math.abs(Phaser.Math.Angle.ShortestBetween(angle, velocityAngle)) <
      Math.PI / 2
    ) {
      car.setVelocity(0);
    }
  }

  updateCountdown() {
    const currentNumber = parseInt(this.scene.countdownText.text, 10);
    if (currentNumber > 1) {
      this.scene.countdownText.setText(String(currentNumber - 1));
    } else if (currentNumber === 1) {
      this.scene.countdownText.setText("START!");
      this.scene.time.delayedCall(
        1000,
        () => {
          this.scene.isRaceStarted = true;
          this.scene.countdownText.setVisible(false);
        },
        [],
        this.scene
      );
    }
  }

  isCarCrossingLine(
    car: Phaser.Physics.Arcade.Sprite,
    lineY: number,
    lastYPosition: number
  ): boolean {
    const carCrossedLine =
      (lastYPosition > lineY && car.y < lineY) ||
      (lastYPosition < lineY && car.y > lineY);
    return carCrossedLine;
  }

  allCheckpointsPassed() {
    return this.scene.checkpoints.every((checkpoint) => checkpoint.passed);
  }

  spawnHazard() {
    let x, y, distanceToCenter;
    do {
      x = Phaser.Math.Between(
        this.scene.innerTrack.x - this.scene.track.radius,
        this.scene.innerTrack.x + this.scene.track.radius
      );
      y = Phaser.Math.Between(
        this.scene.innerTrack.y - this.scene.track.radius,
        this.scene.innerTrack.y + this.scene.track.radius
      );
      distanceToCenter = Phaser.Math.Distance.Between(
        x,
        y,
        this.scene.innerTrack.x,
        this.scene.innerTrack.y
      );
    } while (
      distanceToCenter < this.scene.innerTrack.radius ||
      distanceToCenter > this.scene.track.radius
    );

    const hazard = this.scene.add.polygon(
      x,
      y,
      [0, 0, 40, 0, 20, 34],
      0xff0000
    );

    this.scene.physics.world.enable(hazard);

    // Explicitly type hazard.body as Phaser.Physics.Arcade.Body
    const hazardBody = hazard.body as Phaser.Physics.Arcade.Body;

    this.scene.physics.add.collider(this.scene.playerCar, hazard);

    // Now you can use setImmovable on hazardBody
    hazardBody.setImmovable(true);
  }
}

export class Config {
  static get gameWidth() {
    return 800;
  }
  static get gameHeight() {
    return 600;
  }
  static get trackRadius() {
    return 300;
  }
  static get innerTrackRadius() {
    return 150;
  }
  static get startingLineY() {
    return 500;
  }
  static get moveSpeed() {
    return 90000;
  }
  static get rotationSpeed() {
    return 50000;
  }
}

export type GameScene = Phaser.Scene & {
  kartGameUtils: KartRaceUtils;
  track: Phaser.GameObjects.Arc;
  innerTrack: Phaser.GameObjects.Arc;
  hazards: Phaser.Physics.Arcade.Group;
  startingLine: Phaser.GameObjects.Rectangle;
  playerCar: Phaser.Physics.Arcade.Sprite;
  checkpoints: Checkpoint[];
  checkpointLines: Phaser.GameObjects.Rectangle[];
  currentCheckpointIndex: number;
  allCheckpointsPassed: boolean;
  cpuCars: Phaser.Physics.Arcade.Sprite[];
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  isRaceStarted: boolean;
  lapCount: number;
  lapText: Phaser.GameObjects.Text;
  countdownText: Phaser.GameObjects.Text;
  isColliding: boolean;
};

export type Checkpoint = {
  x: number;
  y: number;
  passed: boolean;
  line?: Phaser.GameObjects.Rectangle | null; // Define the line property
};

export interface KartRaceUtils {
  keepCarOnTrack(
    car: Phaser.Physics.Arcade.Sprite,
    outerTrack: Track,
    innerTrack: Track,
    delta: number
  ): void;
  repositionCar(
    car: Phaser.Physics.Arcade.Sprite,
    track: Track,
    distance: number,
    delta: number
  ): void;
  updateCountdown(): void;
  isCarCrossingLine(
    car: Phaser.Physics.Arcade.Sprite,
    lineY: number,
    lastYPosition: number
  ): boolean;
  allCheckpointsPassed(): boolean;
  spawnHazard(): void;
}
