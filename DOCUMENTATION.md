# YADRMS Technical Documentation

This document provides detailed technical information about the YADRMS project architecture, components, and how they interact.

## Project Structure

```
YADRMS/
├── .github/                   # GitHub CI/CD workflows
├── backend/                   # Backend code for script generation
│   ├── languages/             # Language-specific implementations
│   │   └── python/            # Python client generator
│   │       ├── builder.py     # Main script generator
│   │       └── components/    # Modular bot components
│   │           ├── done/      # Completed components ready for use
│   │           └── TODO/      # Components in development
│   └── settings/              # Configuration files
├── frontend/                  # Next.js web application
│   ├── app/                   # Next.js app directory (Pages and components)
│   │   ├── BuilderUI/         # Main interface for bot configuration
│   │   ├── .fonts/            # Font assets
│   │   ├── page.tsx           # Homepage (EULA page)
│   │   ├── layout.tsx         # Root layout component
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── custom/            # Custom components
│   │   ├── hooks/             # React hooks
│   │   └── ui/                # ShadCN UI components
│   ├── lib/                   # Utility functions
│   └── pages/                 # API routes and legacy pages
│       └── api/               # API endpoints
│           ├── bot/           # Bot-related endpoints
│           │   ├── get-all-scripts.ts  # List available scripts
│           │   ├── logs.ts             # Get bot logs
│           │   └── testing.ts          # Start/stop bot for testing
│           ├── compile.ts              # Compile client script
│           ├── languages.ts            # List supported languages
│           ├── modules.ts              # List available modules
│           └── save-settings.ts        # Save configuration
├── OUTPUT/                    # Generated client scripts output
├── EULA.md                    # End User License Agreement
└── How-To-Code.md             # Coding guidelines
```

## Component Functionality

### Backend

#### Builder Script (`backend/languages/python/builder.py`)

The builder script is responsible for generating the client-side Python script that will be deployed on target machines. It:

1. Reads the configuration from `backend/settings/settings.json`
2. Loads the base script template with core functionality
3. Dynamically includes selected modules from `components/done/`
4. Outputs the final script to the `OUTPUT/` directory with a timestamp

#### Component Modules

Each component in the `components/done/` directory is a Python module that provides specific functionality for the client. Components must implement:

- `get_code()`: Returns the Python code to be included in the client script
- `get_dependencies()` (optional): Returns a list of required dependencies

### Frontend

#### BuilderUI (`frontend/app/BuilderUI/page.tsx`)

The main interface for configuring and testing bots. Features:

1. **Configuration Panel**:

   - Discord bot token input
   - Guild ID input
   - Language selection
   - Module selection (checkboxes)

2. **Testing Panel**:
   - Script selection dropdown
   - Start/Stop bot controls
   - Real-time log viewer

#### API Routes

1. **Compile API (`/api/compile`)**:

   - Executes the Python builder script
   - Returns compilation status and output

2. **Save Settings API (`/api/save-settings`)**:

   - Saves bot configuration to `backend/settings/settings.json`
   - Includes token, guild ID, language, and module selections

3. **Modules API (`/api/modules`)**:

   - Lists available modules for a specified language
   - Scans the `components/done/` directory

4. **Bot Testing API (`/api/bot/testing`)**:

   - Starts or stops a bot process with a specified script
   - Manages process IDs and logs

5. **Logs API (`/api/bot/logs`)**:
   - Retrieves logs from running bot processes
   - Supports real-time polling

## Data Flow

1. User configures bot settings in the BuilderUI
2. Settings are saved to `backend/settings/settings.json` via the Save Settings API
3. User compiles the script via the Compile API
4. The builder script generates a client script in the `OUTPUT/` directory
5. User can test the bot by starting it from the Testing panel
6. The bot connects to Discord and awaits commands

## Discord Bot Functionality

The generated client script creates a Discord bot that:

1. Connects to the specified Discord server
2. Creates a channel based on the machine's MAC address
3. Listens for commands prefixed with a period (e.g., `.ls`)
4. Executes commands on the local machine
5. Returns the output in a Discord message
6. Maintains a session for each user with working directory context

## Security Considerations

The YADRMS system has significant security implications:

1. The generated client allows for remote command execution
2. Discord bot tokens must be kept secure
3. The system should only be used on machines you own or have permission to use
4. Not intended for production environments
5. No authentication beyond Discord's mechanisms

## Extensibility

### Adding New Modules

To add a new module:

1. Create a Python file in `backend/languages/python/components/done/`
2. Implement the `get_code()` function
3. Optionally implement `get_dependencies()`
4. The module will automatically appear in the BuilderUI

### Supporting New Languages

The project has a framework for supporting multiple languages:

1. Create a new directory in `backend/languages/`
2. Implement a builder script and component system
3. Update the frontend to support the new language

## Future Improvements

1. Enhanced authentication mechanisms
2. More sophisticated module system
3. File transfer capabilities
4. Graphical remote control features
5. Cross-platform compiled clients
