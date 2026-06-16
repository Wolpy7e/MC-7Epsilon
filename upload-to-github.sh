#!/usr/bin/env bash
set -e

REPO_URL="$1"
if [ -z "$REPO_URL" ]; then
  echo "Usage: ./upload-to-github.sh <repo-url>"
  exit 1
fi

git init 2>/dev/null || true
git branch -M main
git add .
git commit -m "Initial Discord Control Center for Minecraft Bedrock" || true
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git push -u origin main

echo "Upload complete. Check your GitHub repository."
