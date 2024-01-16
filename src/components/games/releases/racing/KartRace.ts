import Phaser from "phaser";
import { KartRaceUtils, Config } from "./Static";

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
        // Load the image as a texture
        this.load.image("car", "/kart.png");
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

        this.hazards = this.physics.add.group(); // Create a group for hazards

        const startingLineLength = Config.trackRadius - Config.innerTrackRadius;
        const startingLineY =
          300 + Config.innerTrackRadius + startingLineLength / 2;

        this.startingLine = this.add.rectangle(
          400,
          startingLineY,
          5,
          startingLineLength,
          0xffffff
        );
        this.physics.world.enable(
          this.startingLine,
          Phaser.Physics.Arcade.STATIC_BODY
        );

        this.playerCar = this.physics.add
          .sprite(400, Config.startingLineY, "car")
          .setScale(0.1)
          .setAngle(90);

        // Calculate the scaled dimensions
        const scaledWidth = this.playerCar.displayWidth; // or this.playerCar.width * 0.1
        const scaledHeight = this.playerCar.displayHeight; // or this.playerCar.height * 0.1

        // Update the physics body size
        this.playerCar.body.setSize(scaledWidth, scaledHeight);

        // Optionally, you can also set the offset of the physics body if needed
        // This is often necessary to ensure the body is centered on the sprite
        const offsetX = (this.playerCar.width - scaledWidth) / 2;
        const offsetY = (this.playerCar.height - scaledHeight) / 2;
        this.playerCar.body.setOffset(offsetX, offsetY);
        this.playerCar.setCollideWorldBounds(true);

        // Define checkpoints
        this.checkpoints = [
          {
            x: 400,
            y: -300 + Config.innerTrackRadius + startingLineLength / 2,
            passed: false,
          },
        ];

        // Calculate the length of the checkpoint lines
        const checkpointLineLength =
          Config.trackRadius - Config.innerTrackRadius;

        // Render checkpoints
        this.checkpointLines = this.checkpoints.map((checkpoint, index) => {
          // Set the y position of the checkpoint line
          const checkpointLineY = checkpoint.y + Config.innerTrackRadius;

          checkpoint.line = this.add.rectangle(
            checkpoint.x,
            checkpointLineY,
            5, // Width of the line
            checkpointLineLength, // Length of the line
            0xff0000 // Color
          );

          this.physics.world.enable(
            checkpoint.line,
            Phaser.Physics.Arcade.STATIC_BODY
          );

          // Set up collision for each checkpoint
          this.physics.add.overlap(this.playerCar, checkpoint.line, () => {
            if (index === this.currentCheckpointIndex) {
              checkpoint.passed = true;
              this.currentCheckpointIndex++;
              if (this.currentCheckpointIndex === this.checkpoints.length) {
                this.allCheckpointsPassed = true;
              }
            }
          });
          checkpoint.line.setVisible(false);

          return checkpoint.line;
        });

        this.currentCheckpointIndex = 0;
        this.allCheckpointsPassed = false;

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

        this.isColliding = false;
        this.physics.add.overlap(this.playerCar, this.startingLine, () => {
          if (
            this.isRaceStarted &&
            !this.isColliding &&
            this.kartGameUtils.allCheckpointsPassed()
          ) {
            this.lapCount++;
            this.lapText.setText("Laps: " + this.lapCount);
            this.kartGameUtils.spawnHazard(); // Call the function from KartRaceUtils
            this.isColliding = true;
            // Reset checkpoint states for the next lap
            this.checkpoints.forEach(
              (checkpoint) => (checkpoint.passed = false)
            );
            this.currentCheckpointIndex = 0;
            this.allCheckpointsPassed = false;
          }
        });

        this.checkpointLines.forEach((line, index) => {
          this.physics.add.overlap(this.playerCar, line, () => {
            if (index === this.currentCheckpointIndex) {
              this.check;

              points[index].passed = true;
              this.currentCheckpointIndex++;
              if (this.currentCheckpointIndex === this.checkpoints.length) {
                this.allCheckpointsPassed = true;
              }
            }
          });
        });
      },

      update: function (time, delta) {
        if (!this.isRaceStarted) {
          return;
        }

        const deltaInSeconds = delta / 1000; // Convert delta to seconds

        if (this.cursors.left.isDown) {
          this.playerCar.setAngularVelocity(
            -Config.rotationSpeed * deltaInSeconds
          );
        } else if (this.cursors.right.isDown) {
          this.playerCar.setAngularVelocity(
            Config.rotationSpeed * deltaInSeconds
          );
        } else {
          this.playerCar.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown) {
          this.physics.velocityFromRotation(
            this.playerCar.rotation - Math.PI / 2,
            Config.moveSpeed * deltaInSeconds,
            this.playerCar.body.velocity
          );
        } else {
          this.playerCar.setVelocity(0);
        }

        this.kartGameUtils.keepCarOnTrack(
          this.playerCar,
          this.track,
          this.innerTrack,
          delta
        );
        this.cpuCars.forEach((car) => {
          this.kartGameUtils.keepCarOnTrack(car, this.track, this.innerTrack);
        });
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
