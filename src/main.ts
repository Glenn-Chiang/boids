import './index.css'
import { Application, Container, Graphics, Rectangle, Text } from "pixi.js";
import { Flock } from "./flock";

(async () => {
  const app = new Application();
  await app.init({ background: "white", antialias: true });
  (document.getElementById('canvas-area') as HTMLDivElement).appendChild(app.canvas);
  
  const CONTAINER_WIDTH = 800;
  const CONTAINER_HEIGHT = 640;

  // Main container in which boids will be spawned
  const container = new Container();
  container.boundsArea = new Rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
  app.stage.addChild(container);

  // Background graphic for the container
  const background = new Graphics()
    .rect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT)
    .fill("#5DADE2");
  container.addChild(background);

  // Add mask to hide boids outside container
  const mask = new Graphics()
    .rect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT)
    .fill("white");
  container.mask = mask;

  // Display prompt for user to spawn boids
  const promptText = new Text({
    text: "Click to spawn boids",
    anchor: 0.5,
    position: { x: CONTAINER_WIDTH / 2, y: CONTAINER_HEIGHT / 2 },
    style: {
      fontSize: 20,
      fontFamily: "consolas",
      fill: "white",
      align: "center",
    },
  });

  container.addChild(promptText);

  // Manages all boids
  const flock = new Flock(container);

  // User can spawn new boids by clicking anywhere on the container
  container.eventMode = "static";
  container.on("pointerdown", (event) => {
    const clickedPos = event.global;
    flock.spawnBoid(clickedPos);
    promptText.visible = false;
  });

  app.ticker.add((ticker) => {
    flock.update(ticker.deltaTime);
  });

  const parameters = [
    {
      label: "Speed",
      param: flock.speed,
    },
    {
      label: "View radius",
      param: flock.viewRadius,
    },
    {
      label: "Separation",
      param: flock.separationFactor,
    },
    {
      label: "Alignment",
      param: flock.alignmentFactor,
    },
    {
      label: "Cohesion",
      param: flock.cohesionFactor,
    },
  ];

  const dashboard = document.getElementById('dashboard') as HTMLElement

  
  
})();
