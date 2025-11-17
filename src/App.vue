<script lang="ts" setup>
import type { SelectItem } from '@nuxt/ui'
import type { Language } from '@/types/language'
import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue'
import camera from '~icons/ph/camera'
import moon from '~icons/ph/moon'
import sun from '~icons/ph/sun'
import Watermark from '@/components/Watermark.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useScreenshot } from '@/composables/useScreenshot'
import { useSize } from '@/composables/useSize'

const editor = ref<{ el?: HTMLElement }>()
const { capture: captureScreenshot } = useScreenshot(() => editor.value?.el)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { size } = useSize()
const sizes: SelectItem[] = [
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
  {
    label: 'Extra Large',
    value: 'xl',
  },
]

const { language } = useLanguage()
const languages: SelectItem[] = (['typescript', 'markdown', 'php', 'json', 'html', 'vue'] satisfies Language[])
  .sort()
  .map(lang => ({ label: lang, value: lang }))
</script>

<template>
  <main class="w-screen h-screen p-4 bg-default text-default flex flex-col items-center justify-center gap-8">
    <div
      class="w-full flex flex-col gap-8" :class="{
        'max-w-screen-sm': size === 'sm',
        'max-w-screen-md': size === 'md',
        'max-w-screen-lg': size === 'lg',
        'max-w-screen-xl': size === 'xl',
      }"
    >
      <EditorWrapper ref="editor" class="relative">
        <Editor class="shadow-lg" />

        <Watermark class="absolute inset-0 bottom-6 text-center translate-y-1/2" />
      </EditorWrapper>

      <div class="absolute bottom-8 inset-x-0 max-w-screen-sm mx-auto w-full flex justify-between gap-2">
        <UFieldGroup>
          <UButton
            :icon="isDark ? moon : sun"
            color="neutral"
            variant="subtle"
            @click="toggleDark()"
          />

          <USelect
            v-model="size"
            :items="sizes"
            color="neutral"
            variant="subtle"
            class="w-28"
          />

          <USelect
            v-model="language"
            :items="languages"
            color="neutral"
            variant="subtle"
            class="w-32"
          />
        </UFieldGroup>

        <UButton
          :icon="camera"
          label="Capture"
          color="neutral"
          variant="solid"
          @click="captureScreenshot"
        />
      </div>
    </div>
  </main>
</template>
