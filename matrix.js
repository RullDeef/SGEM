import Vector from "./vector.js"

class Matrix3x3
{
  data; _inverse_data; _inv_bit

  constructor(data)
  {
    this.data = new Float32Array(data)
    this._inverse_data = new Float32Array(data)
    this._inv_bit = false
  }

  Clone()
  {
    return new Matrix3x3(this.data)
  }

  Copy(mat3)
  {
    this.data = new Float32Array(mat3.data)
    this._inverse_data = new Float32Array
      (mat3._inverse_data)
    this._inv_bit = mat3._inv_bit
  }

  get det()
  {
    let res = 0
    for (let k = 0; k < 3; k++)
    {
      let pt = 1, nt = 1
      for (let i = 0; i < 3; i++)
      {
        pt *= this.data[3 * i + ((i + k) % 3 + 3) % 3]
        nt *= this.data[3 * i + ((-i - k) % 3 + 3) % 3]
      }
      res += pt - nt
    }
    return res
  }

  get T()
  {
    const res = Matrix3x3.zero
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        res.data[3 * i + j] = this.data[3 * j + i]
    return res
  }

  _A(i, j)
  {
    const det = []
    for (let x = 0; x < 3; x++)
    {
      if (x == i) continue
      for (let y = 0; y < 3; y++)
      {
        if (y == j) continue
        det.push(this.data[3 * x + y])
      }
    }
    const m = det[0] * det[3] - det[1] * det[2]
    return m * (1 - 2 * ((i + j) % 2))
  }

  get inverse()
  {
    if (!this._inv_bit)
      this._RecomputeInverse()
    return new Matrix3x3(this._inverse_data)
  }

  _RecomputeInverse()
  {
    const det = this.det
    if (det != 0)
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
          this._inverse_data[3 * i + j] = this._A(j, i) / det
    this._inv_bit = true
  }

  MultMat(mat3)
  {
    const res = Matrix3x3.zero
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++)
          res.data[3 * i + j] += mat3.data[3 * k + j]
            * this.data[3 * i + k]
    return res
  }

  MultPoint(vec2)
  {
    const m = this.data
    const x = m[0] * vec2.x + m[1] * vec2.y + m[2]
    const y = m[3] * vec2.x + m[4] * vec2.y + m[5]
    return new Vector(x, y)
  }

  MultDir(vec2)
  {
    const m = this.data
    const x = m[0] * vec2.x + m[1] * vec2.y
    const y = m[3] * vec2.x + m[4] * vec2.y
    return new Vector(x, y)
  }

  static get zero()
  {
    return new Matrix3x3
      ([0, 0, 0, 0, 0, 0, 0, 0, 0])
  }

  static get identity()
  {
    return new Matrix3x3
      ([1, 0, 0, 0, 1, 0, 0, 0, 1])
  }

  static Translate(vec2)
  {
    return new Matrix3x3
      ([1, 0, vec2.x, 0, 1, vec2.y, 0, 0, 1])
  }

  static Rotate(angle) {
    const s = Math.sin(angle)
    const c = Math.cos(angle)
    return new Matrix3x3
      ([c, -s, 0, s, c, 0, 0, 0, 1])
  }

  static Scale(vec2)
  {
    return new Matrix3x3
      ([vec2.x, 0, 0, 0, vec2.y, 0, 0, 0, 1])
  }

  static TRS(tr, rot, scl)
  {
    return Matrix3x3.Translate(tr).
      MultMat(Matrix3x3.Rotate(rot)).
      MultMat(Matrix3x3.Scale(scl))
  }

  static Project(width, height, camZ, fov)
  {
    const tr = new Vector(width / 2, height / 2)

    fov *= Math.degToRad
    const wide = 2 * Math.tan(fov / 2) * camZ
    const sc = new Vector(width / wide, -width / wide)

    return Matrix3x3.Translate(tr).
      MultMat(Matrix3x3.Scale(sc))
  }
}

export default Matrix3x3