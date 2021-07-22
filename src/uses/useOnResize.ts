import { PerspectiveCamera, WebGLRenderer } from "three"
import { onBeforeUnmount, onMounted } from "vue"

const useOnResize = (
  sizes: { width: number; height: number },
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) => {
  const onResize = () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  onMounted(() => {
    window.addEventListener("resize", onResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize)
  })
}

export default useOnResize
