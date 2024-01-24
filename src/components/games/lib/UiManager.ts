import Phaser from "phaser";
import { BaseScene } from ".";

export class UIManager {
  private scene: BaseScene;
  private static readonly UIDepth = 1000; // A high depth value for UI elements

  constructor(scene: BaseScene, resize: boolean = false) {
    this.scene = scene;

    if (resize) {
      window.addEventListener("resize", this.resizeGameCanvas.bind(this));
      this.resizeGameCanvas();
    }
  }

  // Convert a percentage to a pixel value based on canvas size
  getCanvasRelativeSize(percentage: number, isWidth: boolean) {
    const size = isWidth
      ? this.scene.game.canvas.width
      : this.scene.game.canvas.height;
    return (percentage / 100) * size;
  }

  createText(
    xPercent: number,
    yPercent: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    fixedPosition: boolean = true
  ): Phaser.GameObjects.Text {
    const x = this.getCanvasRelativeSize(xPercent, true);
    const y = this.getCanvasRelativeSize(yPercent, false);
    const createdText = this.scene.add.text(x, y, text, style);
    if (fixedPosition) {
      createdText.setScrollFactor(0);
    }
    createdText.setDepth(UIManager.UIDepth);
    return createdText;
  }

  createButton(
    xPercent: number,
    yPercent: number,
    label: string,
    actionName: string,
    fixedPosition: boolean = true
  ): Phaser.GameObjects.Text {
    const x = this.getCanvasRelativeSize(xPercent, true);
    const y = this.getCanvasRelativeSize(yPercent, false);

    // Common style for all buttons
    const style = {
      fontSize: "32px",
      color: "#000", // Black text color
      backgroundColor: "#888", // Gray background color
      padding: { x: 10, y: 5 },
      borderRadius: 0,
    };

    const button = this.scene.add
      .text(x, y, label, style)
      .setVisible(true)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () =>
        this.scene.inputManager.activateAction(actionName)
      )
      .on("pointerup", () =>
        this.scene.inputManager.deactivateAction(actionName)
      )
      .on("pointerover", () => button.setStyle({ fill: "#F00" })) // Change color on hover
      .on("pointerout", () => button.setStyle({ fill: style.color })); // Revert color

    if (fixedPosition) {
      button.setScrollFactor(0);
    }
    button.setDepth(UIManager.UIDepth);
    return button;
  }

  createImage(
    xPercent: number,
    yPercent: number,
    key: string
  ): Phaser.GameObjects.Image {
    const x = this.getCanvasRelativeSize(xPercent, true);
    const y = this.getCanvasRelativeSize(yPercent, false);
    const image = this.scene.add.image(x, y, key);
    image.setDepth(UIManager.UIDepth);
    return image;
  }

  createPanel(
    xPercent: number,
    yPercent: number,
    widthPercent: number,
    heightPercent: number,
    color: number
  ): Phaser.GameObjects.Rectangle {
    const x = this.getCanvasRelativeSize(xPercent, true);
    const y = this.getCanvasRelativeSize(yPercent, false);
    const width = this.getCanvasRelativeSize(widthPercent, true);
    const height = this.getCanvasRelativeSize(heightPercent, false);
    const panel = this.scene.add.rectangle(x, y, width, height, color);
    panel.setDepth(UIManager.UIDepth);
    return panel;
  }
  showElement(element: Phaser.GameObjects.Text): void {
    element.setVisible(true);
  }

  hideElement(element: Phaser.GameObjects.Text): void {
    element.setVisible(false);
  }

  updateText(textObject: Phaser.GameObjects.Text, newText: string): void {
    textObject.setText(newText);
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

    // Check if the device is likely a mobile device
    const isMobile = this.isMobileDevice();

    // Toggle visibility of mobile controls
    this.toggleMobileControlsVisibility(isMobile);
  }

  // Helper function to detect mobile devices
  isMobileDevice() {
    const userAgent = navigator.userAgent;
    const isTouchScreen = "ontouchstart" in window;
    return (
      /android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos/i.test(
        userAgent
      ) || isTouchScreen
    );
  }

  createOnScreenControls() {
    const dpad = {
      up: this.createButton(10, 82, "↑", "moveUp"),
      down: this.createButton(10, 92, "↓", "moveDown"),
      left: this.createButton(5, 87, "←", "moveLeft"),
      right: this.createButton(15, 87, "→", "moveRight"),
    };

    const aButton = this.createButton(90, 90, "A", "jump", true);

    // Adjust sizes, styles, and positions as necessary
    this.scene.gameState.state.mobileControls = [dpad, aButton];

    return { dpad, aButton };
  }

  toggleMobileControlsVisibility(visible: boolean) {
    const dpad = this.scene.gameState.state.mobileControls[0];
    const aButton = this.scene.gameState.state.mobileControls[1];
    aButton.setVisible(visible);
    dpad.up.setVisible(visible);
    dpad.down.setVisible(visible);
    dpad.left.setVisible(visible);
    dpad.right.setVisible(visible);
  }
}
