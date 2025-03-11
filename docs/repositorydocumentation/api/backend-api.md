---
id: backend-api
title: Backend API Reference
description: (If applicable) API documentation for the backend services.
sidebar_position: 999
---

# Backend API Reference

This section provides an overview of the backend API endpoints used by YADRMS.

## Base URL

```
http://localhost:8000/api
```

## Endpoints

### GET /clients
- **Description:** Retrieve a list of connected clients.
- **Response:** JSON array of client objects.

### POST /clients
- **Description:** Register a new client.
- **Request Body:** Client configuration details.
- **Response:** Confirmation message and client ID.

> Note: These endpoints are subject to change. Refer to inline comments in the source code for the most accurate details.
