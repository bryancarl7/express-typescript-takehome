#!/bin/bash

command -v node >/dev/null 2>&1 || { echo "node is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting."; exit 1; }

rm -rf node_modules
npm install --legacy-peer-deps
mkdir -p data
