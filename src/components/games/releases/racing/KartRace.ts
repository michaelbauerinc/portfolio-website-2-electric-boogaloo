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
        // ... [preload function code]
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
          .setCircle(15);
        this.playerCar.setCollideWorldBounds(true);
        this.playerCar.setAngle(90);

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

      update: function () {
        if (!this.isRaceStarted) {
          return;
        }

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
            Config.moveSpeed, // Use the moveSpeed from Config
            this.playerCar.body.velocity
          );
        } else {
          this.playerCar.setVelocity(0);
        }

        // ... [rest of your update code]

        this.kartGameUtils.keepCarOnTrack(
          this.playerCar,
          this.track,
          this.innerTrack
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
