import { defineMarkdownComponent } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'
import html from '@shikijs/langs/html'
import json from '@shikijs/langs/json'
import markdown from '@shikijs/langs/markdown'
import php from '@shikijs/langs/php'
import typescript from '@shikijs/langs/typescript'
import vue from '@shikijs/langs/vue'
import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'

export default defineMarkdownComponent({
  plugins: [
    shiki({
      languages: [html, json, markdown, php, typescript, vue],
      registerDefaultLanguages: false,
      registerDefaultThemes: false,
      themes: {
        dark: githubDark,
        light: githubLight,
      },
    }),
  ],
})
