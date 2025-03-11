---
id: ci-cd
title: CI/CD Pipelines
description: How GitHub Actions are used for continuous integration and deployment.
sidebar_position: 999
---

# CI/CD Pipelines

YADRMS uses GitHub Actions to automate testing, building, and deployment.

## Pipeline Overview

- **Code-to-Issue Workflow:** Automatically creates issues from code annotations.
- **Changelog Update:** Generates a changelog based on commit messages.
- **Deployment:** Builds and deploys both the backend and frontend.

## Key Workflow Files

- `.github/workflows/code-to-issue-and-branch.yml`
- `.github/workflows/update-changelog.yaml`

Make sure to monitor your CI/CD dashboard and review workflows regularly.
