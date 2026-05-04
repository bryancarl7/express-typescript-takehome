if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "node is required but not installed. Aborting."; exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is required but not installed. Aborting."; exit 1
}

if (-not (Test-Path .env)) {
    $env_answer = Read-Host "We need a .env file to begin properly. It is recommended to use .env.example. Would you like to copy it? (y/n)"
    if ($env_answer -eq "y" -or $env_answer -eq "Y") {
        Copy-Item .env.example .env
        Write-Host ".env created from .env.example."
    } else {
        Write-Host "Skipping .env setup. The app may not start correctly without it."
    }
} else {
    Write-Host ".env already exists, skipping."
}

if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
npm install --legacy-peer-deps
New-Item -ItemType Directory -Force -Path data | Out-Null

Write-Host "Running unit tests to verify setup..."
npm start test.unit

Write-Host ""
$answer = Read-Host "You have successfully setup all dependencies. Would you like to start the app? (y/n)"
if ($answer -eq "y" -or $answer -eq "Y") {
    npm start serve
}
