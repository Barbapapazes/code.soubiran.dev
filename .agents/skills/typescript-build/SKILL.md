---
name: typescript-build
description: Build TypeScript files before finishing work; reformatting, linting, typecheck and tests may also be included, but are optional.
user-invocable: false
metadata:
  author: Estéban Soubiran <skills@soubiran.dev>
---

Before finishing any changes or validating in depth your work, **always build the changes**.

Run the commands in the root of the project.

```sh
pnpm run build
```

> [!IMPORTANT]
> This should be done after linting, as the linting can catch some errors that the build process might not.
