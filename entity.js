import Transform from "./transform.js"

class Entity
{
  name; behaviors; parent; active
  children

  constructor(name, parent = null)
  {
    this.name = name
    this.parent = parent
    this.active = true
    this.behaviors = [new Transform(this)]
    this.children = []
  }

  AddComponent(componentClass)
  {
    const mb = new componentClass(this)
    this.behaviors.push(mb)
    return mb
  }

  GetComponent(componentClass)
  {
    const mb = this.behaviors
    for (let i = 0; i < mb.length; i++)
      if (mb[i] instanceof componentClass)
        return mb[i]
    return null
  }

  AddChild(entity)
  {
    entity.parent = this
    this.children.push(entity)
  }
}

export default Entity