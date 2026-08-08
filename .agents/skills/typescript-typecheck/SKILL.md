---
name: typescript-typecheck
description: Typecheck TypeScript files before finishing work; tests and a project build may also be included, but are optional.
user-invocable: false
metadata:
  author: Estéban Soubiran <skills@soubiran.dev>
---

Before finishing any changes or validating in depth your work, **always typecheck the changes**.

Run the commands in the root of the project.

```sh
pnpm run typecheck
```

> [!IMPORTANT]
> This should be done after linting, as the linting can catch some errors that the typecheck process might not.
