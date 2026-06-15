# Recipes

Add your coffee recipe Markdown files here.

## File naming convention

```
<method>-<name>.md
```

### Examples
- `espresso-classic-double.md`
- `pourover-v60-light-roast.md`
- `cold-brew-overnight.md`

## Frontmatter schema (for Phase 2)

Each recipe file should start with YAML frontmatter like this:

```yaml
---
title: "Classic Double Espresso"
method: "Espresso"
difficulty: "Intermediate"
brew_time: "5 minutes"
yield: "60ml"
tags: ["espresso", "classic", "strong"]
---
```

Then write your recipe body in Markdown below the frontmatter.
