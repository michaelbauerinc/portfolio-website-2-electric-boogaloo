import Phaser from "phaser";

// Utility class for game-related functions
class GameUtils {
  constructor(scene) {
    this.scene = scene;
  }

  resetBall() {
    if (this.scene && this.scene.ball) {
      this.scene.ball.setPosition(400, 300);
      this.scene.ball.setVelocity(200, 30); // Reset to initial velocity
    }
  }

  resetGame() {
    this.resetBall();
    this.scene.scoreLeft = 0;
    this.scene.scoreRight = 0;
    this.updateScoreText();
  }

  updateScore(winner) {
    if (winner === "left") {
      this.scene.scoreLeft++;
    } else {
      this.scene.scoreRight++;
    }
    this.updateScoreText();
    this.resetBall(); // Reset the ball after updating the score
  }

  updateScoreText() {
    // Ensure that score values are numbers
    this.scene.scoreLeft = this.scene.scoreLeft || 0;
    this.scene.scoreRight = this.scene.scoreRight || 0;

    this.scene.scoreText.setText(
      `${this.scene.scoreLeft} - ${this.scene.scoreRight}`
    );
  }

  increaseBallSpeed() {
    let velocity = this.scene.ball.body.velocity;
    velocity.x *= 1.1; // Increase speed by 10%
    velocity.y *= 1.1;
    this.scene.ball.setVelocity(velocity.x, velocity.y);
  }
}

export const PongGame = (domElement) => {
  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: domElement,
    backgroundColor: "#800080", // Purple background
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
      },
    },
    scene: {
      // Initialize score variables
      scoreLeft: 0,
      scoreRight: 0,
      scoreText: null,
      instructionsText: null,

      preload: function () {
        // No assets to load in this version
      },

      create: function () {
        // Create game utility instance
        this.gameUtils = new GameUtils(this);

        // Create left paddle closer to the center
        this.paddleLeft = this.physics.add
          .sprite(100, 300, "paddle")
          .setImmovable();
        this.paddleLeft.body.setSize(20, 100);
        this.paddleLeft.displayWidth = 10;
        this.paddleLeft.displayHeight = 100;

        // Create right paddle closer to the center
        this.paddleRight = this.physics.add
          .sprite(700, 300, "paddle")
          .setImmovable();
        this.paddleRight.body.setSize(10, 100);
        this.paddleRight.displayWidth = 10;
        this.paddleRight.displayHeight = 100;

        // Create ball
        this.ball = this.physics.add
          .sprite(400, 300, "ball")
          .setCollideWorldBounds(true)
          .setBounce(1);
        this.ball.body.setCircle(10); // Assuming the ball is circular
        this.ball.setVelocity(200, 30);

        // Paddle-ball collision handling
        this.physics.add.collider(this.ball, this.paddleLeft, () =>
          this.gameUtils.increaseBallSpeed()
        );
        this.physics.add.collider(this.ball, this.paddleRight, () =>
          this.gameUtils.increaseBallSpeed()
        );

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Display score
        this.scoreText = this.add
          .text(400, 50, "0 - 0", { fontSize: "32px", fill: "#FFF" })
          .setOrigin(0.5);
        this.instructionsText = this.add
          .text(400, 550, "Press R to Reset", {
            fontSize: "24px",
            fill: "#FFF",
          })
          .setOrigin(0.5);

        // Reset button
        this.input.keyboard.on("keydown-R", () => {
          this.gameUtils.resetGame();
        });

        // Add left and right hitboxes
        this.hitboxLeft = this.add
          .zone(0, 300)
          .setSize(1, 500)
          .setOrigin(0, 0.5);
        this.physics.world.enable(
          this.hitboxLeft,
          Phaser.Physics.Arcade.STATIC_BODY
        );
        this.hitboxRight = this.add
          .zone(900, 300)
          .setSize(1, 500)
          .setOrigin(1, 0.5);
        this.physics.world.enable(
          this.hitboxRight,
          Phaser.Physics.Arcade.STATIC_BODY
        );

        // Add collisions for hitboxes
        this.physics.add.overlap(
          this.ball,
          this.hitboxLeft,
          () => this.gameUtils.updateScore("right"),
          null,
          this
        );
        this.physics.add.overlap(
          this.ball,
          this.hitboxRight,
          () => this.gameUtils.updateScore("left"),
          null,
          this
        );

        this.gameUtils.resetBall(); // Reset the ball when the game is first created
        this.gameUtils.updateScoreText(); // Initialize the score text
      },

      update: function () {
        // Reduced paddle movement sensitivity
        const paddleSpeed = 5;

        // Control left paddle
        if (this.cursors.up.isDown) {
          this.paddleLeft.y -= paddleSpeed;
        } else if (this.cursors.down.isDown) {
          this.paddleLeft.y += paddleSpeed;
        }

        // Control right paddle (for simplicity, we'll make it follow the ball)
        this.paddleRight.y = this.ball.y;

        // Ball and paddle boundary checks
        if (this.paddleLeft.y < 50) this.paddleLeft.y = 50;
        else if (this.paddleLeft.y > 550) this.paddleLeft.y = 550;
        if (this.paddleRight.y < 50) this.paddleRight.y = 50;
        else if (this.paddleRight.y > 550) this.paddleRight.y = 550;
      },
    },
  };
};
