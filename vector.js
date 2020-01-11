class Vector
{
  x; y

  constructor(x, y)
  {
    this.x = x; this.y = y
  }

  Clone()
  {
    return new Vector(this.x, this.y)
  }

  Copy(v)
  {
    this.x = v.x; this.y = v.y
  }

  get magnitude()
  {
    return Math.hypot(this.x, this.y)
  }

  get normalized()
  {
    const mag = Math.hypot(this.x, this.y)
    return new Vector(this.x / mag, this.y / mag)
  }

  Add(v)
  {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  Subtract(v)
  {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  Dot(v)
  {
    return this.x * v.x + this.y * v.y
  }

  static get zero()
  {
    return new Vector(0, 0)
  }

  static get one()
  {
    return new Vector(1, 1)
  }
}

export default Vector