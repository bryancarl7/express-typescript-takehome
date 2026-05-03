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

# TODO:
# 1. Add comments to source files
# 2. Cleanup dependency warnings
# 3. Write tests
