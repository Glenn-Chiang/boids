import { Application, Container, Graphics, Rectangle } from "pixi.js";
import { Boid } from "./boid";

const app = new Application();
await app.init({ resizeTo: window, background: "white", antialias: true });
document.body.appendChild(app.canvas);

const containerWidth = app.canvas.width * 0.9; 
const containerHeight = app.canvas.height * 0.8;

// Main container in which boids will be spawned
const container = new Container();
container.boundsArea = new Rectangle(0, 0, containerWidth, containerHeight)
app.stage.addChild(container);

// Background graphic for the container
const background = new Graphics()
  .rect(0, 0, containerWidth, containerHeight)
  .fill("#5DADE2");
container.addChild(background);

// Array containing all boids spawned
const boids: Boid[] = [];

// User can spawn new boids by clicking anywhere on the container
container.eventMode = "static";
container.on("pointerdown", (event) => {
  const clickedPos = event.global;
  const boid = new Boid(clickedPos);
  boid.spawn(container);
  boids.push(boid);
});

app.ticker.add((ticker) => {
  // Iterate over every boid and update their movement
  for (const boid of boids) {
    boid.update(boids, ticker.deltaTime);

    // If the boid moves beyond the container boundaries, teleport it to the other side of the container
    if (
      !container.getBounds().containsPoint(boid.position.x, boid.position.y)
    ) {
      const offset = 2; // Required to prevent glitchy teleportation
      const xOffset = boid.position.x > container.width ? offset : -offset;
      const yOffset = boid.position.y > container.height ? offset : -offset;
      boid.setPosition({
        x: container.getBounds().width - boid.position.x + xOffset,
        y: container.getBounds().height - boid.position.y + yOffset,
      });
    }
  }
});

// Absolutely clean implementation of responsive design :)
window.onresize = () => {
  const newWidth = app.canvas.width
  const newHeight = app.canvas.height
  background.width = newWidth;
  background.setSize(newWidth, newHeight)
  container.boundsArea = new Rectangle(0, 0, newWidth, newHeight)
};
