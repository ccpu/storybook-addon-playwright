---
'storybook-addon-playwright': patch
---

Fix peer dependency warnings in host projects: replace the unmaintained `react-json-view` (React ≤17 only) with `@microlink/react-json-view`, pin `@trpc/client`, `@trpc/react-query` and `@trpc/server` to the same version (11.19.0), and move `sharp` to `^0.35.5` to satisfy `join-images`.
