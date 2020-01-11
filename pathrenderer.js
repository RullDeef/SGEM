import BasicRenderer from "./basicrenderer.js"

class PathRenderer extends BasicRenderer
{
  path = new Path2D()

  constructor(entity)
  {
    super(entity)
    entity.meshRenderer = this
  }

  Render(ctx)
  {
    super.Render(ctx)

    ctx.fill(this.path)
    ctx.stroke(this.path)
  }
}

export default PathRenderer