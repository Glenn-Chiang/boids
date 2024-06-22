import {
  Application,
  Container,
  Graphics,
  Rectangle
} from "pixi.js";
import { Boid } from "./boid";
import { makeWidget, widgetWidth } from "./widgets";
import { Flock } from "./flock";

const app = new Application();
await app.init({ resizeTo: window, background: "white", antialias: true });
document.body.appendChild(app.canvas);

const containerProportion = 0.8;
const containerWidth = 800;
const containerHeight = 640

// Main container in which boids will be spawned
const container = new Container();
container.boundsArea = new Rectangle(0, 0, containerWidth, containerHeight);
app.stage.addChild(container);

// Background graphic for the container
const background = new Graphics()
  .rect(0, 0, containerWidth, containerHeight)
  .fill("#5DADE2");
container.addChild(background);

// Manages all boids
const flock = new Flock(container)

// User can spawn new boids by clicking anywhere on the container
container.eventMode = "static";
container.on("pointerdown", (event) => {
  const clickedPos = event.global;
  flock.spawnBoid(clickedPos)
});

app.ticker.add((ticker) => {
  flock.update(ticker.deltaTime)
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
  // const newWidth = app.canvas.width;
  // const newHeight = app.canvas.height * containerProportion;
  // background.width = newWidth;
  // background.setSize(newWidth, newHeight);
  // container.boundsArea = new Rectangle(0, 0, newWidth, newHeight);

};
