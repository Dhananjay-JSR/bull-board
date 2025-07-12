#!/bin/bash
set -e

default_branch=$(git symbolic-ref --short HEAD)

# 1. Build the API package
cd packages/api
yarn install
yarn build
cd ../..

# 2. Create a tmp folder in the root
rm -rf tmp
mkdir tmp

# 3. Copy distributable files to tmp
cp -r packages/api/dist tmp/
cp packages/api/package.json tmp/
# Copy all *Adapter.* files if they exist
for f in packages/api/*Adapter.*; do
  [ -e "$f" ] && cp "$f" tmp/
done

# 4. Stash any uncommitted changes
git stash push -u -m "temp-release-api-stash"

# 5. Create or reset release-api branch
git fetch origin
if git show-ref --quiet refs/heads/release-api; then
  git branch -D release-api
fi
git checkout --orphan release-api

# 6. Remove everything except .git and tmp
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'tmp' -exec rm -rf {} +

# 7. Move all contents from tmp to root, then delete tmp
mv tmp/* .
rmdir tmp

# 8. Add, commit, and force push
git add .
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "Release api dist on $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  git pull --no-edit --rebase=false --allow-unrelated-histories -X ours origin release-api || true
  git push origin release-api
fi

# 9. Return to the original branch and restore working directory
git checkout "$default_branch"
git reset --hard
git stash pop || true 