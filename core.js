// math extension
Math.TAU = 2 * Math.PI
Math.degToRad = Math.PI / 180
Math.radToDeg = 180 / Math.PI

Math.Lerp = function (a, b, t) {
  return a + (b - a) * t
}

Math.Clamp = function (value, a, b) {
  return Math.max(a, Math.min(value, b))
}

// array extension
Object.defineProperty(Array.prototype, "x", {
  get() { return this[0] },
  set(value) { this[0] = value }
})
Object.defineProperty(Array.prototype, "y", {
  get() { return this[1] },
  set(value) { this[1] = value }
})

const EmptyFunc = function () { }



class Random {
  static InRange(a, b) {
    return a + Math.random() * (b - a)
  }

  static InRangeInt(a, b) {
    return a + Math.floor
      (Math.random() * (b - a + 1))
  }

  static get onUnitCircle() {
    const angle = Math.TAU * Math.random()
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    return new Vector(x, y)
  }

  static get insideUnitCircle() {
    const amp = Math.random()
    return amp * Random.onUnitCircle
  }

  static get color() {
    const a = Random.InRangeInt(1, 3)
    const v = Random.onUnitCircle
    let r = 0, g = 0, b = 0
    if (a == 1) {
      r = Math.round(255 * Math.abs(v.x))
      g = Math.round(255 * Math.abs(v.y))
    } else if (a == 2) {
      g = Math.round(255 * Math.abs(v.x))
      b = Math.round(255 * Math.abs(v.y))
    } else {
      b = Math.round(255 * Math.abs(v.x))
      r = Math.round(255 * Math.abs(v.y))
    }
    return new Color(r, g, b, 1)
  }
}



class Vector {
  x; y

  constructor(x, y) {
    this.x = x; this.y = y
  }

  Clone() {
    return new Vector(this.x, this.y)
  }

  Copy(v) {
    this.x = v.x; this.y = v.y
  }

  get magnitude() {
    return Math.hypot(this.x, this.y)
  }

  get normalized() {
    const mag = Math.hypot(this.x, this.y)
    if (mag == 0) return Vector.zero
    return new Vector(this.x / mag, this.y / mag)
  }

  Add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  Subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  Mult(n) {
    return new Vector(n * this.x, n * this.y)
  }

  MultVect(v) {
    return new Vector(this.x * v.x, this.y * v.y)
  }

  Dot(v) {
    return this.x * v.x + this.y * v.y
  }

  Rotate(angle) {
    angle *= Math.degToRad
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    const x = this.x * cos - this.y * sin
    const y = this.x * sin + this.y * cos
    return new Vector(x, y)
  }

  // projects current vector on v
  // result is vector again
  Project(v) {
    const mag = v.magnitude
    if (mag == 0) return this.Clone()
    v = v.normalized
    return v.Mult(this.Dot(v))
  }

  static get zero() {
    return new Vector(0, 0)
  }

  static get one() {
    return new Vector(1, 1)
  }

  static get x() {
    return new Vector(1, 0)
  }

  static get y() {
    return new Vector(0, 1)
  }

  // clamped version
  static Lerp(v1, v2, t) {
    t = Math.Clamp(t, 0, 1)
    const x = v1.x + (v2.x - v1.x) * t
    const y = v1.y + (v2.y - v1.y) * t
    return new Vector(x, y)
  }

  // unclamped version
  static LerpUnclamped(v1, v2, t) {
    const x = v1.x + (v2.x - v1.x) * t
    const y = v1.y + (v2.y - v1.y) * t
    return new Vector(x, y)
  }

  // circular interpolation
  // clamped version
  static Clerp(v1, v2, t) {
    t = Math.Clamp(t, 0, 1)
    const r1 = v1.magnitude, r2 = v2.magnitude
    const a1 = Math.atan2(v1.y, v1.x)
    const a2 = Math.atan2(v2.y, v2.x)
    const r = r1 + (r2 - r1) * t
    const a = a1 + (a2 - a1) * t
    const x = r * Math.cos(a)
    const y = r * Math.sin(a)
    return new Vector(x, y)
  }

  // circular interpolation
  // unclamped version
  static ClerpUnclamped(v1, v2, t) {
    const r1 = v1.magnitude, r2 = v2.magnitude
    const a1 = Math.atan2(v1.y, v1.x)
    const a2 = Math.atan2(v2.y, v2.x)
    const r = r1 + (r2 - r1) * t
    const a = a1 + (a2 - a1) * t
    const x = r * Math.cos(a)
    const y = r * Math.sin(a)
    return new Vector(x, y)
  }

  toString() {
    return "Vector(" +
      Math.round(this.x * 1e5) / 1e5 + ", " +
      Math.round(this.y * 1e5) / 1e5 + ")"
  }
}



class Rotation {
  _angle

  constructor(primaryAngle) {
    this.angle = primaryAngle
  }

