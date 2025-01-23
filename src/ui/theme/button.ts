import { buttonGroupVariant } from '@/ui/theme/button-group'

export default {
  slots: {
    base: 'relative rounded-[calc(var(--ui-radius)*1.5)] tracking-wide inline-flex items-center focus:outline-hidden disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors ease-out',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    trailingIcon: 'shrink-0',
    loadingIcon: 'absolute inset-0 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
  },
  variants: {
    ...buttonGroupVariant,
    color: {
      primary: '',
      neutral: '',
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      link: '',
    },
    size: {
      xs: {
        base: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4',
        loadingIcon: 'size-4',
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4',
        ladingIcon: 'size-4',
      },
      md: {
        base: 'px-3 py-1.5 text-sm gap-2',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5',
        loadingIcon: 'size-5',
      },
      lg: {
        base: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5',
        loadingIcon: 'size-5',
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        leadingAvatarSize: 'xs',
        trailingIcon: 'size-6',
        loadingIcon: 'size-6',
      },
    },
    block: {
      true: {
        base: 'w-full justify-center',
        leadingAvatarSize: 'xs',
        trailingIcon: 'ms-auto',
      },
    },
    square: {
      true: '',
    },
    leading: {
      true: '',
    },
    trailing: {
      true: '',
    },
    loading: {
      true: {
        leadingIcon: 'opacity-0',
        label: 'opacity-0',
        trailingIcon: 'opacity-0',
        loadingIcon: 'animate-spin',
      },
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: `text-[var(--ui-bg)] bg-[var(--ui-primary)] hover:bg-[var(--ui-primary)]/75 disabled:bg-[var(--ui-primary)] aria-disabled:bg-[var(--ui-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]`,
    } as const,
    {
      color: 'primary',
      variant: 'outline',
      class: `ring ring-inset ring-[var(--ui-primary)]/50 text-[var(--ui-primary)] hover:bg-[var(--ui-primary)]/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-[var(--ui-primary)]`,
    } as const,
    {
      color: 'primary',
      variant: 'soft',
      class: `text-[var(--ui-primary)] bg-[var(--ui-primary)]/10 hover:bg-[var(--ui-primary)]/15 focus-visible:bg-[var(--ui-primary)]/15 disabled:bg-[var(--ui-primary)]/10 aria-disabled:bg-[var(--ui-primary)]/10`,
    } as const,
    {
      color: 'primary',
      variant: 'subtle',
      class: `text-[var(--ui-primary)] ring ring-inset ring-[var(--ui-primary)]/25 bg-[var(--ui-primary)]/10 hover:bg-[var(--ui-primary)]/15 disabled:bg-[var(--ui-primary)]/10 aria-disabled:bg-[var(--ui-primary)]/10 focus-visible:ring-2 focus-visible:ring-[var(--ui-primary)]`,
    } as const,
    {
      color: 'primary',
      variant: 'ghost',
      class: `text-[var(--ui-primary)] hover:bg-[var(--ui-primary)]/10 focus-visible:bg-[var(--ui-primary)]/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`,
    } as const,
    {
      color: 'primary',
      variant: 'link',
      class: `text-[var(--ui-primary)] hover:text-[var(--ui-primary)]/75 disabled:text-[var(--ui-primary)] aria-disabled:text-[var(--ui-primary)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-primary)]`,
    } as const,
    {
      color: 'neutral',
      variant: 'solid',
      class: 'text-[var(--ui-bg)] bg-[var(--ui-bg-inverted)] hover:bg-[var(--ui-bg-inverted)]/90 disabled:bg-[var(--ui-bg-inverted)] aria-disabled:bg-[var(--ui-bg-inverted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-border-inverted)]',
    } as const,
    {
      color: 'neutral',
      variant: 'outline',
      class: 'ring ring-inset ring-[var(--ui-border-accented)] text-[var(--ui-text)] bg-[var(--ui-bg)] hover:bg-[var(--ui-bg-elevated)] disabled:bg-[var(--ui-bg)] aria-disabled:bg-[var(--ui-bg)] focus-visible:ring-2 focus-visible:ring-[var(--ui-border-inverted)]',
    } as const,
    {
      color: 'neutral',
      variant: 'soft',
      class: 'text-[var(--ui-text)] bg-[var(--ui-bg-elevated)] hover:bg-[var(--ui-bg-accented)]/75 focus-visible:bg-[var(--ui-bg-accented)]/75 disabled:bg-[var(--ui-bg-elevated)] aria-disabled:bg-[var(--ui-bg-elevated)]',
    } as const,
    {
      color: 'neutral',
      variant: 'subtle',
      class: 'ring ring-inset ring-[var(--ui-border-accented)] text-[var(--ui-text)] bg-[var(--ui-bg-elevated)] hover:bg-[var(--ui-bg-accented)]/75 disabled:bg-[var(--ui-bg-elevated)] aria-disabled:bg-[var(--ui-bg-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--ui-border-inverted)]',
    } as const,
    {
      color: 'neutral',
      variant: 'ghost',
      class: 'text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)] focus-visible:bg-[var(--ui-bg-elevated)] hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent',
    } as const,
    {
      color: 'neutral',
      variant: 'link',
      class: 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] disabled:text-[var(--ui-text-muted)] aria-disabled:text-[var(--ui-text-muted)] focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[var(--ui-border-inverted)]',
    } as const,
    {
      size: 'xs',
      square: true,
      class: 'p-1',
    } as const,
    {
      size: 'sm',
      square: true,
      class: 'p-1.5',
    } as const,
    {
      size: 'md',
      square: true,
      class: 'p-1.5',
    } as const,
    {
      size: 'lg',
      square: true,
      class: 'p-2',
    } as const,
    {
      size: 'xl',
      square: true,
      class: 'p-2',
    } as const,
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  } as const,
}
