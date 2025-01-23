export default {
  base: 'focus-visible:outline-[var(--ui-primary)]',
  variants: {
    active: {
      true: 'text-[var(--ui-primary)]',
      false: 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] transition-colors',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75',
    },
  },
}
