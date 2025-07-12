#!/bin/bash
set -e

default_branch=$(git symbolic-ref --short HEAD)

# 1. Build the UI package
cd packages/ui
yarn install
yarn build
cd ../..

# 2. Create a tmp folder in the root
rm -rf tmp
mkdir tmp

# 3. Copy distributable files to tmp
cp -r packages/ui/dist tmp/
cp -r packages/ui/typings tmp/ 2>/dev/null || true
cp packages/ui/package.json tmp/
for f in packages/ui/*Adapter.*; do
  [ -e "$f" ] && cp "$f" tmp/
done

# 4. Stash any uncommitted changes
git stash push -u -m "temp-release-ui-stash"

# 5. Create or reset release-ui branch
git fetch origin
if git show-ref --quiet refs/heads/release-ui; then
  git branch -D release-ui
fi
git checkout --orphan release-ui

# 6. Remove everything except .git and tmp
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'tmp' -exec rm -rf {} +

# 7. Move all contents from tmp to root, then delete tmp
mv tmp/* .
rmdir tmp

# 8. Add, commit, and force push
git add .
git commit -m "Release ui dist on $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
git pull --no-edit --rebase=false --allow-unrelated-histories -X ours origin release-ui || true
git push origin release-ui

# 9. Return to the original branch and restore working directory
git checkout "$default_branch"
git reset --hard
git stash pop || true 