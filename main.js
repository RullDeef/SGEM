import Math from "./maths.js"
import Random from "./random.js"
import Vector from "./vector.js"
import Rotation from "./rotation.js"
import Matrix3x3 from "./matrix.js"
import Rect from "./rect.js"
import Color from "./color.js"
import Time from "./time.js"
import Input from "./input.js"
import MonoBehavior from "./monobehavior.js"
import Transform from "./transform.js"
import BasicRenderer from "./basicrenderer.js"
import LineRenderer from "./linerenderer.js"
import BoxRenderer from "./boxrenderer.js"
import CircleRenderer from "./circlerenderer.js"
import Mesh from "./mesh.js"
import PathRenderer from "./pathrenderer.js"
import Camera from "./camera.js"
import Collider from "./collider.js"
import RigidBody from "./rigidbody.js"
import Entity from "./entity.js"
import Scene from "./scene.js"
import Engine from "./engine.js"

window.addEventListener("load", () => {
  Engine.InitCanvas()
  Input.Init(Engine.targetCanvas)
  Engine.Setup()
  Engine.Start()
  Engine.Mainloop()
})