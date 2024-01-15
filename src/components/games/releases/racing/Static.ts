export class KartRaceUtils {
  constructor(scene) {
    this.scene = scene;
  }

  // Function to keep the player car within the outer track and outside the inner track boundaries
  keepCarOnTrack(car, outerTrack, innerTrack) {
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

    const outerMaxDistance = outerTrack.radius - car.width / 2;
    const innerMinDistance = innerTrack.radius + car.width / 2;

    if (distanceToOuter > outerMaxDistance) {
      this.repositionCar(car, outerTrack, outerMaxDistance);
    } else if (distanceToInner < innerMinDistance) {
      this.repositionCar(car, innerTrack, innerMinDistance);
    }
  }

  repositionCar(car, track, distance) {
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
    const currentNumber = parseInt(this.scene.countdownText.text);
    if (currentNumber > 1) {
      console.log("hit 1");
      this.scene.countdownText.setText(String(currentNumber - 1));
    } else if (currentNumber === 1) {
      console.log("hit 2");
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

  static isCarCrossingLine(car, lineY, lastYPosition) {
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
    this.scene.hazards.add(hazard);

    // Add collision between the player car and the hazard
    this.scene.physics.add.collider(this.scene.playerCar, hazard);
    hazard.body.setImmovable(true);
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
    return 500;
  }
}
