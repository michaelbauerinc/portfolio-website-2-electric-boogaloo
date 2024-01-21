import Phaser from "phaser";

export class AnimationManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createAnimation(
    animationKey: string,
    key: string,
    frameStart: number,
    frameEnd: number,
    frameRate: number = 10,
    repeat: number = -1
  ) {
    if (!this.scene.anims.exists(animationKey)) {
      const animationConfig: Phaser.Types.Animations.Animation = {
        key: key,
        frames: this.scene.anims.generateFrameNumbers(key, {
          start: frameStart,
          end: frameEnd,
        }),
        frameRate: frameRate,
        repeat: repeat, // To make it loop continuously
      };

      try {
        this.scene.anims.create({
          ...animationConfig,
          key: animationKey,
        });
        // console.log(`Animation '${animationKey}' created successfully.`);
      } catch (error) {
        console.error(`Error creating animation '${animationKey}':`, error);
      }
    }
  }

  playAnimationOn(
    sprite: Phaser.GameObjects.Sprite,
    animationKey: string,
    ignoreIfPlaying: boolean = false
  ) {
    // if (sprite.anims && (!sprite.anims.isPlaying || !ignoreIfPlaying)) {
    try {
      // console.log()
      sprite.play(animationKey, ignoreIfPlaying);
      // console.log(`Playing animation '${animationKey}' on sprite.`);
    } catch (error) {
      console.error(`Error playing animation '${animationKey}':`, error);
    }
    // }
  }

  stopAnimationOn(sprite: Phaser.GameObjects.Sprite) {
    if (sprite.anims) {
      try {
        sprite.stop();
        // console.log(`Animation stopped on sprite.`);
      } catch (error) {
        console.error(`Error stopping animation on sprite:`, error);
      }
    }
  }

  pauseAnimationOn(sprite: Phaser.GameObjects.Sprite) {
    if (sprite.anims && sprite.anims.isPlaying) {
      try {
        sprite.anims.pause();
        // console.log(`Animation paused on sprite.`);
      } catch (error) {
        console.error(`Error pausing animation on sprite:`, error);
      }
    }
  }

  resumeAnimationOn(sprite: Phaser.GameObjects.Sprite) {
    if (sprite.anims && sprite.anims.isPaused) {
      try {
        sprite.anims.resume();
        // console.log(`Animation resumed on sprite.`);
      } catch (error) {
        console.error(`Error resuming animation on sprite:`, error);
      }
    }
  }
}
