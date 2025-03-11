---
id: dependency-management
title: Dependency Management
description: How Renovate keeps dependencies up-to-date.
sidebar_position: 1
---

# Dependency Management

YADRMS uses Renovate to automatically scan and update dependencies.

## How Renovate Works

- **Scanning:** Renovate periodically checks for newer versions of your dependencies.
- **Pull Requests:** Automatically creates PRs to update dependencies.
- **Review:** You review and merge the PRs after verifying CI/CD passes.

## Best Practices

- **Regular Reviews:** Check Renovate PRs frequently.
- **CI/CD Monitoring:** Ensure that all tests pass before merging updates.
