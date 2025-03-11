---
id: configuration
title: Configuration
description: How to configure YADRMS after installation.
sidebar_position: 999
---

# Configuration

After installation, you’ll need to configure the system:

## Environment Variables

Set up the following environment variables:

- **DISCORD_BOT_TOKEN:** Your Discord bot token.
- **API_ENDPOINT:** URL for the backend API.
- **LOG_LEVEL:** Set the logging level (e.g., DEBUG, INFO).

## Configuration Files

- **backend/config.yml:** Contains settings for the Python backend.
- **frontend/.env:** Contains frontend configuration such as API endpoints.

## Example Configuration

```yaml
# backend/config.yml
discord:
  token: "YOUR_DISCORD_BOT_TOKEN"
api:
  endpoint: "http://localhost:8000/api"
logging:
  level: "DEBUG"
```

Make sure to restart both backend and frontend services after updating configuration files.
