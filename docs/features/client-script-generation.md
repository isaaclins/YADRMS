---
id: client-script-generation
title: Dynamic Client Script Generation
description: How YADRMS generates client scripts dynamically.
sidebar_position: 1
---

# Dynamic Client Script Generation

YADRMS automatically generates client scripts based on settings and active modules.

## Process

1. **Configuration Parsing:** Reads settings from the configuration file.
2. **Script Generation:** Generates a tailored script (`main.py`) for each client.
3. **Deployment:** Distributes the generated script to the client machine.

## Benefits

- **Automation:** Reduces manual effort.
- **Customization:** Tailors scripts to individual client needs.
- **Scalability:** Easily manages many clients concurrently.
