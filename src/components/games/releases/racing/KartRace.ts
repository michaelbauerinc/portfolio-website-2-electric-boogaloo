import Phaser from "phaser";

class KartRaceUtils {
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
}

class Config {
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
}

export const KartRace = (domElement) => {
  return {
    type: Phaser.AUTO,
    width: Config.gameWidth,
    height: Config.gameHeight,
    parent: domElement,
    backgroundColor: "#000000",
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
    scene: {
      preload: function () {
        // ... [preload function]
      },

      create: function () {
        this.kartGameUtils = new KartRaceUtils(this);

        this.track = this.add.circle(400, 300, Config.trackRadius, 0x666666);
        this.physics.world.enable(
          this.track,
          Phaser.Physics.Arcade.STATIC_BODY
        );

        this.innerTrack = this.add.circle(
          400,
          300,
          Config.innerTrackRadius,
          0x888888
        );
        this.physics.world.enable(
          this.innerTrack,
          Phaser.Physics.Arcade.STATIC_BODY
        );

        // Calculate the length of the starting line
        const startingLineLength = Config.trackRadius - Config.innerTrackRadius;

        // Calculate the starting Y position of the line
        const startingLineY =
          300 + Config.innerTrackRadius + startingLineLength / 2;

        // Create the starting line
        this.startingLine = this.add.rectangle(
          400, // X position (center of the track)
          startingLineY, // Y position (calculated)
          5, // Width of the line
          startingLineLength, // Length of the line
          0xffffff // Color
        );
        this.physics.world.enable(
          this.startingLine,
          Phaser.Physics.Arcade.STATIC_BODY
        );

        this.playerCar = this.physics.add
          .sprite(400, Config.startingLineY, "car")
          .setCircle(15);
        this.playerCar.setCollideWorldBounds(true);

        this.cpuCars = [
          // ... [Add CPU cars]
        ];

        this.cursors = this.input.keyboard.createCursorKeys();

        this.isRaceStarted = false;
        this.lapCount = 0;
        this.lapText = this.add.text(700, 20, "Laps: 0", {
          fontSize: "20px",
          fill: "#FFF",
        });

        this.countdownText = this.add
          .text(400, 200, "3", { fontSize: "64px", fill: "#FFF" })
          .setOrigin(0.5);
        this.time.addEvent({
          delay: 1000,
          callback: () => this.kartGameUtils.updateCountdown(),
          callbackScope: this,
          repeat: 2,
        });
        this.isColliding = false; // Flag to track collision state
        this.physics.add.overlap(this.playerCar, this.startingLine, () => {
          if (this.isRaceStarted && !this.isColliding) {
            this.lapCount++;
            this.lapText.setText("Laps: " + this.lapCount);
            this.isColliding = true;
          }
        });
      },

      update: function () {
        if (!this.isRaceStarted) {
          return;
        }

        // Car control logic
        if (this.cursors.left.isDown) {
          this.playerCar.setAngularVelocity(-150);
        } else if (this.cursors.right.isDown) {
          this.playerCar.setAngularVelocity(150);
        } else {
          this.playerCar.setAngularVelocity(0);
        }
        if (this.cursors.up.isDown) {
          this.physics.velocityFromRotation(
            this.playerCar.rotation - Math.PI / 2,
            200,
            this.playerCar.body.velocity
          );
        } else {
          this.playerCar.setVelocity(0);
        }

        // Track boundary logic
        this.kartGameUtils.keepCarOnTrack(
          this.playerCar,
          this.track,
          this.innerTrack
        );
        this.cpuCars.forEach((car) => {
          this.kartGameUtils.keepCarOnTrack(car, this.track, this.innerTrack);
        });

        // Check if the car is no longer colliding with the line
        if (
          this.isColliding &&
          !this.physics.overlap(this.playerCar, this.startingLine)
        ) {
          this.isColliding = false;
        }

        // Reset collision flag when the car is sufficiently away from the starting line
        if (
          this.isColliding &&
          !this.physics.overlap(this.playerCar, this.startingLine)
        ) {
          this.isColliding = false;
        }
      },
    },
  };
};
