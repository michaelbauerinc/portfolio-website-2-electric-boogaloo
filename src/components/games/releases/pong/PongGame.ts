import Phaser from "phaser";

// Define types for the game scene and utilities
type GameScene = Phaser.Scene & {
  scoreLeft: number;
  scoreRight: number;
  scoreText: Phaser.GameObjects.Text;
  instructionsText: Phaser.GameObjects.Text;
  ball: Phaser.Physics.Arcade.Sprite | null; // Added null type
  paddleLeft: Phaser.Physics.Arcade.Sprite | null; // Added null type
  paddleRight: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  gameUtils: GameUtils;
  hitboxLeft: Phaser.GameObjects.Zone | null; // Declare hitboxLeft property
  hitboxRight: Phaser.GameObjects.Zone | null; // Declare hitboxRight property
};

// Utility class for game-related functions
class GameUtils {
  private scene: GameScene;

  constructor(scene: GameScene) {
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

  updateScore(winner: "left" | "right") {
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
    if (this.scene.ball) {
      const velocity = this.scene.ball?.body?.velocity; // Added optional chaining
      if (velocity) {
        velocity.x *= 1.1; // Increase speed by 10%
        velocity.y *= 1.1;
        this.scene.ball.setVelocity(velocity.x, velocity.y);
      }
    }
  }

  resizeGameCanvas() {
    const canvas = this.scene.game.canvas;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Resize the canvas based on the window size
    const wratio = width / height;
    const ratio = canvas.width / canvas.height;
    if (wratio < ratio) {
      canvas.style.width = width + "px";
      canvas.style.height = width / ratio + "px";
    } else {
      canvas.style.width = height * ratio + "px";
      canvas.style.height = height + "px";
    }

    // Center the canvas
    // canvas.style.position = "absolute";
    canvas.style.left = (width - canvas.offsetWidth) / 2 + "px";
    canvas.style.top = (height - canvas.offsetHeight) / 2 + "px";
  }
}

export const PongGame = (domElement: HTMLElement) => {
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

      preload(this: GameScene) {
        // No assets to load in this version
      },

      create(this: GameScene) {
        // Create game utility instance
        this.gameUtils = new GameUtils(this);

        // Create left paddle closer to the center
        this.paddleLeft = this.physics.add
          .sprite(100, 300, "paddle")
          .setImmovable();

        if (this.paddleLeft.body) {
          // Added null check
          this.paddleLeft.body.setSize(20, 100);
          this.paddleLeft.displayWidth = 10;
          this.paddleLeft.displayHeight = 100;
        }

        this.paddleRight = this.physics.add
          .sprite(700, 300, "paddle")
          .setImmovable();
        // Create right paddle closer to the center
        if (this.paddleRight.body) {
          this.paddleRight.body.setSize(10, 100);
          this.paddleRight.displayWidth = 10;
          this.paddleRight.displayHeight = 100;
        }

        // Create ball
        this.ball = this.physics.add
          .sprite(400, 300, "ball")
          .setCollideWorldBounds(true)
          .setBounce(1);
        if (this.ball && this.ball.body) {
          // Added null check
          this.ball.body.setCircle(10); // Assuming the ball is circular
          this.ball.setVelocity(200, 30);
        }

        // Paddle-ball collision handling
        this.physics.add.collider(this.ball, this.paddleLeft, () =>
          this.gameUtils.increaseBallSpeed()
        );
        this.physics.add.collider(this.ball, this.paddleRight, () =>
          this.gameUtils.increaseBallSpeed()
        );

        // Input
        if (this.input.keyboard) {
          this.cursors = this.input.keyboard.createCursorKeys();
          // Reset button
          this.input.keyboard.on("keydown-R", () => {
            this.gameUtils.resetGame();
          });
        }

        // Display score
        this.scoreText = this.add
          .text(400, 50, "0 - 0", { fontSize: "32px", color: "#FFF" }) // Use 'color' instead of 'fill'
          .setOrigin(0.5);
        this.instructionsText = this.add
          .text(400, 550, "Press R to Reset", {
            fontSize: "24px",
            color: "#FFF",
          }) // Use 'color' instead of 'fill'
          .setOrigin(0.5);

        // Add left and right hitboxes
        this.hitboxLeft = this.add
          .zone(0, 300, 1, 500) // Provide width and height arguments
          .setOrigin(0, 0.5);
        this.physics.world.enable(
          this.hitboxLeft,
          Phaser.Physics.Arcade.STATIC_BODY
        );

        this.hitboxRight = this.add
          .zone(900, 300, 1, 500) // Provide width and height arguments
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
          undefined, // Use undefined instead of null
          this
        );
        this.physics.add.overlap(
          this.ball,
          this.hitboxRight,
          () => this.gameUtils.updateScore("left"),
          undefined, // Use undefined instead of null
          this
        );

        if (this.ball) {
          this.gameUtils.resetBall(); // Reset the ball when the game is first created
        }
        this.gameUtils.updateScoreText(); // Initialize the score text
      },

      update(this: GameScene) {
        // Reduced paddle movement sensitivity
        const paddleSpeed = 5;

        // Control left paddle
        if (this.cursors.up.isDown && this.paddleLeft) {
          this.paddleLeft.y -= paddleSpeed;
        } else if (this.cursors.down.isDown && this.paddleLeft) {
          this.paddleLeft.y += paddleSpeed;
        }

        // Control right paddle (for simplicity, we'll make it follow the ball)
        if (this.paddleRight && this.ball) {
          this.paddleRight.y = this.ball.y;
        }

        // Ball and paddle boundary checks
        if (this.paddleLeft) {
          if (this.paddleLeft.y < 50) this.paddleLeft.y = 50;
          else if (this.paddleLeft.y > 550) this.paddleLeft.y = 550;
        }
        if (this.paddleRight) {
          if (this.paddleRight.y < 50) this.paddleRight.y = 50;
          else if (this.paddleRight.y > 550) this.paddleRight.y = 550;
        }
        this.gameUtils.resizeGameCanvas();
      },
    },
  };
};
