class Color
{
  r; g; b; a

  constructor(r, g, b, a)
  {
    this.r = r; this.g = g
    this.b = b; this.a = a
  }

  get rgba()
  {
    return `rgba(${this.r},
      ${this.g},${this.b},${this.a})`
  }

  static get white()
  {
    return new Color(255, 255, 255, 1)
  }

  static get black()
  {
    return new Color(0, 0, 0, 1)
  }

  static Lerp(colA, colB, t)
  {
    const result = Color.black
    result.r = colA.r + (colB.r - colA.r) * t
    result.g = colA.g + (colB.g - colA.g) * t
    result.b = colA.b + (colB.b - colA.b) * t
    result.a = colA.a + (colB.a - colA.a) * t
    return result
  }
}

export default Color