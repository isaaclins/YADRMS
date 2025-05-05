# 🌐 YADRMS

<div align="center">
  <h3>Yet Another Discord Remote Management Software</h3>
  <p>A modern, modular remote management solution powered by Discord</p>
  
  ![License](https://img.shields.io/badge/license-Custom_EULA-blue)
  ![Framework](https://img.shields.io/badge/framework-Next.js_19-black)
  ![Language](https://img.shields.io/badge/language-TypeScript_|_Python-3178c6)
</div>

---

## ✨ Overview

YADRMS is a sophisticated remote management system that leverages Discord as a command and control channel. Built with a sleek Next.js frontend and a modular Python backend, it allows for secure remote access to systems through an intuitive interface.

<div align="center">
  <table>
    <tr>
      <td align="center">🔧 <b>Modular</b></td>
      <td align="center">🛡️ <b>Secure</b></td>
      <td align="center">🧪 <b>Testable</b></td>
      <td align="center">🔌 <b>Extensible</b></td>
    </tr>
  </table>
</div>

## 🚀 Features

- **📱 Modern Web Interface** - Sleek, responsive UI built with Next.js and ShadCN
- **🧩 Plug-and-Play Modules** - Easily extend functionality with custom modules
- **🤖 Discord Integration** - Control systems through familiar Discord commands
- **🔍 Real-time Testing** - Test your configuration directly within the UI
- **📊 Live Monitoring** - View logs and outputs in real time
- **📦 Dynamic Client Generation** - Create tailored clients with the exact features you need
- **🔄 Multi-language Support** - Infrastructure for Python with room to expand

## 🏗️ Architecture

YADRMS follows a modern, microservice-oriented architecture:

### Frontend (Next.js)

```
frontend/
├── app/               # Next.js app router
│   ├── BuilderUI/     # Main configuration interface
│   └── .fonts/        # Custom fonts
├── components/        # Reusable UI components
├── lib/               # Utility functions
└── pages/api/         # API endpoints
```

### Backend (Python)

```
backend/
├── languages/         # Language implementations
│   └── python/        # Python client generator
│       ├── builder.py # Script generator
│       └── components/# Modular components
└── settings/          # Configuration files
```

## 🔧 How It Works

<div align="center">
  <img src="https://mermaid.ink/img/pako:eNptUk1vozAQ_SsjX9oVEuXjkENLDj2supfVHnawB4iFbWQPKYry3zEkadRWvoD9Zt6bN2N_kUpqJGmSOWO1L7MgCOD38aQJjFYd1HCQhJugMZr7XuUHXQnOGRTKWeMqQ1qVMGQMDlibAfO2Cy-H4xO0lV5X2m2uh_xZm6Y1evF_cN6jgXR8PLHcEEjH_YYwu9kCuirfq1F_fU-fXZFm6fM-3ef5PH3DGU3CnbFGcn-AKhxdcStSA3XVotbF69D3Tv9ZaHW7hYewsxrCTwsejVUfJbO1sqq9p0RpVTHbDOplCsJjfJclJO2NvY1Kq9JVEC3gCEatS1i83QTJAhZvkYxWR21xNp8GknR4Pm7c8ZjO8P9P_YWxsLvnuZnQ0uJzXDRrLOVlNZLRerQbrnG3lh22c3a3sLa4j2Ps9BfZn4wZ" alt="YADRMS Flow" />
</div>

1. **Configuration** - Set up your Discord bot token, guild ID, and select modules
2. **Compilation** - Generate a custom Python client with selected capabilities
3. **Deployment** - Run the generated script on your target system
4. **Connection** - The bot connects to Discord and creates a unique channel
5. **Control** - Issue commands prefixed with `.` (e.g., `.ls`, `.screenshot`)
6. **Execution** - Commands are executed on the target system
7. **Response** - Results are posted back to the Discord channel

## 🛠️ API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/compile` | POST | Generate the client script |
| `/api/save-settings` | POST | Save bot configuration |
| `/api/modules` | GET | List available modules |
| `/api/languages` | GET | List supported languages |
| `/api/bot/testing` | POST | Start/stop bot for testing |
| `/api/bot/logs` | GET | Retrieve bot logs |

## 📋 Available Modules

YADRMS includes several ready-to-use modules:

- **📸 Screenshot** - Capture and send screenshots
- **📎 Clipboard** - Access clipboard contents
- **💻 BSOD** - Trigger blue screen simulation
- **🖼️ Wallpaper** - Change desktop wallpaper
- **✍️ Ghostwriting** - Remote text input

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Discord account and bot token

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/YADRMS.git
cd YADRMS

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Configuration

1. Create a Discord bot at [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable all intents for your bot
3. Invite the bot to your server with appropriate permissions
4. Copy your bot token and guild ID
5. Enter these details in the BuilderUI
6. Select desired modules
7. Click "Compile" to generate your client

### Testing

Test your configuration directly from the UI:

```bash
# From the frontend directory
npm run test:local
```

This will:
1. Start the Next.js server
2. Run all test files in sequence 
3. Display a summary of results
4. Save detailed logs for review

## ⚠️ Security Notice

YADRMS is designed for **educational purposes** and should only be used on systems you own or have explicit permission to access. Please read the [EULA](EULA.md) before use.

The software:
- Is intended for controlled environments only
- Should never be used in production settings
- Carries inherent security risks
- Has no built-in encryption
- Requires responsible usage

## 🧠 Development

### Adding New Modules

1. Create a Python file in `backend/languages/python/components/done/`
2. Implement `get_code()` and `get_dependencies()` functions
3. The module will automatically appear in the BuilderUI

```python
def get_dependencies():
    return """
import some_library
"""

def get_code():
    return """
    # ADDED MY_MODULE
    elif message.content.lower() == "my_command":
        # Your code here
        await message.channel.send("Command executed!")
"""
```

## 🤝 Contribution

Contributions are welcome! Please adhere to the [coding style guide](How-To-Code.md) when submitting pull requests.

## 📄 License

This project is licensed under the terms of the [EULA](EULA.md) included in the repository.

---

<div align="center">
  <p>Made with ❤️ for educational purposes only</p>
  <p>For detailed technical information, see <a href="DOCUMENTATION.md">DOCUMENTATION.md</a></p>
</div>