  Clone() {
    return new Rotation(this._angle)
  }

  Copy(rot) {
    this._angle = rot._angle
  }

  get angle() {
    return this._angle
  }

  set angle(value) {
    this._angle = value - Math.TAU *
      Math.floor(value / Math.TAU)
  }

  toString() {
    return "Rotation(" + Math.round(this.
      _angle * Math.radToDeg * 1e3) / 1e3
      + "deg)"
  }
}



class Matrix3x3 {
  data; _inverse_data; _inv_bit

  constructor(data) {
    this.data = new Float32Array(data)
    this._inverse_data = new Float32Array(data)
    this._inv_bit = false
  }

  Clone() {
    return new Matrix3x3(this.data)
  }

  Copy(mat3) {
    this.data = new Float32Array(mat3.data)
    this._inverse_data = new Float32Array
      (mat3._inverse_data)
    this._inv_bit = mat3._inv_bit
  }

  get det() {
    let res = 0
    for (let k = 0; k < 3; k++) {
      let pt = 1, nt = 1
      for (let i = 0; i < 3; i++) {
        pt *= this.data[3 * i + ((i + k) % 3 + 3) % 3]
        nt *= this.data[3 * i + ((-i - k) % 3 + 3) % 3]
      }
      res += pt - nt
    }
    return res
  }

  get T() {
    const res = Matrix3x3.zero
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        res.data[3 * i + j] = this.data[3 * j + i]
    return res
  }

  _A(i, j) {
    const det = []
    for (let x = 0; x < 3; x++) {
      if (x == i) continue
      for (let y = 0; y < 3; y++) {
        if (y == j) continue
        det.push(this.data[3 * x + y])
      }
    }
    const m = det[0] * det[3] - det[1] * det[2]
    return m * (1 - 2 * ((i + j) % 2))
  }

  get inverse() {
    if (!this._inv_bit)
      this._RecomputeInverse()
    return new Matrix3x3(this._inverse_data)
  }

  _RecomputeInverse() {
    const det = this.det
    if (det != 0)
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
          this._inverse_data[3 * i + j] = this._A(j, i) / det
    this._inv_bit = true
  }

  MultMat(mat3) {
    const res = Matrix3x3.zero
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++)
          res.data[3 * i + j] += mat3.data[3 * k + j]
            * this.data[3 * i + k]
    return res
  }

  MultPoint(vec2) {
    const m = this.data
    const x = m[0] * vec2.x + m[1] * vec2.y + m[2]
    const y = m[3] * vec2.x + m[4] * vec2.y + m[5]
    return new Vector(x, y)
  }

  MultDir(vec2) {
    const m = this.data
    const x = m[0] * vec2.x + m[1] * vec2.y
    const y = m[3] * vec2.x + m[4] * vec2.y
    return new Vector(x, y)
  }

  static get zero() {
    return new Matrix3x3
      ([0, 0, 0, 0, 0, 0, 0, 0, 0])
  }

  static get identity() {
    return new Matrix3x3
      ([1, 0, 0, 0, 1, 0, 0, 0, 1])
  }

  static Translate(vec2) {
    return new Matrix3x3
      ([1, 0, vec2.x, 0, 1, vec2.y, 0, 0, 1])
  }

  static Rotate(angle) {
    const s = Math.sin(angle)
    const c = Math.cos(angle)
    return new Matrix3x3
      ([c, -s, 0, s, c, 0, 0, 0, 1])
  }

  static Scale(vec2) {
    return new Matrix3x3
      ([vec2.x, 0, 0, 0, vec2.y, 0, 0, 0, 1])
  }

  static TRS(tr, rot, scl) {
    return Matrix3x3.Translate(tr).
      MultMat(Matrix3x3.Rotate(rot)).
      MultMat(Matrix3x3.Scale(scl))
  }

  static Project(width, height, camZ, fov) {
    const tr = new Vector(width / 2, height / 2)

    fov *= Math.degToRad
    const wide = 2 * Math.tan(fov / 2) * camZ
    const sc = new Vector(width / wide, -width / wide)

    return Matrix3x3.Translate(tr).
      MultMat(Matrix3x3.Scale(sc))
  }

  toString() {
    return "Matrix3x3(...)"
  }
}



class Mesh {
  path

  constructor(points = []) {
    this.path = new Float32Array(points)
  }

  get points() {
    const res = [], p = this.path
    for (let i = 0; i < p.length; i += 2)
      res.push(new Vector(p[i], p[i + 1]))
    return res
  }

  set points(value) {
    const res = []
    for (let i = 0; i < value.length; i++)
      res.push(value[i].x, value[i].y)
    this.path = new Float32Array(res)
  }

  // advanced version of 'points'
  // copies first point in tail
  get contour() {
    const res = [], p = this.path
    for (let i = 0; i < p.length; i += 2)
      res.push(new Vector(p[i], p[i + 1]))
    res.push(new Vector(p[0], p[1]))
    return res
  }

