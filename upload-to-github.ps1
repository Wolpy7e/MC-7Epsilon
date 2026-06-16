param(
  [string]$RepoUrl = ''
)

if (-not $RepoUrl) {
  Write-Host 'Usage: .\upload-to-github.ps1 -RepoUrl "https://github.com/username/repo.git"'
  exit 1
}

Write-Host 'Initializing Git repository...'
if (-not (Test-Path .git)) {
  git init
}

git branch -M main

git add .
git commit -m 'Initial Discord Control Center for Minecraft Bedrock' | Out-Null

git remote remove origin 2>$null

git remote add origin $RepoUrl

git push -u origin main

Write-Host 'Upload complete. Check GitHub repository.'
