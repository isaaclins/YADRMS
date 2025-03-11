---
id: frontend-api
title: Frontend API & Integration
description: (If applicable) How the frontend communicates with the backend.
sidebar_position: 999
---

# Frontend API & Integration

This document explains how the Next.js frontend interacts with the backend API.

## Communication Flow

1. **API Calls:** The frontend makes REST API calls to the backend to retrieve client data.
2. **WebSocket Integration:** For real-time updates, the frontend uses WebSocket connections.
3. **Error Handling:** In case of API errors, the frontend shows appropriate error messages.

## Example Code Snippet

```javascript
// Example: Fetching client data in Next.js
async function fetchClients() {
  const res = await fetch(`${process.env.API_ENDPOINT}/clients`);
  const data = await res.json();
  return data;
}
```

Ensure that the `API_ENDPOINT` variable in your `.env` file is correctly set.