  set contour(value) {
    const res = []
    for (let i = 0; i < value.length - 2; i++)
      res.push(value[i].x, value[i].y)
    this.path = new Float32Array(res)
  }

  // returns vectors pointing around
  // mesh verticies
  get flow() {
    const res = [], p = this.path
    for (let i = 0; i < p.length; i += 2) {
      const x1 = p[i - 2], y1 = p[i - 1]
      const x2 = p[i], y2 = p[i + 1]
      res.push(new Vector(x2 - x1, y2 - y1))
    }
    const x1 = p[p.length - 2], y1 = p[p.length - 1]
    const x2 = p[0], y2 = p[1]
    res.push(new Vector(x2 - x1, y2 - y1))
    return res
  }

  get circumference() {
    const p = this.path
    const x1 = p[p.length - 2]
    const y1 = p[p.length - 1]
    const x2 = p[0], y2 = p[1]
    let circumference = Math.hypot(x1 - x2, y1 - y2)
    for (let i = 2; i < p.length; i += 2) {
      const x1 = p[i - 2], y1 = p[i - 1]
      const x2 = p[i], y2 = p[i + 1]
      area += Math.hypot(x1 - x2, y1 - y2)
    }
    return circumference
  }

  get area() {
    const p = this.path
    const x1 = p[p.length - 2]
    const y1 = p[p.length - 1]
    const x2 = p[0], y2 = p[1]
    let area = x1 * y2 - x2 * y1
    for (let i = 2; i < p.length; i += 2) {
      const x1 = p[i - 2], y1 = p[i - 1]
      const x2 = p[i], y2 = p[i + 1]
      area += x1 * y2 - x2 * y1
    }
    return 0.5 * Math.abs(area)
  }

  Densed(dist) {
    const p = this.contour
    for (let i = p.length - 1; i > 0; i--) {
      const p1 = p[i - 1], p2 = p[i]
      const d = p1.Subtract(p2).magnitude
      if (d > dist) {
        const n = Math.ceil(d / dist)
        for (let j = n - 1; j > 0; j--) {
          const p3 = Vector.Lerp(p1, p2, j / n)
          p.splice(i, 0, p3)
        }
      }
    }
    this.contour = p
    return this
  }

  IsInside(point) {
    return this.IsInsideXY(point.x, point.y)
  }

  IsInsideXY(x, y) {
    const p = this.path, len = p.length
    let x1, y1, x2, y2, count = 0
    x1 = p[len - 2]; y1 = p[len - 1]; x2 = p[0]; y2 = p[1]
    if ((y - y1) * (y - y2) < 0 && (x < x1 || x < x2) &&
      (x1 > x && x2 > x || (x2 - x1) * (y - y1) / (y2 - y1) >= x - x1))
      count++
    for (let i = 2; i < len; i += 2) {
      x1 = p[i - 2]; y1 = p[i - 1]; x2 = p[i]; y2 = p[i + 1]
      if ((y - y1) * (y - y2) < 0 && (x < x1 || x < x2) &&
        (x1 > x && x2 > x || (x2 - x1) * (y - y1) / (y2 - y1) >= x - x1))
        count++
    }
    return count & 1
  }

  static Circle(center, radius, pointAmount) {
    const points = []
    for (let i = 0; i < pointAmount; i++) {
      const a = i / pointAmount * Math.TAU
      const x = center.x + radius * Math.cos(a)
      const y = center.y + radius * Math.sin(a)
      points.push(x, y)
    }
    return new Mesh(points)
  }

  toString() {
    return "Mesh(" + this.path.length + ")"
  }
}



// Base resource class for any type of external data
class Resource {
  static all = []
  static images = []

  static _AddListener(res) {
    res.isLoaded = false
    res.addEventListener("load", () => {
      res.isLoaded = true
    })
  }

  // initializes image resource
  static Image(name, src = null) {
    const img = new Image()
    img._src = src || name
    img.name = name.split("/").pop()
    // add event listener
    Resource._AddListener(img)
    Resource.images.push(img)
    Resource.all.push(img)
    return img
  }

  // initializes array of images
  static Images(...args) {
    args.forEach(data => {
      if (data instanceof Array)
        Resource.Image(...data)
      else Resource.Image(data)
    })
  }

  // returns resource by its name
  static Get(name) {
    for (let i = 0; i < Resource.all.length; i++)
      if (Resource.all[i].name == name)
        return Resource.all[i]
    return null
  }

  // runs loading process
  static BeginLoading() {
    Resource.all.forEach(res => {
      res.src = res._src
    })
  }

  static get isAllLoaded() {
    for (let i = 0; i < Resource.all.length; i++)
      if (!Resource.all[i].isLoaded)
        return false
    return true
  }

