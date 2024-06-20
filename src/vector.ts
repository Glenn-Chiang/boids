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

  scale(factor: number) {
    return new Vector(this.x * factor, this.y * factor)
  }
}
