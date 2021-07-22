<script lang="ts" setup>
import {
  AxesHelper,
  BoxGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import { onMounted, onBeforeUnmount, ref } from "vue"
import useOnResize from "../uses/useOnResize"
import useTweakpane from "../uses/useTweakpane"

const scene = new Scene()
const axesHelper = new AxesHelper(2)
scene.add(axesHelper)

// create a mesh
const boxInitialSize = { x: 0.5, y: 0.5, z: 0.5 }
const geometry = new BoxGeometry(
  boxInitialSize.x,
  boxInitialSize.y,
  boxInitialSize.z
)
const material = new MeshBasicMaterial({ color: 0xff0000 })
const mesh = new Mesh(geometry, material)
scene.add(mesh)

// set up camera and renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const camera = new PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)
const renderer = new WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
useOnResize(sizes, camera, renderer)

const PARAMS = {
  "Box Size": boxInitialSize,
  Movement: 0,
}
const pane = useTweakpane()
pane.addInput(PARAMS, "Box Size").on("change", function (ev) {
  mesh.scale.x = ev.value.x
  mesh.scale.y = ev.value.y
  mesh.scale.z = ev.value.z
})
pane
  .addInput(PARAMS, "Movement", {
    options: {
      "Do nothing": 0,
      "Move along X for one unit": 1,
      "Move along Y for one unit": 2,
      "Move along Z for one unit": 3,
      "Back to origin": 4,
    },
  })
  .on("change", function (ev) {
    switch (ev.value) {
      case 1:
        gsap.to(mesh.position, { duration: 1, x: mesh.position.x + 1 })
        break
      case 2:
        gsap.to(mesh.position, { duration: 1, y: mesh.position.y + 1 })
        break
      case 3:
        gsap.to(mesh.position, { duration: 1, z: mesh.position.z + 1 })
        break
      case 4:
        gsap.to(mesh.position, { duration: 2, x: 0, y: 0, z: 0 })
    }
  })

// kick off things when mounted
const sceneRootRef = ref()
let animationReq: number
onMounted(() => {
  const root = sceneRootRef.value
  root.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const clock = new Clock()
  const eachFrame = () => {
    const elapsedTime = clock.getElapsedTime()
    const red = Math.sin(elapsedTime / 3) / 2 + 0.5
    const green = Math.sin(elapsedTime / 2) / 2 + 0.5
    const blue = Math.sin(elapsedTime / 1) / 2 + 0.5
    mesh.material.color.setRGB(red, green, blue)

    controls.update()
    renderer.render(scene, camera)
    animationReq = window.requestAnimationFrame(eachFrame)
  }
  animationReq = window.requestAnimationFrame(eachFrame)
})

// clean up
onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationReq)
})
</script>

<template>
  <div class="scene-root" ref="sceneRootRef"></div>
</template>
