import Math from "./maths.js"

class Random
{
  static InRange(a, b)
  {
    return a + Math.random() * (b - a)
  }

  static InRangeInt(a, b)
  {
    return a + Math.floor
      (Math.random() * (b - a + 1))
  }

  static get onUnitCircle()
  {
    const angle = Math.TAU * Math.random()
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    return new Vector(x, y)
  }

  static get insideUnitCircle()
  {
    const amp = Math.random()
    return amp * Random.onUnitCircle
  }
}

export default Random