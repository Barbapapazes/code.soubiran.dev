<script lang="ts" setup>
const workspace = useTemplateRef('workspace')
const editor = useEditor(() => workspace.value?.el)
const isAssistantOpen = ref(false)

for (const tool of editor.tools) {
  useWebMCP<Record<string, unknown>, unknown>(tool)
}
</script>

<template>
  <UApp>
    <EditorWorkspace ref="workspace" :editor="editor">
      <template #actions>
        <AssistantToggle @open="isAssistantOpen = true" />
      </template>
    </EditorWorkspace>

    <AssistantPanel
      v-model:open="isAssistantOpen"
      :tools="editor.tools"
      class="shrink-0 w-(--sidebar-width) transition-[width] duration-200 ease-linear motion-reduce:transition-none data-[state=collapsed]:w-0"
    />
  </UApp>
</template>
