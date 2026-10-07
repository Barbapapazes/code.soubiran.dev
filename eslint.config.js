import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  vue: true,
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': ['error', {
      settings: {
        shellEmulator: true,
        trustPolicy: 'off',
      },
    }],
  },
})
