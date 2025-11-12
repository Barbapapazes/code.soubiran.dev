<script setup lang="ts">
import type { Language } from '@/code/types/language'
import type { Size } from '@/code/types/size'
import Watermark from '@/code/components/Watermark.vue'
import { camera as cameraIcon, moon as moonIcon, sun as sunIcon } from '@/icons'

const editor = templateRef('editor')
const { capture: captureScreenshot } = useScreenshot(() => editor.value?.el)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { size } = useSize()
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
  {
    label: 'Extra Large',
    value: 'xl',
  },
]

const { language } = useLanguage()
const languages: { label: string, value: Language }[] = (['typescript', 'markdown', 'php', 'json', 'html', 'vue'] satisfies Language[]).sort().map(lang => ({ label: lang, value: lang }))
</script>

<template>
  <main class="w-screen h-screen p-4 bg-[var(--ui-bg)] text-[var(--ui-text)] flex flex-col items-center justify-center gap-8">
    <div
      class="w-full flex flex-col gap-8" :class="{
        'max-w-screen-sm': size === 'sm',
        'max-w-screen-md': size === 'md',
        'max-w-screen-lg': size === 'lg',
        'max-w-screen-xl': size === 'xl',
      }"
    >
      <div ref="editor" class="relative">
        <Editor class="shadow-lg" />
        <Watermark class="absolute inset-x-0 bottom-6 text-center translate-y-1/2" />
      </div>

      <div class="absolute bottom-8 inset-x-0 max-w-screen-sm mx-auto w-full flex justify-between gap-2">
        <UButtonGroup>
          <UButton
            :icon="isDark ? moonIcon : sunIcon"
            color="neutral"
            variant="subtle"
            @click="toggleDark()"
          />

          <USelectMenu
            v-model="size"
            :options="sizes"
            color="neutral"
            variant="subtle"
            class="w-28"
          />

          <USelectMenu
            v-model="language"
            :options="languages"
            color="neutral"
            variant="subtle"
            class="w-32"
          >
            <template #label>
              <span class="capitalize">{{ language }}</span>
            </template>
          </USelectMenu>
        </UButtonGroup>

        <UButton
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
