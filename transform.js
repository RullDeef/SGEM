import Vector from "./vector.js"
import Rotation from "./rotation.js"
import Matrix3x3 from "./matrix.js"
import MonoBehavior from "./monobehavior.js"

class Transform extends MonoBehavior
{
  localMatrix; worldMatrix
  _l_pos; _l_scale; _l_rot
  _w_pos; _w_scale; _w_rot
  
  constructor(entity)
  {
    super(entity)
    this._l_pos = Vector.zero
    this._l_scale = Vector.one
    this._l_rot = new Rotation(0)
    this._w_pos  = Vector.zero
    this._w_scale = Vector.one
    this._w_rot = new Rotation(0)
    this.localMatrix = Matrix3x3.identity
    if(entity.parent != null)
    {
      this.worldMatrix = entity.parent.
        transform.worldMatrix
    }
    else
      this.worldMatrix = Matrix3x3.identity
    this.entity.transform = this
  }
  
  get position()
  {
    return this._w_pos.Clone()
  }
  
  set position(value)
  {
    this._w_pos.Copy(value)
    this._ConstructFromWorld()
  }
  
  get localPosition()
  {
    return this._l_pos.Clone()
  }
  
  set localPosition(value)
  {
    this._l_pos.Copy(value)
    this._ConstructLocal()
  }
  
  get scale()
  {
    return this._w_scale.Clone()
  }
  
  set scale(value)
  {
    this._w_scale.Copy(value)
    this._ConstructFromWorld()
  }
  
  get localScale()
  {
    return this._l_scale.Clone()
  }
  
  set localScale(value)
  {
    this._l_scale.Copy(value)
    this._ConstructLocal()
  }
  
  get rotation()
  {
    return this._w_rot.Clone()
  }
  
  set rotation(value)
  {
    this._w_rot.Copy(value)
    this._ConstructFromWorld()
  }
  
  get localRotation()
  {
    return this._l_rot.Clone()
  }
  
  set localRotation(value)
  {
    this._l_rot.Copy(value)
    this._ConstructLocal()
  }
  
  _ConstructLocal()
  {
    const newLoc = Matrix3x3.TRS(this._l_pos,
      this._l_rot.angle, this._l_scale)
    this.worldMatrix.Copy(this.worldMatrix.
      MultMat(this.localMatrix.inverse).
        MultMat(newLoc))
    this.localMatrix.Copy(newLoc)
    this._Update_w()
    this._UpdateChildren()
  }
  
  _ConstructFromWorld()
  {
    const newWor = Matrix3x3.TRS(this._w_pos,
      this._w_rot.angle, this._w_scale)
    this.localMatrix.Copy(this.localMatrix.
      MultMat(this.worldMatrix.inverse).
        MultMat(newWor))
    this.worldMatrix.Copy(newWor)
    this._Update_l()
    this._UpdateChildren()
  }
  
  _Update_l()
  {
    const m = this.localMatrix.data
    this._l_pos.x = m[2]
    this._l_pos.y = m[5]
    const a = Math.atan2(m[3], m[0])
    this._l_rot.angle = a
    const cosa = Math.cos(a), sina = Math.sin(a)
    if(cosa == 0)
    {
      this._l_scale.x = m[3] / sina
      this._l_scale.y =-m[1] / sina
    }
    else
    {
      this._l_scale.x = m[0] / cosa
      this._l_scale.y = m[4] / cosa
    }
  }
  
  _Update_w()
  {
    const m = this.worldMatrix.data
    this._w_pos.x = m[2]
    this._w_pos.y = m[5]
    const a = Math.atan2(m[3], m[0])
    this._w_rot.angle = a
    const cosa = Math.cos(a), sina = Math.sin(a)
    if(cosa == 0)
    {
      this._w_scale.x = m[3] / sina
      this._w_scale.y =-m[1] / sina
    }
    else
    {
      this._w_scale.x = m[0] / cosa
      this._w_scale.y = m[4] / cosa
    }
  }
  
  _UpdateChildren()
  {
    this.entity.children.forEach(e => {
      const t = e.transform
      t.worldMatrix.Copy(this.worldMatrix.
        MultMat(t.localMatrix))
      t._Update_w()
      t._UpdateChildren()
    })
  }
}

export default Transform