import {
  Application,
  Container,
  Graphics,
  Rectangle
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

// Background graphic for the container
const background = new Graphics()
  .rect(0, 0, containerWidth, containerHeight)
  .fill("#5DADE2");
// container.mask = background WHY THE FUCK DOESNT THIS WORK???????????
container.addChild(background);

// Array containing all boids spawned
const boids: Boid[] = [];

// User can spawn new boids by clicking anywhere on the container
container.eventMode = 'static'
container.on('pointerdown', (event) => {
  const clickedPos = event.global
  const boid = new Boid(clickedPos)
  boid.spawn(container)
  boids.push(boid)
})


app.ticker.add((ticker) => {
  // Iterate over every boid and update their movement
  for (const boid of boids) {
    boid.move(ticker.deltaTime);
  
    // If the boid moves beyond the container boundaries, teleport it to the other side of the container
    if (!container.getBounds().containsPoint(boid.position.x, boid.position.y)) {
      boid.setPosition({
        x: container.getBounds().width - boid.position.x,
        y: container.getBounds().height - boid.position.y,
      });
    }
  }
});
