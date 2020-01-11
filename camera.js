import Matrix3x3 from "./matrix.js"
import MonoBehavior from "./monobehavior.js"
import Engine from "./engine.js"

class Camera extends MonoBehavior
{
  projMat; _z; _fov

  constructor(entity)
  {
    super(entity)

    this._z = 10
    this.fov = 60
    entity.camera = this
  }

  get z()
  {
    return this._z
  }

  set z(value)
  {
    this._z = value
    this._UpdateProjMat()
  }

  get fov()
  {
    return _fov
  }

  set fov(value)
  {
    this._fov = value
    this._UpdateProjMat()
  }

  _UpdateProjMat()
  {
    this.projMat = Matrix3x3.Project
      (Engine.targetCanvas.width,
        Engine.targetCanvas.height,
        this._z, this._fov)
  }
}

export default Camera