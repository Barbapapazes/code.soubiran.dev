---
name: typescript-lint
description: Lint TypeScript files after reformatting, but before finishing work; typecheck, tests and a project build may also be included, but are optional.
user-invocable: false
metadata:
  author: Estéban Soubiran <skills@soubiran.dev>
---

Before finishing any changes or validating in depth your work, **always lint the changes**.

Run the commands in the root of the project.

```sh
pnpm run lint
```

> [!IMPORTANT]
> This should be done after reformatting, as the reformatting can fix some of the linting errors.
