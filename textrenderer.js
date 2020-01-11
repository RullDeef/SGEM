import Vector from "./vector.js"
import Matrix3x3 from "./matrix.js"
import BasicRenderer from "./basicrenderer.js"

class TextRenderer extends BasicRenderer
{
  text = ""; font = "arial"; size = "12px"
  align = "left"; baseLine = "bottom"

  constructor(entity)
  {
    super(entity)
    entity.textRenderer = this
  }

  Render(ctx)
  {
    super.Render(ctx)

    ctx.transform(Matrix3x3.Scale
      (new Vector(1, -1)))

    ctx.font = this.size + " " + this.font
    ctx.textAlign = this.align
    ctx.textBaseline = this.baseLine

    const p = this.entity.transform.position

    ctx.fillText(this.text, 0, 0)
    ctx.strokeText(this.text, 0, 0)
  }
}

export default TextRenderer