  static get loadingProgress() {
    let progress = 0
    for (let i = 0; i < Resource.all.length; i++)
      if (Resource.all[i].isLoaded)
        progress++
    return progress / Resource.all.length
  }
}



class Time {
  static time = 0
  static timeScale = 1
  static deltaTime = 0
}



class Input {
  static isTouching = false
  static isDragging = false
  static _touchStartPos = Vector.zero
  static _touchPos = Vector.zero
  static _deltaPos = Vector.zero

  static get touchStartPos() {
    return Input._touchStartPos.Clone()
  }

  static get touchPos() {
    return Input._touchPos.Clone()
  }

  static get deltaPos() {
    return Input._deltaPos.Clone()
  }

  static Init(canvas) {
    canvas.addEventListener
      ("touchstart", Input.TouchStart)
    canvas.addEventListener
      ("touchmove", Input.TouchMove)
    canvas.addEventListener
      ("touchend", Input.TouchEnd)
  }

  static TouchStart(event) {
    Input.isTouching = true
    Input._touchPos.x =
      Input._touchStartPos.x = Engine.dpi *
      event.touches[0].pageX
    Input._touchPos.y =
      Input._touchStartPos.y = Engine.dpi *
      event.touches[0].pageY
  }

  static TouchMove(event) {
    Input.isDragging = true
    const x = Engine.dpi * event.touches[0].pageX
    const y = Engine.dpi * event.touches[0].pageY
    Input._deltaPos.x = x - Input._touchPos.x
    Input._deltaPos.y = y - Input._touchPos.y
    Input._touchPos.x = x
    Input._touchPos.y = y
  }

  static TouchEnd(event) {
    Input.isTouching = false
    Input.isDragging = false
  }
}



class MonoBehavior {
  static all = []
  id; entity

  constructor(entity) {
    this.id = MonoBehavior.all.length
    this.entity = entity
  }

  GetComponent(componentClass) {
    const mb = this.entity.behaviors
    for (let i = 0; i < mb.length; i++)
      if (mb[i] instanceof componentClass)
        return mb[i]
    return null
  }

  Start() { }
  Update() { }
  Render(ctx) { }
}



class Transform extends MonoBehavior {
  localMatrix; worldMatrix
  _l_pos; _l_scale; _l_rot
  _w_pos; _w_scale; _w_rot

  constructor(entity) {
    super(entity)
    this._l_pos = Vector.zero
    this._l_scale = Vector.one
    this._l_rot = new Rotation(0)
    this._w_pos = Vector.zero
    this._w_scale = Vector.one
    this._w_rot = new Rotation(0)
    this.localMatrix = Matrix3x3.identity
    if (entity.parent != null) {
      this.worldMatrix = entity.parent.
        transform.worldMatrix
      this._Update_w()
    }
    else
      this.worldMatrix = Matrix3x3.identity
    this.entity.transform = this
  }

  get position() {
    return this._w_pos.Clone()
  }

  set position(value) {
    this._w_pos.Copy(value)
    this._ConstructFromWorld()
  }

  get localPosition() {
    return this._l_pos.Clone()
  }

  set localPosition(value) {
    this._l_pos.Copy(value)
    this._ConstructLocal()
  }

  get scale() {
    return this._w_scale.Clone()
  }

  set scale(value) {
    this._w_scale.Copy(value)
    this._ConstructFromWorld()
  }

  get localScale() {
    return this._l_scale.Clone()
  }

  set localScale(value) {
    this._l_scale.Copy(value)
    this._ConstructLocal()
  }

  get rotation() {
    return this._w_rot.Clone()
  }

  set rotation(value) {
    this._w_rot.Copy(value)
    this._ConstructFromWorld()
  }

  get localRotation() {
    return this._l_rot.Clone()
  }

  set localRotation(value) {
    this._l_rot.Copy(value)
    this._ConstructLocal()
  }

  _ConstructLocal() {
    const newLoc = Matrix3x3.TRS(this._l_pos,
      this._l_rot.angle, this._l_scale)
    this.worldMatrix.Copy(this.worldMatrix.
      MultMat(this.localMatrix.inverse).
      MultMat(newLoc))
    this.localMatrix.Copy(newLoc)
    this._Update_w()
    this._UpdateChildren()
  }

  _ConstructFromWorld() {
    const newWor = Matrix3x3.TRS(this._w_pos,
      this._w_rot.angle, this._w_scale)
    this.localMatrix.Copy(this.localMatrix.
      MultMat(this.worldMatrix.inverse).
      MultMat(newWor))
    this.worldMatrix.Copy(newWor)
    this._Update_l()
    this._UpdateChildren()
  }

  _Update_l() {
    const m = this.localMatrix.data
    this._l_pos.x = m[2]
    this._l_pos.y = m[5]
    const a = Math.atan2(m[3], m[0])
    this._l_rot.angle = a
    const cosa = Math.cos(a), sina = Math.sin(a)
    if (cosa == 0) {
      this._l_scale.x = m[3] / sina
      this._l_scale.y = -m[1] / sina
    }
    else {
      this._l_scale.x = m[0] / cosa
      this._l_scale.y = m[4] / cosa
    }
  }

