// joystick prefab!
function Joystick() {
  Joystick.Stick =
    class Stick extends MonoBehavior {
      cr; following = false

      Start() {
        this.cr = this.GetComponent(CircleRenderer)
      }

      Update() {
        if (Input.isTouching) {
          let pos = Engine.currentScene.camera.
            camera.projMat.inverse.
            MultPoint(Input.touchStartPos)

          let delta = pos.Subtract(this.entity.
            parent.transform.position)

          if (delta.magnitude <= 1)
            this.following = true
        } else this.following = false

        if (this.following) {
          let pos = Engine.currentScene.camera.
            camera.projMat.inverse.
            MultPoint(Input.touchPos)

          let delta = pos.Subtract(this.entity.
            parent.transform.position)

          if (delta.magnitude > 1)
            delta = delta.normalized

          this.cr.stroke = Color.black
          this.entity.transform.
            localPosition = delta
          // return data back
          this.entity.parent.delta.Copy(delta)
        } else {
          this.cr.stroke = new Color
            (0, 0, 0, 0.2)
          this.entity.transform.
            localPosition = Vector.zero
          // return data back
          this.entity.parent.delta.Copy(Vector.zero)
        }
      }
    }

  const js = new Entity("Joystick")
  js.delta = Vector.zero

  const cr = js.AddComponent(CircleRenderer)
  cr.fill = new Color(255, 255, 255, 0.2)
  cr.stroke = new Color(0, 0, 0, 0.2)

  { // add stick as a child
    const st = new Entity("Joystick stick")

    const cr = st.AddComponent(CircleRenderer)
    cr.radius = 0.3
    cr.fill = new Color(255, 255, 255, 0.2)
    cr.stroke = new Color(0, 0, 0, 0.5)

    st.AddComponent(Joystick.Stick)
    js.AddChild(st)
  }

  return js
}