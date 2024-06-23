import { Application, Rectangle, Text } from "pixi.js";
import { Flock } from "./flock";
import "./index.css";

(async () => {
  const app = new Application();
  await app.init({ background: "#5DADE2", antialias: true });
  (document.getElementById("canvas-area") as HTMLDivElement).appendChild(
    app.canvas
  );

  // Set the interactive area to the whole canvas
  const interactArea = new Rectangle(0, 0, app.canvas.width, app.canvas.height);
  app.stage.hitArea = interactArea;
  app.stage.boundsArea = interactArea;

  // Display prompt for user to spawn boids
  const promptText = new Text({
    text: "Click to spawn boids",
    anchor: 0.5,
    position: { x: app.canvas.width / 2, y: app.canvas.height / 2 },
    style: {
      fontSize: 20,
      fontFamily: "consolas",
      fill: "white",
      align: "center",
    },
  });
  app.stage.addChild(promptText);

  // Flock object manages all boids
  const flock = new Flock(app.stage);

  // User can spawn new boids by clicking anywhere on the container
  app.stage.eventMode = "static";
  app.stage.on("pointerdown", (event) => {
    const clickedPos = event.global;
    flock.spawnBoid(clickedPos);
    promptText.visible = false;
  });

  app.ticker.add((ticker) => {
    flock.update(ticker.deltaTime);
  });

  const parameters = [
    {
      label: "speed",
      param: flock.speed,
    },
    {
      label: "view-radius",
      param: flock.viewRadius,
    },
    {
      label: "separation",
      param: flock.separationFactor,
    },
    {
      label: "alignment",
      param: flock.alignmentFactor,
    },
    {
      label: "cohesion",
      param: flock.cohesionFactor,
    },
  ];

  // Add event listener for each slider to control its corresponding parameter
  for (const paramMap of parameters) {
    const slider = document.getElementById(paramMap.label) as HTMLInputElement;
    const param = paramMap.param;
    // Slider value should represent the ratio of the parameter's current value relative to its min and max values
    slider.value = (
      ((param.value - param.minVal) / (param.maxVal - param.minVal)) *
      100
    ).toString();

    slider.addEventListener("input", (event) => {
      const sliderValue = (event.target as HTMLInputElement)?.value;
      const ratio = Number(sliderValue) / 100;
      param.setValue(param.minVal + ratio * (param.maxVal - param.minVal));
    });
  }
})();
