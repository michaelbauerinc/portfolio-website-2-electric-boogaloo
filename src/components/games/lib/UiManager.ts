import Phaser from "phaser";

export class UIManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, resize: boolean = false) {
    this.scene = scene;

    if (resize) {
      // Automatically call resize method when the browser window is resized
      window.addEventListener("resize", this.resizeGameCanvas.bind(this));
      this.resizeGameCanvas(); // Call resize initially to set up the correct size
    }
  }

  createText(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, text, style);
  }

  createButton(
    x: number,
    y: number,
    label: string,
    callback: () => void
  ): Phaser.GameObjects.Text {
    const button = this.scene.add
      .text(x, y, label, { fontSize: "32px", color: "#fff" })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", callback);
    return button;
  }

  createImage(x: number, y: number, key: string): Phaser.GameObjects.Image {
    return this.scene.add.image(x, y, key);
  }

  createPanel(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number
  ): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(x, y, width, height, color);
  }

  showElement(element: Phaser.GameObjects.GameObject): void {
    element.setVisible(true);
  }

  hideElement(element: Phaser.GameObjects.GameObject): void {
    element.setVisible(false);
  }

  updateText(textObject: Phaser.GameObjects.Text, newText: string): void {
    textObject.setText(newText);
  }

  resizeGameCanvas() {
    const canvas = this.game.canvas,
      width = window.innerWidth,
      height = window.innerHeight;
    const wratio = width / height,
      ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
      canvas.style.width = width + "px";
      canvas.style.height = width / ratio + "px";
    } else {
      canvas.style.width = height * ratio + "px";
      canvas.style.height = height + "px";
    }

    // Optionally, you might want to center the canvas
    canvas.style.position = "absolute";
    canvas.style.left = (width - canvas.offsetWidth) / 2 + "px";
    canvas.style.top = (height - canvas.offsetHeight) / 2 + "px";
  }

  // Additional methods for progress bars, alignment utilities, etc.
}
