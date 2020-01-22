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
    this.size = Vector.one
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