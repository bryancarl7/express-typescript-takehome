#!/bin/bash

# Dependency check
command -v node >/dev/null 2>&1 || { echo "node is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting."; exit 1; }

# Clear and Reset NPM dependencies
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps

# Setup data-space
mkdir -p data

# TODO:
# 1. Abstraction scripts for different OS setup
# 2. Add comments to source files
# 3. Cleanup dependency warnings
# 4. Write tests
# 5. Security?
