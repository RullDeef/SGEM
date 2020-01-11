import Math from "./maths.js"
import BasicRenderer from "./basicrenderer.js"

class CircleRenderer extends BasicRenderer
{
  radius;

  constructor(entity)
  {
    super(entity)
    this.radius = 1
    this.entity.circleRenderer = this
  }

  Render(ctx)
  {
    super.Render(ctx)

    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.TAU)

    ctx.fill()
    ctx.stroke()
  }
}

export default CircleRenderer