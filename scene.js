import Camera from "./camera.js"
import Entity from "./entity.js"

class Scene
{
  static scenes = []
  name; entities; camera

  constructor(name)
  {
    this.name = name
    this.entities = []

    // create main camera
    this.camera = new Entity("Main Camera")
    this.camera.AddComponent(Camera)
    this.entities.push(this.camera)

    Scene.scenes.push(this)
  }

  AddEntity(ent, parent = null)
  {
    if (parent != null)
      ent.parent = parent
    this.entities.push(ent)
    ent.children.forEach(e => this.AddEntity(e))
  }

  GetEntity(name)
  {
    for (let i = 0; i < this.entities.length; i++)
      if (this.entities[i].name == name)
        return this.entities[i]
    return null
  }

  static GetScene(name)
  {
    for (let i = 0; i < Scene.scenes.length; i++)
      if (Scene.scenes[i].name == name)
        return Scene.scenes[i]
    return null
  }
}

export default Scene