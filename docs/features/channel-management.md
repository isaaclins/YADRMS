---
id: channel-management
title: Channel Management
description: How YADRMS manages Discord channels.
sidebar_position: 3
---

# Channel Management

YADRMS automates the creation and management of Discord text channels based on unique client MAC addresses.

## How It Works

- **Detection:** The system detects a new client connection.
- **Channel Creation:** A dedicated text channel is created in Discord.
- **Channel Assignment:** The channel is linked to the client’s MAC address for easy tracking.

## Configuration Options

You can customize channel names and permissions via the configuration file (`backend/config.yml`).

## Troubleshooting

- **Issue:** Channel not created.
- **Solution:** Verify that the Discord bot has sufficient permissions.