  _Update_w() {
    const m = this.worldMatrix.data
    this._w_pos.x = m[2]
    this._w_pos.y = m[5]
    const a = Math.atan2(m[3], m[0])
    this._w_rot.angle = a
    const cosa = Math.cos(a), sina = Math.sin(a)
    if (cosa == 0) {
      this._w_scale.x = m[3] / sina
      this._w_scale.y = -m[1] / sina
    }
    else {
      this._w_scale.x = m[0] / cosa
      this._w_scale.y = m[4] / cosa
    }
  }

  _UpdateChildren() {
    this.entity.children.forEach(e => {
      const t = e.transform
      t.worldMatrix.Copy(this.worldMatrix.
        MultMat(t.localMatrix))
      t._Update_w()
      t._UpdateChildren()
    })
  }

  // translates current transform using
  // translation vector vec2 and
  // relative transform (default = world)
  Translate(vec2, relative = null) {
    if (relative != null) {
      vec2 = relative.worldMatrix.
        inverse.MultDir(vec2)
    }
    this._w_pos = this._w_pos.Add(vec2)
    this._ConstructFromWorld()
  }

  // rotates current transform
  // by given angle in degrees!
  Rotate(angle) {
    this._l_rot.angle += angle * Math.degToRad
    this._ConstructLocal()
  }

  // the same but in radians
  RotateRad(angle) {
    this._l_rot.angle += angle
    this._ConstructLocal()
  }

  Scale(vec2) {
    this._l_scale = this._l_scale.MultVect(vec2)
    this._ConstructLocal()
  }
}



class Camera extends MonoBehavior {
  projMat; _z; _fov

  constructor(entity) {
    super(entity)

    this.projMat = Matrix3x3.identity
    this._z = 10
    this.fov = 60
    entity.camera = this
  }

  get z() {
    return this._z
  }

  set z(value) {
    this._z = value
    this._UpdateProjMat()
  }

  get fov() {
    return _fov
  }

  set fov(value) {
    this._fov = value
    this._UpdateProjMat()
  }

  _UpdateProjMat() {
    this.projMat.Copy(Matrix3x3.Project
      (Engine.targetCanvas.width,
        Engine.targetCanvas.height,
        this._z, this._fov))
  }
}



class Entity {
  name; behaviors; parent; active
  children

  constructor(name, parent = null) {
    this.name = name
    this.parent = parent
    this.active = true
    this.behaviors = [new Transform(this)]
    this.children = []
  }

  AddComponent(componentClass) {
    const mb = new componentClass(this)
    this.behaviors.push(mb)
    return mb
  }

  GetComponent(componentClass) {
    const mb = this.behaviors
    for (let i = 0; i < mb.length; i++)
      if (mb[i] instanceof componentClass)
        return mb[i]
    return null
  }

  AddChild(entity) {
    entity.parent = this
    this.children.push(entity)
  }

  // TODO: complete
  Clone(parentTransform) {
    const res = new Enitity(this.name + " (Clone)")

    // copy all behavoirs from current object to result
    this.behaviors.forEach(mb => {
      res.AddComponent(mb.constructor)
    })

    return res
  }

  toString() {
    return "Entity(\"" + this.name + "\")"
  }
}



class Scene {
  static scenes = []
  name; entities; camera

  constructor(name) {
    this.name = name
    this.entities = []

    // create main camera
    this.camera = new Entity("Main Camera")
    this.camera.AddComponent(Camera)
    this.entities.push(this.camera)

    Scene.scenes.push(this)
  }

  AddEntity(ent, parent = null) {
    if (parent != null)
      ent.parent = parent
    this.entities.push(ent)
    ent.children.forEach(e => this.AddEntity(e))
  }

  GetEntity(name) {
    for (let i = 0; i < this.entities.length; i++)
      if (this.entities[i].name == name)
        return this.entities[i]
    return null
  }

  static GetScene(name) {
    for (let i = 0; i < Scene.scenes.length; i++)
      if (Scene.scenes[i].name == name)
        return Scene.scenes[i]
    return null
  }

  toString() {
    return "Scene(\"" + this.name + "\")"
  }
}



class Collider extends MonoBehavior {
  static Type = { circle: 0, mesh: 1 }
  type; transform
  radius // only for circle type
  mesh // only for mesh type

  constructor(entity) {
    super(entity)
    this.type = Collider.Type.circle
    this.radius = 1
    this.transform = entity.transform
    Physics.AddCollider(this)
    entity.collider = this
  }

  // define your stuff instead ..?
  OnCollisionWith(collider, point) { }
  OnOverlapWith(collider, point) { }
  OnCollisionEnd(collider, point) { }
}



