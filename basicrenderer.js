import MonoBehavior from "./monobehavior.js"

class BasicRenderer extends MonoBehavior
{
  stroke; fill; width
  lineCap = "round"

  constructor(entity)
  {
    super(entity)
    this.stroke = Color.black
    this.fill = Color.white
    this.width = 0.1
  }

  Render(ctx)
  {
    ctx.strokeStyle = this.stroke.rgba
    ctx.fillStyle = this.fill.rgba
    ctx.lineWidth = this.width
    ctx.lineCap = this.lineCap
  }
}

export default BasicRenderer