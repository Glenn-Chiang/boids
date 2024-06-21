import { DEG_TO_RAD, PointData } from "pixi.js";

export class Vector {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }

  subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }

  scale(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor)
  }

  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalized() {
    return this.scale(1 / this.magnitude)
  }

  opposite(): Vector {
    return this.scale(-1)
  }

  static getAverage(vectors: Vector[]): Vector {
    const sum: Vector = vectors.reduce((sum, vector) => sum.add(vector), new Vector(0, 0))
    return sum.scale(1 / vectors.length)
  }

  // Return a vector with random direction and given magnitude
  static randomVector(magnitude: number): Vector {
    const x = Math.random() * (Math.random() < 0.5 ? 1 : -1)
    const y = Math.random() * (Math.random() < 0.5 ? 1 : - 1)
    return new Vector(x, y).normalized().scale(magnitude)
  }

  // Convert point to vector
  static fromPoint(point: PointData): Vector {
    return new Vector(point.x, point.y)
  }

  rotate(degrees: number): Vector {
    const angle = degrees * DEG_TO_RAD
    const x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
    const y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
    return new Vector(x, y);
  }

  static getDirection(to: PointData, from: PointData): Vector {
    return Vector.fromPoint(to).subtract(Vector.fromPoint(from))
  }

  static getDistance(pointA: PointData, pointB: PointData): number {
    return Vector.getDirection(pointA, pointB).magnitude
  }

  static ZERO = new Vector(0, 0)
}
