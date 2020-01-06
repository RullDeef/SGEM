export let targetCanvas, targetContext

export function initCanvas()
{
    targetCanvas = document.createElement("canvas")
    targetCanvas.width = window.innerWidth
    targetCanvas.height = window.innerHeight
    
    targetCanvas.style.position = "absolute"
    targetCanvas.style.width = "100vw"
    targetCanvas.style.height = "100vh"
    
    document.body.style.margin = "0"
    document.body.appendChild(targetCanvas)
    targetContext = targetCanvas.getContext("2d")
}

export function setup()
{
    console.log("setup function is not defined!")
}

export function mainloop()
{
    console.log("mainloop running...")
}
