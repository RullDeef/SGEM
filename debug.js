// base class for all types of screen messages
class DebugMessage {
  rect = new Rect() // bounding rect

  // var that determines if current
  // message can be chained to prev.
  chainable = true

  // var that holds message to
  // which current was chained
  chainedTo = null

  // method for chaining two debug
  // messages (m2 right to m1)
  static Chain(m1, m2) {
    if (m2.chainable) {
      m2.rect.position.Copy(m1.rect.position)
      m2.rect.position.x += m1.rect.size.x
      m2.chainedTo = m1
    }
  }

  // virtual method for actual
  // rendering message on screen
  // at position provided by rect
  Render(ctx) { }
}



class TextMessage extends DebugMessage {
  static Type = { log: 0, warning: 1, error: 2 }
  type; text

  constructor(text, type = 0) {
    super()
    this.text = text
    this.type = type
    this.rect.size.x = text.length *
      Engine.dpi * Debug.fontSize * 0.6
    this.rect.size.y = Debug.fontSize * Engine.dpi + 4
  }

  Render(ctx) {
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.font = Debug.fontSize * Engine.dpi + "px monospace"
    ctx.lineWidth = 2 * Engine.dpi

    if (this.type == 0) {
      ctx.strokeStyle = "white"
      ctx.fillStyle = "black"
    }
    if (this.type == 1) {
      ctx.strokeStyle = "cyan"
      ctx.fillStyle = "orange"
    }
    if (this.type == 2) {
      ctx.strokeStyle = "white"
      ctx.fillStyle = "red"
    }
    ctx.translate(this.rect.position.x,
      this.rect.position.y)
    ctx.strokeText(this.text, 0, 0)
    ctx.fillText(this.text, 0, 0)
  }
}



class FuncMessage extends DebugMessage {
  func; len

  constructor(func = EmptyFunc, maxLen = 16) {
    super()
    this.func = func
    this.len = maxLen
    this.rect.size.x = maxLen *
      Engine.dpi * Debug.fontSize * 0.6
    this.rect.size.y = Debug.fontSize * Engine.dpi + 4
  }

  Render(ctx) {
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.font = Debug.fontSize * Engine.dpi + "px monospace"
    ctx.lineWidth = Engine.dpi

    ctx.strokeStyle = "lime"
    ctx.fillStyle = "darkgray"

    const txt = this.func().toString()

    ctx.translate(this.rect.position.x,
      this.rect.position.y)
    ctx.strokeText(txt, 0, 0)
    ctx.fillText(txt, 0, 0)
  }
}



class InfoMessage extends DebugMessage {
  // info object created from given one
  static InfoData = class {
    object; className; properties = {}

    constructor(obj) {
      this.object = obj

      let s = obj.constructor.toString()
      if (s.startsWith("class")) {
        this.className = /^class\s+(\w+)/.exec(s)[1]
        // grab all properties from object
        for (let prop in obj) {
          let dat = obj[prop]
          if (typeof dat == "string") {
            dat = "\"" + dat + "\""
          } else if (typeof dat == "function") {
            dat = "function(...) {...}"
          } else if (dat instanceof Array) {
            dat = "Array(" + dat.length + ")"
          } else if (dat instanceof MonoBehavior) {
            const tp = /^class\s+(\w+)/.exec
              (dat.constructor.toString())[1]
            dat = tp + " (from MonoBehavior)"
          } else if (dat === null) {
            dat = "null"
          } else {
            dat = dat.toString()
          }
          this.properties[prop] = dat
        }
      } else {
        Debug.Error("Debug.ShowInfo: given object is not an instance of a class.")
      }
    }

    Update() {
      this.properties = {}
      // grab all properties from object
      for (let prop in this.object) {
        let dat = this.object[prop]
        if (typeof dat == "string") {
          dat = "\"" + dat + "\""
        } else if (typeof dat == "function") {
          dat = "function(...) {...}"
        } else if (dat instanceof Array) {
          dat = "Array(" + dat.length + ")"
        } else if (dat instanceof MonoBehavior) {
          const tp = /^class\s+(\w+)/.exec
            (dat.constructor.toString())[1]
          dat = tp + " (from MonoBehavior)"
        } else if (dat === null) {
          dat = "null"
        } else {
          dat = dat.toString()
        }
        this.properties[prop] = dat
      }
    }
  }

  chainable = false
  object; info

  constructor(obj) {
    super()
    this.object = obj
    this.info = new InfoMessage.InfoData(obj)
    let i = 2
    for (let p in this.info.properties) i++
    this.rect.size.y = i * (Engine.dpi
      * Debug.fontSize + 4)
  }

