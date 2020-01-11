import Math from "./maths.js"

class Rotation
{
  _angle

  constructor(primaryAngle)
  {
    this.angle = primaryAngle
  }

  Clone()
  {
    return new Rotation(this._angle)
  }

  Copy(rot)
  {
    this._angle = rot._angle
  }

  get angle()
  {
    return this._angle
  }

  set angle(value)
  {
    this._angle = value - Math.TAU *
      Math.floor(value / Math.TAU)
  }
}

export default Rotation