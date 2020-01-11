import Matrix3x3 from "./matrix.js"
import Time from "./time.js"
import MonoBehavior from "./monobehavior.js"


class Engine
{
  static targetContext
  static targetCanvas

  static currentScene

  static dpi = 5

  static _AdvancedContext(ctx)
  {
    Object.assign(ctx,
      { _projMat: [Matrix3x3.identity] })
    Object.defineProperty(ctx, "projMat", {
      get()
      {
        return this._projMat[0].Clone()
      }
    })
    let _transform = ctx.transform.bind(ctx)
    let _reset = ctx.resetTransform.bind(ctx)
    let _save = ctx.save.bind(ctx)
    let _restore = ctx.restore.bind(ctx)
    ctx.transform = function (mat3)
    {
      ctx._projMat[0] = mat3.MultMat(ctx._projMat[0])
      let m = mat3.data
      _transform(m[0], m[1], m[3],
        m[4], m[2], m[5])
    }
    ctx.resetTransform = function ()
    {
      ctx._projMat[0] = Matrix3x3.identity
      _reset()
    }
    ctx.save = function ()
    {
      _save()
      ctx._projMat.unshift(ctx._projMat[0].Clone())
    }
    ctx.restore = function ()
    {
      _restore()
      ctx._projMat.shift()
    }
    return ctx
  }

  static InitCanvas()
  {
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

  static LoadScene(scene)
  {
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
  static Mainloop()
  {
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

export default Engine