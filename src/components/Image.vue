<script lang="ts">
const imageView = tv({
  base: 'w-full h-full object-contain',
})

export interface ImageProps {
  src: string
  class?: any
}
export interface ImageEmits {}
export interface ImageSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<ImageProps>()
defineEmits<ImageEmits>()
defineSlots<ImageSlots>()

const ui = computed(() => imageView({ class: props.class }))
</script>

<template>
  <img :src="src" :class="ui" alt="Uploaded image">
</template>
