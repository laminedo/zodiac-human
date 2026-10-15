#!/bin/sh
# Builds the app and force-pushes dist/ to the gh-pages branch of origin.
set -e
cd "$(dirname "$0")/.."
REMOTE=$(git remote get-url origin)
npx vite build
cd dist
touch .nojekyll
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -f "$REMOTE" gh-pages
rm -rf .git