class RigidBody extends MonoBehavior {
  transform; collider

  mass = 1
  velocity = Vector.zero // local velocity
  gravity = Vector.zero // constant force applied
  linearDamping = 0 // >= 0

  constructor(entity) {
    super(entity)
    // automatically add collider
    if (entity.GetComponent(Collider) == null)
      entity.AddComponent(Collider)
    this.transform = entity.transform
    this.collider = entity.collider

    this.collider.OnCollisionWith =
      this.OnCollisionWith.bind(this)

    this.collider.rigidBody = this
    entity.rigidBody = this
  }

  get impulse() {
    return this.velocity.Mult(this.mass)
  }

  OnCollisionWith(col, point) {
    if (!col.rigidBody) return true

    // do elastic collision stuff
    const rb = col.rigidBody

    // normal and tangental directions
    const n = this.transform.
      position.Subtract(point).normalized
    const tg = new Vector(-n.y, n.x)

    const mA = this.mass
    const mB = rb.mass
    const nuA = this.velocity.Dot(n)
    const nuB = rb.velocity.Dot(n)
    const tguA = this.velocity.Dot(tg)
    const tguB = rb.velocity.Dot(tg)

    // determine new velocities
    const m = mA + mB
    const nvA = ((mA - mB) * nuA + 2 * mB * nuB) / m
    const nvB = (2 * mA * nuA + (mB - mA) * nuB) / m

    this.velocity = tg.Mult(tguA).Add(n.Mult(nvA))
    rb.velocity = tg.Mult(tguB).Add(n.Mult(nvB))

    return true
  }

  // adds impulse given in world space
  // or relative to given transform
  AddImpulse(vec2, relative = null) {
    if (relative != null)
      vec2 = relative.worldMatrix.
        inverse.MultDir(vec2)
    this.velocity = this.velocity.
      Add(vec2.Mult(1 / this.mass))
  }

  // adds angular momentum to point
  AddMomentum(vec2, point, relative = null) {
    if (relative != null) {
      vec2 = relative.worldMatrix.
        inverse.MultDir(vec2)
      point = relative.worldMatrix.
        inverse.MultPoint(point)
    }
    // todo: complete
  }

  Update() {
    const t = this.transform
    const dt = Time.deltaTime

    // applies constant force and linear damping
    this.velocity = this.velocity.
      Add(this.gravity.Mult(dt)).
      Mult(1 - this.linearDamping * dt)

    // translates object in local space
    t.Translate(this.velocity.Mult(dt), t)
  }
}



// additional physics engine for
// handling collisions and bodies
class Physics {
  // whenever collider is created it goes here
  static _colliders = []
  // matrix that describes collisions
  // btw objects on previous frame
  static _prevCollisions = []

  static AddCollider(collider) {
    Physics._colliders.push(collider)
    let l = Physics._colliders.length
    l = l * l
    Physics._prevCollisions = new Array(l)
  }

  static RemoveCollider(collider) {
    Physics._colliders.remove(collider)
    let l = Physics._colliders.length
    l = l * l
    Physics._prevCollisions = new Array(l)
  }

  // check collision and return
  // point of collision
  static CheckCollision(c1, c2) {
    if (c1.type == Collider.Type.circle &&
      c2.type == Collider.Type.circle) {
      const d = c1.transform.position.Subtract
        (c2.transform.position)
      if (d.magnitude <= c1.radius + c2.radius)
        return c1.transform.position.
          Add(d.Mult(c1.radius / d.magnitude))
    } else
      if (c1.type == Collider.Type.circle &&
        c2.type == Collider.Type.mesh) {
        // check for each point in mesh
        const points = c2.mesh.points
        const mat = c1.transform.worldMatrix.
          MultMat(c2.transform.worldMatrix.inverse)
        for (let i = 0; i < points.length; i++) {
          const p = mat.MultPoint(points[i])
          if (p.magnitude <= c1.radius)
            return p
        }
      } else
        if (c1.type == Collider.Type.mesh &&
          c2.type == Collider.Type.circle) {
          // check for each point in mesh
          const points = c1.mesh.points
          const mat = c2.transform.worldMatrix.
            MultMat(c1.transform.worldMatrix.inverse)
          for (let i = 0; i < points.length; i++) {
            const p = mat.MultPoint(points[i])
            if (p.magnitude <= c2.radius)
              return p
          }
        } else
          if (c1.type == Collider.Type.mesh &&
            c2.type == Collider.Type.mesh) {
            // check for each point in mesh
            const points = c1.mesh.points
            const mat = c2.transform.worldMatrix.
              MultMat(c1.transform.worldMatrix.inverse)
            for (let i = 0; i < points.length; i++) {
              const p = mat.MultPoint(points[i])
              if (c2.mesh.IsInside(p))
                return p
            }
          }
    return null
  }

