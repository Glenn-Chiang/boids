import {
  Circle,
  Container,
  Graphics,
  PointData,
  RAD_TO_DEG,
  Triangle
} from "pixi.js";

interface Vector {
  x: number;
  y: number;
}

export class Boid {
  private readonly container: Container;
  private readonly sprite: Graphics;

  private readonly speed = 2
  private direction: Vector = { x: -1, y: 1 };
  private get velocity(): Vector {
    return {x: this.direction.x * this.speed, y: this.direction.y * this.speed}
  }

  private readonly viewRadius = 40;
  // Area in which the boid is aware of other boids
  private readonly viewField: Circle; 

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
      .fill("#85C1E9");
    // Render viewField graphic behind boid sprite
    this.container.addChildAt(viewFieldGraphic, 0);
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

  // Called every frame
  // Move the boid to its desired position in the next frame based on its velocity
  // Rotate the boid toward its direction of movement
  move(deltaTime: number) {
    this.container.x += this.velocity.x * deltaTime;
    this.container.y += this.velocity.y * deltaTime;
    this.container.angle = Math.atan2(this.velocity.y, this.velocity.x) * RAD_TO_DEG + 90;
    // Update viewField position to follow container
    this.viewField.x = this.container.x
    this.viewField.y = this.container.y
  }

  get position(): PointData {
    return this.container.position;
  }

  setPosition(position: PointData) {
    this.container.position = position;
    this.viewField.x = this.container.x
    this.viewField.y = this.container.y
  }
}
