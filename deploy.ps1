Set-StrictMode -Version Latest
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
Write-Host 'Installing dependencies...'
npm install
Write-Host 'Building TypeScript...'
npm run build
Write-Host 'Checking PM2...'
$pm2 = Get-Command pm2 -ErrorAction SilentlyContinue
if (-not $pm2) {
    Write-Host 'PM2 not found. Installing globally...'
npm install -g pm2
}
pm2 startOrRestart ecosystem.config.js --env production
pm2 save
Write-Host 'Deployment complete. Use "pm2 status" to verify.'
