import { Graphics, Triangle, PointData, Container } from "pixi.js";

interface Velocity {
  x: number;
  y: number;
}

export class Boid {
  private sprite: Graphics;

  private velocity: Velocity = { x: 1, y: -1 };

  constructor(tipPoint: PointData) {
    // Creates a boid sprite with its tip at the given tipPoint
    const boidWidth = 16;
    const boidHeight = 20;

    // The 3 vertices of the triangle. Positions are relative to the tip point
    const vertices: PointData[] = [
      { x: -boidWidth / 2, y: boidHeight },
      { x: 0, y: 0},
      { x: boidWidth / 2, y: boidHeight },
    ];

    const sprite = new Graphics().poly(vertices).fill("white");
    // The center and pivot of the boid is at its tip
    sprite.x = tipPoint.x;
    sprite.y = tipPoint.y;

    // Hit area of the sprite
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

  move(deltaTime: number) {
    this.sprite.x += this.velocity.x * deltaTime
    this.sprite.y += this.velocity.y * deltaTime
    this.sprite.rotation = -Math.atan2(this.velocity.y, this.velocity.x)
  }
}
