import {
  Circle,
  Container,
  Graphics,
  Point,
  PointData,
  RAD_TO_DEG,
  Triangle,
} from "pixi.js";
import { Vector } from "./vector";

export class Boid {
  private readonly container: Container;
  private readonly sprite: Graphics;

  private velocity: Vector;

  private readonly viewRadius = 120;
  // Area in which the boid is aware of other boids
  private readonly viewField: Circle;

  private speed = 4;

  // Minimum distance between one boid and another.
  // If a neighboring boid is within this distance, this boid will move away from that neighbor.
  private minDistance = 20;

  constructor(startPos: PointData) {
    this.container = new Container();
    this.container.position = startPos;
    this.sprite = Boid.createSprite();
    this.container.addChild(this.sprite);

    this.viewField = new Circle(
      this.container.position.x,
      this.container.position.y,
      this.viewRadius
    );

    // Graphic representation of the viewField
    const viewFieldGraphic = new Graphics()
      .circle(0, 0, this.viewRadius)
      .stroke({ color: "#85C1E9" });
    // Render viewField graphic behind boid sprite
    this.container.addChildAt(viewFieldGraphic, 0);

    // Set initial velocity with a random direction
    this.velocity = Vector.randomVector(this.speed);
  }

  // Creates the boid sprite triangle centred in the container
  private static createSprite(): Graphics {
    const boidWidth = 16;
    const boidHeight = 20;

    // The 3 vertices of the triangle
    const vertices: PointData[] = [
      { x: -boidWidth / 2, y: boidHeight / 2 },
      { x: 0, y: -boidHeight / 2 },
      { x: boidWidth / 2, y: boidHeight / 2 },
    ];

    const sprite = new Graphics().poly(vertices).fill("white");

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

    return sprite;
  }

  // Add the boid to the given container
  spawn(container: Container) {
    container.addChild(this.container);
  }

  get position(): PointData {
    return this.container.position;
  }

  setPosition(position: PointData) {
    this.container.position = position;
    this.viewField.x = this.container.x;
    this.viewField.y = this.container.y;
  }

  // Called every frame
  update(boids: Boid[], deltaTime: number) {
    // Get neighboring boids within this boid's view field
    const neighbors = boids.filter(
      (boid) =>
        boid != this &&
        this.viewField.contains(boid.position.x, boid.position.y)
    );
    if (neighbors.length > 0) {
      console.log("hello boid");
    }

    this.cohere(neighbors);
    this.align(neighbors);
    this.separate(neighbors);
    this.move(deltaTime);
  }

  // Adjust velocity to match average velocity of neighbors including self
  private align(neighbors: Boid[]) {
    const averageVelocity: Vector = Vector.getAverage(
      [...neighbors, this].map((boid) => boid.velocity)
    );
    // Normalize to maintain same speed (TODO: Is this actually what we want?)
    this.velocity = averageVelocity.normalized().scale(this.speed);
  }

  // Adjust velocity to steer toward center of mass
  private cohere(neighbors: Boid[]) {
    if (neighbors.length == 0) return;
    
    const averagePosition = Vector.getAverage(
      neighbors.map((boid) => Vector.fromPoint(boid.position))
    );
    // Velocity required to move toward average position
    this.velocity = averagePosition
      .subtract(Vector.fromPoint(this.position))
      .normalized()
      .scale(this.speed);
  }

  // If neighbor is within minDistance, steer away
  private separate(neighbors: Boid[]) {
    for (const neighbor of neighbors) {
      if (Vector.getDistance(neighbor.position, this.position) <= this.minDistance) {

      }
    }
  }

  // Move the boid to its desired position in the next frame based on its velocity
  private move(deltaTime: number) {
    this.container.x += this.velocity.x * deltaTime;
    this.container.y += this.velocity.y * deltaTime;
    // Rotate the boid toward its direction of movement
    this.container.angle =
      Math.atan2(this.velocity.y, this.velocity.x) * RAD_TO_DEG + 90;
    // Update viewField position to follow container
    this.viewField.x = this.container.x;
    this.viewField.y = this.container.y;
  }
}
