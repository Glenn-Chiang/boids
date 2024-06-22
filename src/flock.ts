import { Container } from "pixi.js";
import { Boid } from "./boid";
import { Parameter } from "./parameter";

export class Flock {
  container: Container;

  readonly viewRadius = new Parameter(120, 80, 160); // TODO:View field also needs to be updated whenever viewRadius param is updated
  readonly speedParam = new Parameter(4, 2, 8); // Movement speed
  readonly separationParam = new Parameter(0.05, 0, 0.05);
  readonly alignmentParam = new Parameter(0.05, 0, 0.05);
  readonly cohesionParam = new Parameter(0.0025, 0, 0.005);

  boids: Boid[] = [];

  constructor(container: Container) {
    this.container = container;
  }

  addBoid(boid: Boid): void {
    this.boids.push(boid);
  }

  update(deltaTime: number): void {
    // Iterate over every boid and update their movement
    for (const boid of this.boids) {
      boid.update(this.boids, deltaTime);

      // If the boid moves beyond the container boundaries, teleport it to the other side of the container
      if (
        !this.container
          .getBounds()
          .containsPoint(boid.position.x, boid.position.y)
      ) {
        const offset = 2; // Required to prevent glitchy teleportation
        const xOffset =
          boid.position.x > this.container.width ? offset : -offset;
        const yOffset =
          boid.position.y > this.container.height ? offset : -offset;
        boid.setPosition({
          x: this.container.getBounds().width - boid.position.x + xOffset,
          y: this.container.getBounds().height - boid.position.y + yOffset,
        });
      }
    }
  }

  resetParams(): void {
    for (const param of [
      this.speedParam,
      this.separationParam,
      this.alignmentParam,
      this.cohesionParam,
    ]) {
      param.reset();
    }
  }
}
