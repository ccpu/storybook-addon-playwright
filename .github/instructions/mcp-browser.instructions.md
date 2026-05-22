---
description: This file provides instructions for the MCP Browser and how to use it effectively.
---

When a code change in the addon needs to be tested or viewed in the browser, rebuild and rerun the addon first, then refresh the browser to see the changes. Hot reload does not work reliably for components or code used inside the addon.

Alternatively, create Storybook stories for the components and test them in Storybook. Hot reload works there and it is faster for iterating on changes.