  static CheckCollisions() {
    const c = Physics._colliders
    const l = Physics._colliders.length

    let c1, c2, cl, pv
    for (let i = 1; i < c.length; i++)
      for (let j = 0; j < i; j++) {
        c1 = c[i]; c2 = c[j]
        cl = Physics.CheckCollision(c1, c2)
        pv = Physics._prevCollisions[i + j * l]

        if (cl) {
          if (!pv) {
            if (!c1.OnCollisionWith(c2, cl))
              c2.OnCollisionWith(c1, cl)
          } else {
            if (!c1.OnOverlapWith(c2, cl))
              c2.OnOverlapWith(c1, cl)
          }
        } else if (pv) {
          if (!c1.OnCollisionEnd(c2, pv))
            c2.OnCollisionEnd(c1, pv)
        }

        Physics._prevCollisions[i + j * l] = cl
      }
  }
}



class LoadingScreen {
  introTime // time before loading (optional)
  extraTime // additional time for loader screen

  constructor() {
    this.introTime = 0
    this.extraTime = 0
  }

  // calls before actual loading 0 <= t < introTime
  Intro(ctx, t) { }

  // updates view based on provided loading percent
  Update(ctx, stage) { }

  // calls after all resources being loaded
  // 0 <= t < extraTime
  Extra(ctx, t) { }
}



// standard loading screen class
class DefaultLoadingScreen extends LoadingScreen {
  constructor() {
    super()
    this.extraTime = 2
  }

  Update(ctx, stage) {
    const w = Engine.targetCanvas.width
    const h = Engine.targetCanvas.height
    const q = Engine.dpi
    const r = Math.min(w, h, 400 * q) / 8

    const t = Date.now() / 1000

    ctx.fillStyle = "rgb(68, 56, 84)"
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = "silver"
    ctx.textAlign = "center"
    ctx.textBaseline = "bottom"
    ctx.font = 12 * q + "px monospace"
    ctx.fillText("Loading resources", w / 2, h / 2 - 2 * r)

    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.TAU
      const x = w / 2 + r * Math.cos(a)
      const y = h / 2 - r * Math.sin(a)

      const k = 1 - (t + i / 16) % 1
      ctx.fillStyle = "rgba(255, 255, 255, " + k + ")"
      ctx.beginPath()
      ctx.arc(x, y, r / 16, 0, Math.TAU)
      ctx.fill()
    }

    ctx.fillStyle = "white"
    ctx.textBaseline = "middle"
    ctx.font = 30 * q + "px monospace"
    const txt = Math.round(stage * 100) + "%"
    ctx.fillText(txt, w / 2, h / 2)

    ctx.fillStyle = "silver"
    ctx.textAlign = "center"
    ctx.textBaseline = "bottom"
    ctx.font = 12 * q + "px monospace"
    ctx.fillText("⚡ powered by SGEM", w / 2, h - 32 * q)
  }

  Extra(ctx, time) {
    const w = Engine.targetCanvas.width
    const h = Engine.targetCanvas.height
    const q = Engine.dpi
    const r = Math.min(w, h, 400 * q) / 8

    const t = Date.now() / 1000
    const u = Math.max(0, 1 - time)
    const u2 = u * u * (3 - 2 * u)

    ctx.fillStyle = "rgb(68, 56, 84)"
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = "rgba(192, 192, 192, " + u + ")"
    ctx.textAlign = "center"
    ctx.textBaseline = "bottom"
    ctx.font = 12 * q + "px monospace"
    ctx.fillText("Loading resources", w / 2, h / 2 - 2 * r * u2)

    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.TAU
      const x = w / 2 + r * Math.cos(a)
      const y = h / 2 - r * Math.sin(a) + 2 * r * (1 - u2)

      const k = 1 - (t + i / 16) % 1
      ctx.fillStyle = "rgba(255, 255, 255, " + k * u + ")"
      ctx.beginPath()
      ctx.arc(x, y, r / 16, 0, Math.TAU)
      ctx.fill()
    }

    ctx.fillStyle = "rgba(255, 255, 255, " + u + ")"
    ctx.textBaseline = "middle"
    ctx.font = 30 * q + "px monospace"
    ctx.fillText("100%", w / 2, h / 2 + 2 * r * (1 - u2))

    ctx.fillStyle = "silver"
    ctx.textAlign = "center"
    ctx.textBaseline = "bottom"
    ctx.font = 12 * q * (2 - u2) + "px monospace"
    ctx.fillText("⚡ powered by SGEM", w / 2,
      Math.Lerp(h / 2 + 32 * q, h - 32 * q, u2))
  }
}



class Engine {
  static targetContext
  static targetCanvas
  static dpi = 5

  static loadingScreen = new DefaultLoadingScreen()

  static currentScene = null

