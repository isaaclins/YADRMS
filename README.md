# YADRMS (Yet Another Discord Remote Management Software)

## Overview

YADRMS is a Discord-based remote management system that allows users to monitor and control machines remotely through a Discord bot. The project consists of two main components:

1. **Frontend**: A Next.js web application that provides a UI for configuring, building, and testing the Discord bot
2. **Backend**: Python scripts that generate client-side code to be deployed on target machines

## Features

- **Discord Bot Integration**: Control remote machines through Discord commands
- **Dynamic Client Generation**: Generate customized Python client scripts with selected modules
- **Real-time Bot Testing**: Test bots directly from the web UI
- **Module System**: Extensible module system for adding custom functionality
- **Multi-language Support**: Infrastructure for supporting multiple programming languages (currently focused on Python)

## Architecture

### Frontend (Next.js)

- **UI Components**: Built with ShadCN UI and Tailwind CSS
- **API Routes**: RESTful endpoints for communication with backend
- **Pages**:
  - Home: EULA acceptance page
  - BuilderUI: Main interface for configuring and testing bots

### Backend (Python)

- **Builder Script**: Generates the client script based on settings
- **Component System**: Modular components that can be included in the client script
- **Settings**: JSON configuration for bot tokens, guild IDs, and modules

## API Endpoints

| Endpoint                   | Method | Description                                          |
| -------------------------- | ------ | ---------------------------------------------------- |
| `/api/compile`             | POST   | Compiles the client script using the backend builder |
| `/api/save-settings`       | POST   | Saves bot configuration settings                     |
| `/api/modules`             | POST   | Gets available modules for a specified language      |
| `/api/languages`           | GET    | Gets list of supported programming languages         |
| `/api/bot/testing`         | POST   | Starts or stops a bot for testing                    |
| `/api/bot/logs`            | GET    | Gets logs from a running bot                         |
| `/api/bot/get-all-scripts` | GET    | Gets a list of all generated scripts                 |

## How It Works

1. User configures bot settings through the BuilderUI (Discord token, guild ID, modules)
2. User saves settings and compiles the client script
3. The Python builder script generates a client script with the selected modules
4. User can test the bot directly from the UI or deploy the generated script on a target machine
5. The Discord bot establishes a connection to the specified Discord server
6. Commands can be issued through Discord to control the remote machine

## Security Considerations

This software is intended for educational and experimental purposes only. As stated in the EULA:

- Use only on systems you own or have permission to use
- Not intended for production use
- May contain security vulnerabilities
- User assumes all responsibility for consequences

## Getting Started

1. Clone the repository
2. Run `cd frontend && npm install` to install dependencies
3. Create a Discord bot and obtain a token
4. Configure bot settings in the BuilderUI
5. Compile the client script
6. Test or deploy the generated script

## Development

### Running the Application

```bash
# Start the frontend development server
cd frontend
npm run dev
```

### Project Structure

- `/frontend`: Next.js web application
- `/backend`: Python backend for script generation
- `/OUTPUT`: Generated client scripts
- `/.github`: CI/CD workflows

## License

This project is licensed under the terms of the EULA included in the repository.
