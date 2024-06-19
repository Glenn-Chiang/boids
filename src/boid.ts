import { Graphics, Triangle, PointData, Container } from "pixi.js";

export class Boid {
  private sprite: Graphics;

  constructor(tipPoint: PointData) {
    // Creates a boid sprite with its tip at the given tipPoint
    const boidWidth = 16;
    const boidHeight = 20;

    const vertices: PointData[] = [
      { x: tipPoint.x - boidWidth / 2, y: tipPoint.y + boidHeight },
      { x: tipPoint.x, y: tipPoint.y },
      { x: tipPoint.x + boidWidth / 2, y: tipPoint.y + boidHeight },
    ];

    const sprite = new Graphics().poly(vertices).fill("white");

    const hitArea = new Triangle(
      vertices[0].x,
      vertices[0].y,
      vertices[1].x,
      vertices[1].y,
      vertices[2].x,
      vertices[2].y
    );
    sprite.hitArea = hitArea;

    this.sprite = sprite;
  }

  // Add the boid to the given container
  spawn(container: Container) {
    container.addChild(this.sprite);
  }
}