  static _AdvancedContext(ctx) {
    Object.assign(ctx,
      { _projMat: [Matrix3x3.identity] })
    Object.defineProperty(ctx, "projMat", {
      get() {
        return this._projMat[0].Clone()
      }
    })
    let _transform = ctx.transform.bind(ctx)
    let _reset = ctx.resetTransform.bind(ctx)
    let _save = ctx.save.bind(ctx)
    let _restore = ctx.restore.bind(ctx)
    ctx.transform = function (mat3) {
      ctx._projMat[0] = mat3.MultMat(ctx._projMat[0])
      let m = mat3.data
      _transform(m[0], m[1], m[3],
        m[4], m[2], m[5])
    }
    ctx.resetTransform = function () {
      ctx._projMat[0] = Matrix3x3.identity
      _reset()
    }
    ctx.save = function () {
      _save()
      ctx._projMat.unshift(ctx._projMat[0].Clone())
    }
    ctx.restore = function () {
      _restore()
      ctx._projMat.shift()
    }
    return ctx
  }

  static InitCanvas() {
    let cvs = document.createElement("canvas")
    cvs.width = Engine.dpi * window.innerWidth
    cvs.height = Engine.dpi * window.innerHeight

    cvs.style.position = "absolute"
    cvs.style.width = "100vw"
    cvs.style.height = "100vh"
    cvs.style.imageRendering = "pixelated"
    document.body.style.margin = "0"
    document.body.appendChild(cvs)
    Engine.targetCanvas = cvs
    Engine.targetContext = Engine.
      _AdvancedContext(cvs.getContext("2d"))
  }

  static LoadScene(scene) {
    MonoBehavior.all = []
    scene.entities.forEach
      (ent => ent.behaviors.forEach
        (mb => MonoBehavior.all.push(mb)))
    Engine.currentScene = scene
  }

  static Start() {
    MonoBehavior.all.forEach(mb => {
      if (!mb.entity.active) return
      mb.Start()
    })
    Engine._startTime = Date.now() / 1000
  }

  static _startTime
  static Mainloop() {
    // run physics stuff first!
    Physics.CheckCollisions()

    MonoBehavior.all.forEach(mb => {
      if (!mb.entity.active) return
      mb.Update()
    })

    if (Engine.currentScene == null) {
      Debug.Error("Current scene is not specified.")
      Debug.Warn("Use Engine.LoadScene(yourScene) to fix.")
      Debug.RenderScreenMessages()
      return
    }

    // render stuff
    Engine.targetContext.resetTransform()
    Engine.targetContext.clearRect(0, 0,
      Engine.targetCanvas.width,
      Engine.targetCanvas.height)

    Engine.targetContext.transform(
      Engine.currentScene.camera.
        camera.projMat.MultMat
        (Engine.currentScene.camera.
          transform.worldMatrix))

    MonoBehavior.all.forEach(mb => {
      if (!mb.entity.active) return
      Engine.targetContext.save()
      Engine.targetContext.transform(
        mb.entity.transform.worldMatrix)
      mb.Render(Engine.targetContext)
      Engine.targetContext.restore()
    })

    // render debug data over scene
    if (Debug.active) {
      Engine.targetContext.resetTransform()
      Debug.RenderScreenMessages()
    }

    // do time stuff here
    const now = Date.now() / 1000
    Time.deltaTime = now - Engine._startTime
    Time.deltaTime *= Time.timeScale
    Time.time += Time.deltaTime
    Engine._startTime = now

    window.requestAnimationFrame
      (Engine.Mainloop)
  }

  // define yourself
  static Setup = EmptyFunc
}



window.addEventListener("load", () => {
  Engine.InitCanvas()
  Input.Init(Engine.targetCanvas)

  const ctx = Engine.targetContext

  // show intro (if exists)
  function intro() {
    const t = (Date.now() - startTime) / 1e3

    if (t < Engine.loadingScreen.introTime) {
      Engine.loadingScreen.Intro(ctx, t)
      requestAnimationFrame(intro)
    }
    else {
      // do loading routine
      Resource.BeginLoading()
      requestAnimationFrame(load)
    }
  }

  // actual loading
  function load() {
    // run loading screen while loading
    const t = Resource.loadingProgress

    if (t < 1) {
      Engine.loadingScreen.Update(ctx, t)
      requestAnimationFrame(load)
    }
    else {
      startTime = Date.now()
      requestAnimationFrame(extra)
    }
  }

  // show extra stuff
  function extra() {
    const t = (Date.now() - startTime) / 1e3

    if (t < Engine.loadingScreen.extraTime) {
      Engine.loadingScreen.Extra(ctx, t)
      requestAnimationFrame(extra)
    } else {
      Engine.Setup()
      Engine.Start()
      Engine.Mainloop()
    }
  }

  if (Engine.Setup == EmptyFunc) {
    Debug.Error("You need to specify your own Engine.Setup function.")
    return
  }

  let startTime = Date.now()
  requestAnimationFrame(intro)
})