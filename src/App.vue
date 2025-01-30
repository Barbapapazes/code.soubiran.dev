<script lang="ts">
import type { Language } from '@/code/types/language'
import type { Size } from '@/code/types/size'
import Watermark from '@/code/components/Watermark.vue'
import { camera as cameraIcon, moon as moonIcon, sun as sunIcon } from '@/icons'

const app = tv({
  slots: {
    base: 'w-screen h-screen p-4 bg-[var(--ui-bg)] text-[var(--ui-text)] flex flex-col items-center justify-center gap-8',
    container: 'w-full flex flex-col gap-8',
    wrapper: 'relative',
    watermark: 'absolute inset-x-0 bottom-6 text-center translate-y-1/2',
    actions: 'absolute bottom-8 inset-x-0 max-w-screen-sm mx-auto w-full flex justify-between gap-2',
  },
  variants: {
    size: {
      sm: {
        container: 'max-w-screen-sm',
      },
      md: {
        container: 'max-w-screen-md',
      },
      lg: {
        container: 'max-w-screen-lg',
      },
    },
  },
})

export interface AppProps {}
export interface AppEmits {}
export interface AppSlots {}
</script>

<script setup lang="ts">
const editor = templateRef('editor')
const { capture: captureScreenshot } = useScreenshot(() => editor.value?.el)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { language, size } = useCode()

const sizes: { label: string, value: Size }[] = [
  {
    label: 'Small',
    value: 'sm',
  },
  {
    label: 'Medium',
    value: 'md',
  },
  {
    label: 'Large',
    value: 'lg',
  },
]
const languages: Language[] = (['typescript', 'markdown'] satisfies Language[]).sort()

const ui = computed(() => app({
  size: size.value,
}))
</script>

<template>
  <main :class="ui.base()">
    <div :class="ui.container()">
      <EditorWrapper ref="editor" :class="ui.wrapper()">
        <Editor />

        <Watermark :class="ui.watermark()" />
      </EditorWrapper>

      <div :class="ui.actions()">
        <ButtonGroup>
          <Button
            :icon="isDark ? moonIcon : sunIcon"
            color="neutral"
            variant="subtle"
            @click="toggleDark()"
          />

          <Select
            v-model="size"
            :items="sizes"
            color="neutral"
            variant="subtle"
            class="w-28"
          />

          <Select
            v-model="language"
            :items="languages"
            color="neutral"
            variant="subtle"
            class="w-32 capitalize"
            :ui="{ item: 'capitalize' }"
          />
        </ButtonGroup>

        <Button
          :icon="cameraIcon"
          label="Capture"
          color="neutral"
          variant="solid"
          @click="captureScreenshot"
        />
      </div>
    </div>
  </main>
</template>
