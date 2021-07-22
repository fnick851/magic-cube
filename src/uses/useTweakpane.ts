import { onBeforeUnmount } from "vue"
import { Pane } from "tweakpane"

export default function useTweakpane() {
  const pane = new Pane()

  onBeforeUnmount(() => {
    pane.dispose()
  })

  return pane
}
