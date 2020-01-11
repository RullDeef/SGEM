import Vector from "./vector.js"

class Mesh {
  path

  constructor(points = [])
  {
    this.path = new Float32Array(points)
  }

  get points()
  {
    const res = [], p = this.path
    for (let i = 0; i < p.length; i += 2)
      res.push(new Vector(p[i], p[i + 1]))
    return res
  }

  set points(value)
  {
    const res = []
    for (let i = 0; i < value.length; i++)
    {
      res.push(value[i].x)
      res.push(value[i].y)
    }
    this.path = new Float32Array(res)
  }
}

export default Mesh