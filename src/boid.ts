import { Circle, Container, Graphics, PointData, RAD_TO_DEG } from "pixi.js";
import { Flock } from "./flock";
import { Vector } from "./vector";

export class Boid {
  private readonly flock: Flock;

  private readonly container: Container;
  private readonly sprite: Graphics;

  private velocity: Vector;

  // Area in which the boid is aware of other boids
  private readonly viewField: Circle;

  get speed(): number {
    return this.flock.speed.value;
  }

  // Minimum distance between one boid and another.
  // If a neighboring boid is within this distance, this boid will move away from that neighbor
  private minDistance = 20;

  get separationFactor(): number {
    return this.flock.separationFactor.value;
  }

  get alignmentFactor(): number {
    return this.flock.alignmentFactor.value;
  }

  get cohesionFactor(): number {
    return this.flock.cohesionFactor.value;
  }

  constructor(startPos: PointData, flock: Flock) {
    this.flock = flock;
    this.container = new Container();
    this.container.position = startPos;
    this.sprite = Boid.createSprite();
    this.container.addChild(this.sprite);
    
    this.viewField = new Circle(
      this.container.position.x,
      this.container.position.y,
      this.flock.viewRadius.value
    );
    
    // Set initial velocity with a random direction
    this.velocity = Vector.randomVector(this.speed);
  }
  
  spawn(): void {
    this.flock.container.addChild(this.container);
  }

  // Creates the boid sprite triangle centred in the container
  private static createSprite(): Graphics {
    const boidWidth = 12;
    const boidHeight = 16;

    // The 3 vertices of the triangle
    const vertices: PointData[] = [
      { x: -boidWidth / 2, y: boidHeight / 2 },
      { x: 0, y: -boidHeight / 2 },
      { x: boidWidth / 2, y: boidHeight / 2 },
    ];

    const sprite = new Graphics().poly(vertices).fill("white");

    return sprite;
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

    this.separate(neighbors);
    this.align(neighbors);
    this.cohere(neighbors);
    this.velocity = this.velocity.normalized().scale(this.speed);
    this.move(deltaTime);

    // Update viewField circle to match the corresponding param
    this.viewField.radius = this.flock.viewRadius.value
  }

  // Update velocity to match average velocity of neighbors
  private align(neighbors: Boid[]): void {
    if (neighbors.length == 0) return;

    const averageVelocity: Vector = Vector.getAverage(
      [...neighbors, this].map((boid) => boid.velocity)
    );

    this.velocity = this.velocity.add(
      averageVelocity.subtract(this.velocity).scale(this.alignmentFactor)
    );
  }

  // Update velocity to steer toward center of mass of neighbors
  private cohere(neighbors: Boid[]): void {
    if (neighbors.length == 0) return;

    const averagePosition = Vector.getAverage(
      neighbors.map((boid) => Vector.fromPoint(boid.position))
    );

    if (
      Vector.getDistance(this.position, averagePosition) <= this.minDistance
    ) {
      return;
    }

    const desiredVelocity = averagePosition.subtract(
      Vector.fromPoint(this.position)
    );
    // Desired velocity is the direction from current position to average position
    this.velocity = this.velocity.add(
      desiredVelocity.subtract(this.velocity).scale(this.cohesionFactor)
    );
  }

  // Update velocity to steer away from neighbors that are within minDistance threshold
  private separate(neighbors: Boid[]): void {
    // Get all neighbors that are within minDistance
    const nearNeighbors = neighbors.filter(
      (neighbor) =>
        Vector.getDistance(neighbor.position, this.position) <= this.minDistance
    );

    // If no neighbors within minDistance, don't need to separate
    if (nearNeighbors.length == 0) return;

    // Desired velocity is the average direction vector from nearby neighbors to this boid
    const desiredVelocity = Vector.getAverage(
      nearNeighbors.map((neighbor) => {
        // Direction from neighbor to this boid
        const direction = Vector.getDirection(this.position, neighbor.position);
        const distance = direction.magnitude;
        // Direction vector is given a weight inversely proportional to its distance from this boid
        return direction.scale(1 / distance);
      })
    );

    this.velocity = this.velocity.add(
      desiredVelocity.subtract(this.velocity).scale(this.separationFactor)
    );
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