  Render(ctx) {
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.font = Debug.fontSize * Engine.dpi + "px monospace"
    ctx.lineWidth = 2 * Engine.dpi

    ctx.strokeStyle = "white"
    ctx.fillStyle = "rgb(25, 50, 255)"

    this.info.Update()

    let txt = this.info.className + " {\n"
    for (let prop in this.info.properties) {
      txt += "  " + prop + ": " + this.info.properties[prop] + "\n"
    }

    txt += "}"
    txt = txt.split("\n")

    ctx.translate(this.rect.position.x,
      this.rect.position.y)
    txt.forEach(txt => {
      ctx.strokeText(txt, 0, 0)
      ctx.fillText(txt, 0, 0)
      ctx.translate(0, Debug.fontSize * Engine.dpi + 4)
    })
  }
}



class FPSMessage extends DebugMessage {
  _fps = 60; _lastTime = 0; updateTime = 0.25

  constructor() {
    super()
    this.rect.size.x = 7 * 0.6 *
      (Engine.dpi * Debug.fontSize + 4)
    this.rect.size.y = Engine.dpi
      * Debug.fontSize + 4
  }

  get fps() {
    if (this._lastTime + this.updateTime
      < Time.time) {
      this._lastTime = Time.time
      this._fps = Math.round(1 / Time.deltaTime)
    }
    return this._fps
  }

  Render(ctx) {
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.font = Debug.fontSize * Engine.dpi + "px monospace"
    ctx.lineWidth = 2 * Engine.dpi

    const fps = "FPS: " + this.fps
    ctx.translate(this.rect.position.x,
      this.rect.position.y)
    ctx.fillStyle = Color.Lerp(Color.red, Color.green, this._fps / 60).rgba
    ctx.fillRect(0, 0,
      this.rect.size.x, this.rect.size.y - 4)
    ctx.strokeStyle = "white"
    ctx.fillStyle = "black"
    ctx.strokeText(fps, 0, 0)
    ctx.fillText(fps, 0, 0)
  }
}



class Debug {
  static active = true
  static fontSize = 8

  static _screenMessages = []

  // updates position of all messages
  static _RepositionMessages() {
    let pos = Vector.zero
    Debug._screenMessages.forEach(msg => {
      // if is chained to other - grab from
      // current flow stream and reposition
      if (msg.chainedTo != null) {
        msg.rect.position.Copy(msg.
          chainedTo.rect.position)
        msg.rect.position.x += msg.
          chainedTo.rect.size.x
      } else {
        msg.rect.position.Copy(pos)
        pos.y += msg.rect.size.y
      }
    })
  }

  // filters positioned messages
  static _FilterMessages() {
    const msgs = Debug._screenMessages
    while (msgs.length != 0) {
      let msg = msgs[msgs.length - 1]
      if (msg.rect.position.y + msg.rect.
        size.y < Engine.targetCanvas.height)
        break // all good - leave cycle
      else {
        // delete first log and
        // warning messages
        let founded = false
        for (let i = 0; i < msgs.length; i++)
          if (msgs[i] instanceof TextMessage &&
            msgs[i].type != TextMessage.Type.error) {
            msgs.splice(i, 1)
            founded = true
            break
          }
        // remove very first message
        if (!founded) msgs.shift()
      }
      Debug._RepositionMessages()
    }
  }

  static RenderScreenMessages() {
    const ctx = Engine.targetContext
    const msgs = Debug._screenMessages

    for (let i = 0; i < msgs.length; i++) {
      ctx.save()
      msgs[i].Render(ctx)
      ctx.restore()
    }
  }

  // base function for adding
  // any type of message
  static _AddMessage(msg) {
    Debug._screenMessages.push(msg)
    Debug._RepositionMessages()
    Debug._FilterMessages()
    return msg
  }

  // multifunctional method for showing
  // info about object
  static ShowInfo(obj) {
    return Debug._AddMessage
      (new InfoMessage(obj))
  }

  // custom function dynamic debug message
  static ShowInfoFunc(func, maxLen = 16) {
    return Debug._AddMessage
      (new FuncMessage(func, maxLen))
  }

  static Log(str) {
    return Debug._AddMessage
      (new TextMessage(str, 0))
  }

  static Warn(str) {
    return Debug._AddMessage
      (new TextMessage(str, 1))
  }

  static Error(str) {
    return Debug._AddMessage
      (new TextMessage(str, 2))
  }

  static ShowFPS() {
    return Debug._AddMessage
      (new FPSMessage())
  }
}