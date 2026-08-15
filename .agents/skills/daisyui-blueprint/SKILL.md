---
name: daisyui-blueprint
description: Official daisyUI Blueprint MCP server and component guide. Provides pre-built page architectures, design rules, and Tailwind CSS 4 + daisyUI 5 component syntax.
metadata:
  version: 1.5.7
  source: https://daisyui.com/blueprint/antigravity/
---

# daisyUI Blueprint MCP Skill

The **daisyUI Blueprint MCP Server** provides automated design advice, component syntax checking, and pre-built page architecture for Tailwind CSS 4 and daisyUI 5.

## Available Tools & Roles:
- **`daisyui_setup_expert`**: Initializes cohesive design direction and returns a unique `workflowId`.
- **`daisyui_rules_enforcer`**: Enforces strict daisyUI 5 component rules and Tailwind 4 syntax.
- **`daisyui_creative_director`**: Recommends color palettes, typography, and visual themes.
- **`daisyui_page_architect`**: Selects pre-built page blueprints (`pages/admin-dashboard`, `pages/executive-kpi-dashboard`, `pages/analytics-dashboard`, etc.).
- **`daisyui_component_syntax_expert`**: Generates production-ready component code snippets.
- **`daisyui_quality_inspector`**: Audits and validates layout contrast, accessibility, and responsive behavior.
- **`convert_*` tools**: Converts Figma, Bootstrap, Screenshots, or raw Tailwind CSS into clean daisyUI 5 markup.

## MCP Configuration:
File: `~/.gemini/config/mcp_config.json`
```json
{
  "mcpServers": {
    "daisyui-blueprint": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "daisyui-blueprint@latest"],
      "env": {
        "LICENSE": "B4L0D-XQYZT-DUC7K-GC92V-M649O",
        "EMAIL": "aalmamunsikder@gmail.com"
      }
    }
  }
}
```
