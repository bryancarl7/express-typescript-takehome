#!/bin/bash

OS="$(uname -s)"

case "$OS" in
    Linux*)
        bash scripts/setup-linux.sh
        ;;
    Darwin*)
        bash scripts/setup-mac.sh
        ;;
    MINGW*|MSYS*|CYGWIN*)
        echo "Windows detected. Please run:"
        echo "  powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1"
        exit 0
        ;;
    *)
        echo "Unsupported OS: $OS. Please run setup manually."
        exit 1
        ;;
esac

echo "Running Unit tests to verify deployment"

npm start build
npm start test.unit

echo ""
read -p "You have successfully setup all dependencies. Would you like to start the app? (y/n): " answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    npm start serve
fi
