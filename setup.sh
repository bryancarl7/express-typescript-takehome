#!/bin/bash

# Clear and Reset NPM dependencies
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps

# Setup data-space
mkdir -p data

# TODO:
# 1. Abstraction scripts for different OS setup
# 2. Add better comments
# 3. Cleanup dependency warnings
