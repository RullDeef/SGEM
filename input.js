import Vector from "./vector.js"
import Engine from "./engine"

class Input
{
  static isTouching = false
  static isDragging = false
  static _touchStartPos = Vector.zero
  static _touchPos = Vector.zero
  static _deltaPos = Vector.zero

  static get touchStartPos()
  {
    return Input._touchStartPos.Clone()
  }

  static get touchPos()
  {
    return Input._touchPos.Clone()
  }

  static get deltaPos()
  {
    return Input._deltaPos.Clone()
  }

  static Init(canvas)
  {
    canvas.addEventListener
      ("touchstart", Input.TouchStart)
    canvas.addEventListener
      ("touchmove", Input.TouchMove)
    canvas.addEventListener
      ("touchend", Input.TouchEnd)
  }

  static TouchStart(event)
  {
    Input.isTouching = true
    Input._touchPos.x =
      Input._touchStartPos.x = Engine.dpi *
      event.touches[0].pageX
    Input._touchPos.y =
      Input._touchStartPos.y = Engine.dpi *
      event.touches[0].pageY
  }

  static TouchMove(event)
  {
    Input.isDragging = true
    const x = Engine.dpi * event.touches[0].pageX
    const y = Engine.dpi * event.touches[0].pageY
    Input._deltaPos.x = x - Input._touchPos.x
    Input._deltaPos.y = y - Input._touchPos.y
    Input._touchPos.x = x
    Input._touchPos.y = y
  }

  static TouchEnd(event)
  {
    Input.isTouching = false
    Input.isDragging = false
  }
}

export default Input