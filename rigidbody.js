import MonoBehavior from "./monobehavior.js"

class RigidBody extends MonoBehavior
{
  constructor(entity)
  {
    super(entity)
    entity.rigidBody = this
  }

  // ??
}

export default RigidBody