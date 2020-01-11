import Vector from "./vector.js"
import BasicRenderer from "./basicrenderer.js"

class BoxRenderer extends BasicRenderer
{
  size;

  constructor(entity)
  {
    super(entity)
    this.size = new Vector(1, 1)
    this.entity.boxRenderer = this
  }

  Render(ctx)
  {
    super.Render(ctx)

    ctx.fillRect
      (-this.size.x / 2, -this.size.y / 2,
        this.size.x, this.size.y)

    ctx.strokeRect
      (-this.size.x / 2, -this.size.y / 2,
        this.size.x, this.size.y)
  }
}

export default BoxRenderer