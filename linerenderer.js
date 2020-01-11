import Vector from "./vector.js"
import BasicRenderer from "./basicrenderer.js"

class LineRenderer extends BasicRenderer
{
  points

  constructor(entity)
  {
    super(entity)
    this.points =
    [
      new Vector(0, 0),
      new Vector(1, 0)
    ]
    entity.lineRenderer = this
  }

  Render(ctx)
  {
    super.Render(ctx)

    ctx.beginPath()
    this.points.forEach
      (p => ctx.lineTo(p.x, p.y))
    ctx.stroke()
  }
}

export default LineRenderer