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

  // Return a vector with random direction and given magnitude
  static randomVector(magnitude: number): Vector {
    const x = Math.random() * (Math.random() < 0.5 ? 1 : -1)
    const y = Math.random() * (Math.random() < 0.5 ? 1 : - 1)
    return new Vector(x, y).normalized().scale(magnitude)
  }
}
