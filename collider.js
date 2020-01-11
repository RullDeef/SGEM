import MonoBehavior from "./monobehavior.js"

class Collider extends MonoBehavior
{
  static Type = { circle: 0, rect: 1 }
  type

  constructor(entity)
  {
    super(entity)
    this.type = Collider.Type.circle
    entity.collider = this
  }

  CheckCollision()
  {
    // ?
  }
}

export default Collider