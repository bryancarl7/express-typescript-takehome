#!/bin/bash

command -v node >/dev/null 2>&1 || { echo "node is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting."; exit 1; }

if [ ! -f .env ]; then
    read -p "We need a .env file to begin properly. It is recommended to use .env.example. Would you like to copy it? (y/n): " env_answer
    if [ "$env_answer" = "y" ] || [ "$env_answer" = "Y" ]; then
        cp .env.example .env
        echo ".env created from .env.example."
    else
        echo "Skipping .env setup. The app may not start correctly without it."
    fi
else
    echo ".env already exists, skipping."
fi

rm -rf node_modules
npm install --legacy-peer-deps
mkdir -p data
