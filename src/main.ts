import { Application, Container, Graphics, PointData, Triangle } from "pixi.js";
import { Boid } from "./boid";

(async () => {
  const app = new Application();
  await app.init({ resizeTo: window, background: "white", antialias: true });
  document.body.appendChild(app.canvas);

  const containerWidth = 800;
  const containerHeight = 640;
  const container = new Container();
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
  });
})();
