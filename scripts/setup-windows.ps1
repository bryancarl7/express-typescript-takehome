if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "node is required but not installed. Aborting."; exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is required but not installed. Aborting."; exit 1
}

if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
npm install --legacy-peer-deps
New-Item -ItemType Directory -Force -Path data | Out-Null
