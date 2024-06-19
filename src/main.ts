import {
  Application,
  Container,
  Graphics,
  PointData,
  Rectangle,
} from "pixi.js";
import { Boid } from "./boid";

const app = new Application();
await app.init({ resizeTo: window, background: "white", antialias: true });
document.body.appendChild(app.canvas);

// Main container in which boids will live
const containerWidth = 800;
const containerHeight = 640;
const container = new Container();
// Rectangle representing the container area
const containerBounds = new Rectangle(0, 0, containerWidth, containerHeight);
container.boundsArea = containerBounds;
app.stage.addChild(container);

const background = new Graphics()
  .rect(0, 0, containerWidth, containerHeight)
  .fill("#5DADE2");
container.addChild(background);

const boid = new Boid({
  x: containerWidth / 2,
  y: containerHeight / 2,
});
boid.spawn(container);

const centreDot = new Graphics()
  .circle(containerWidth / 2, containerHeight / 2, 4)
  .fill("red");
container.addChild(centreDot);

app.ticker.add((ticker) => {
  boid.move(ticker.deltaTime);

  // If the boid moves beyond the container boundaries, teleport it to the other side of the container
  if (!container.getBounds().containsPoint(boid.position.x, boid.position.y)) {
    boid.setPosition({
      x: container.getBounds().width - boid.position.x,
      y: container.getBounds().height - boid.position.y,
    });
  }
});
