import { Application, Container, Graphics, PointData, Triangle } from "pixi.js";

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

  const boidSprite = createBoid({
    x: containerWidth / 2,
    y: containerHeight / 2,
  });
  container.addChild(boidSprite);
})();

// Creates a boid sprite with its tip at the given tipPoint
function createBoid(tipPoint: PointData) {
  const boidWidth = 16;
  const boidHeight = 20;

  const vertices: PointData[] = [
    { x: tipPoint.x - boidWidth / 2, y: tipPoint.y + boidHeight },
    { x: tipPoint.x, y: tipPoint.y },
    { x: tipPoint.x + boidWidth / 2, y: tipPoint.y + boidHeight },
  ];

  const boidSprite = new Graphics().poly(vertices).fill("white");

  const boidArea = new Triangle(
    vertices[0].x,
    vertices[0].y,
    vertices[1].x,
    vertices[1].y,
    vertices[2].x,
    vertices[2].y
  );
  boidSprite.hitArea = boidArea;

  return boidSprite;
}
