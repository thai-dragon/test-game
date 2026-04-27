export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  scale(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get normalized(): Vector2 {
    const mag = this.magnitude;
    if (mag < 0.0001) return new Vector2(0, 0);
    return new Vector2(this.x / mag, this.y / mag);
  }

  distanceTo(other: Vector2): number {
    return this.subtract(other).magnitude;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  copyFrom(other: Vector2): void {
    this.x = other.x;
    this.y = other.y;
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static from(x: number, y: number): Vector2 {
    return new Vector2(x, y);
  }
}
