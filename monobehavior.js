class MonoBehavior
{
  static all = []
  id; entity

  constructor(entity)
  {
    this.id = MonoBehavior.all.length
    this.entity = entity
  }

  GetComponent(componentClass)
  {
    const mb = this.entity.behaviors
    for (let i = 0; i < mb.length; i++)
      if (mb[i] instanceof componentClass)
        return mb[i]
    return null
  }

  Start() { }
  Update() { }
  Render(ctx) { }
}

export default MonoBehavior