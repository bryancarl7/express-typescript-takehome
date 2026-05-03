#!/bin/bash

command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting."; exit 1; }

npm install --legacy-peer-deps

npm start serve
