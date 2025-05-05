#!/bin/bash

# Create required directories
mkdir -p backend/settings
mkdir -p OUTPUT

# Check if settings.json exists, if not create it
if [ ! -f backend/settings/settings.json ]; then
  echo "Creating default settings.json file"
  echo '{
    "token": "",
    "guildid": "",
    "language": "python",
    "Modules": {}
  }' > backend/settings/settings.json
fi

# Install frontend dependencies if needed
if [ ! -d frontend/node_modules ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install
  cd ..
fi

# Start the frontend application
echo "Starting YADRMS frontend..."
cd frontend && npm run dev


