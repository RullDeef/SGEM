Math.TAU = 2 * Math.PI
Math.degToRad = Math.PI / 180
Math.radToDeg = 180 / Math.PI



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
    return new Vector(this.x / mag, this.y / mag)
  }

  Add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  Subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  Dot(v) {
    return this.x * v.x + this.y * v.y
  }

  static get zero() {
    return new Vector(0, 0)
  }

  static get one() {
    return new Vector(1, 1)
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
}



class Rect {
  position; size

  constructor(pos, size) {
    this.position = pos
    this.size = size
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
    for (let i = 0; i < value.length; i++) {
      res.push(value[i].x)
      res.push(value[i].y)
    }
    this.path = new Float32Array(res)
  }
}



class Color {
  r; g; b; a

  constructor(r, g, b, a) {
    this.r = r; this.g = g
    this.b = b; this.a = a
  }

  get rgba() {
    return `rgba(${this.r},
      ${this.g},${this.b},${this.a})`
  }

  static get white() {
    return new Color(255, 255, 255, 1)
  }

  static get black() {
    return new Color(0, 0, 0, 1)
  }

  static Lerp(colA, colB, t) {
    const result = Color.black
    result.r = colA.r + (colB.r - colA.r) * t
    result.g = colA.g + (colB.g - colA.g) * t
    result.b = colA.b + (colB.b - colA.b) * t
    result.a = colA.a + (colB.a - colA.a) * t
    return result
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
}



class BasicRenderer extends MonoBehavior {
  stroke; fill; width
  lineCap = "round"

  constructor(entity) {
    super(entity)
    this.stroke = Color.black
    this.fill = Color.white
    this.width = 0.1
  }

  Render(ctx) {
    ctx.strokeStyle = this.stroke.rgba
    ctx.fillStyle = this.fill.rgba
    ctx.lineWidth = this.width
    ctx.lineCap = this.lineCap
  }
}



class LineRenderer extends BasicRenderer {
  points

  constructor(entity) {
    super(entity)
    this.points =
      [
        new Vector(0, 0),
        new Vector(1, 0)
      ]
    entity.lineRenderer = this
  }

  Render(ctx) {
    super.Render(ctx)

    ctx.beginPath()
    this.points.forEach
      (p => ctx.lineTo(p.x, p.y))
    ctx.stroke()
  }
}



class BoxRenderer extends BasicRenderer {
  size;

  constructor(entity) {
    super(entity)
    this.size = new Vector(1, 1)
    this.entity.boxRenderer = this
  }

  Render(ctx) {
    super.Render(ctx)

    ctx.fillRect
      (-this.size.x / 2, -this.size.y / 2,
        this.size.x, this.size.y)

    ctx.strokeRect
      (-this.size.x / 2, -this.size.y / 2,
        this.size.x, this.size.y)
  }
}



class CircleRenderer extends BasicRenderer {
  radius;

  constructor(entity) {
    super(entity)
    this.radius = 1
    this.entity.circleRenderer = this
  }

  Render(ctx) {
    super.Render(ctx)

    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.TAU)

    ctx.fill()
    ctx.stroke()
  }
}



class PathRenderer extends BasicRenderer {
  path = new Path2D()

  constructor(entity) {
    super(entity)
    entity.meshRenderer = this
  }

  Render(ctx) {
    super.Render(ctx)

    ctx.fill(this.path)
    ctx.stroke(this.path)
  }
}



class Camera extends MonoBehavior {
  projMat; _z; _fov

  constructor(entity) {
    super(entity)

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
    this.projMat = Matrix3x3.Project
      (Engine.targetCanvas.width,
        Engine.targetCanvas.height,
        this._z, this._fov)
  }
}



class Collider extends MonoBehavior {
  static Type = { circle: 0, rect: 1 }
  type

  constructor(entity) {
    super(entity)
    this.type = Collider.Type.circle
    entity.collider = this
  }

  CheckCollision() {
    // ?
  }
}



class RigidBody extends MonoBehavior {
  constructor(entity) {
    super(entity)
    entity.rigidBody = this
  }

  // ??
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
}



class Engine {
  static targetContext
  static targetCanvas

  static currentScene

  static dpi = 5

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
    MonoBehavior.all.forEach(mb => {
      if (!mb.entity.active) return
      mb.Update()
    })

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

    // do time stuff here
    const now = Date.now() / 1000
    Time.deltaTime = now - Engine._startTime
    Time.deltaTime *= Time.timeScale
    Time.time += Time.deltaTime
    Engine._startTime = now

    window.requestAnimationFrame
      (Engine.Mainloop)
  }

  static Setup() { } // define yourself
}



window.addEventListener("load", () => {
  Engine.InitCanvas()
  Input.Init(Engine.targetCanvas)
  Engine.Setup()
  Engine.Start()
  Engine.Mainloop()
})