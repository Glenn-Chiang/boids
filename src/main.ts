import {
  Application,
  Container,
  Graphics,
  PointData,
  Rectangle,
  Text,
  TextStyle,
} from "pixi.js";
import { Boid } from "./boid";
import { makeWidget, widgetWidth } from "./widgets";

const app = new Application();
await app.init({ resizeTo: window, background: "white", antialias: true });
document.body.appendChild(app.canvas);

const containerProportion = 0.8;
const containerWidth = app.canvas.width;
const containerHeight = app.canvas.height * containerProportion;

// Main container in which boids will be spawned
const container = new Container();
container.boundsArea = new Rectangle(0, 0, containerWidth, containerHeight);
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

// Panel containing widgets to adjust simulation parameters
const parameters = ["Speed", "View radius", "Separation", "Alignment", "Cohesion"]

const widgetPanel = new Container({ x: 0, y: container.height });

app.stage.addChild(widgetPanel);

const widgets: Container[] = []
for (let i = 0; i < parameters.length; i++) {
  const param = parameters[i]
  const widget = makeWidget({x: i * widgetWidth, y: 0}, param)
  widgetPanel.addChild(widget)
  widgets.push(widget)
}

// Absolutely clean implementation of responsive design :)
window.onresize = () => {
  const newWidth = app.canvas.width;
  const newHeight = app.canvas.height * containerProportion;
  background.width = newWidth;
  background.setSize(newWidth, newHeight);
  container.boundsArea = new Rectangle(0, 0, newWidth, newHeight);

};
