---
name: typescript-reformat
description: Reformat TypeScript files before finishing work; linting, typecheck, tests and a project build may also be included, but are optional.
user-invocable: false
metadata:
  author: Estéban Soubiran <skills@soubiran.dev>
---

Before finishing any changes or validating in depth your work, **always reformat the changes**.

Run the commands in the root of the project.

```sh
pnpm run lint:fix
```

> [!IMPORTANT]
> This should be done before checking potential ESLint errors, as the reformatting can fix some of them.
