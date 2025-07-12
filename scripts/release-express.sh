#!/bin/bash
set -e

default_branch=$(git symbolic-ref --short HEAD)

# 1. Build the Express package
cd packages/express
yarn install
yarn build
cd ../..

# 2. Create a tmp folder in the root
rm -rf tmp
mkdir tmp

# 3. Copy distributable files to tmp
cp -r packages/express/dist tmp/
cp packages/express/package.json tmp/
for f in packages/express/*Adapter.*; do
  [ -e "$f" ] && cp "$f" tmp/
done

# 4. Stash any uncommitted changes
git stash push -u -m "temp-release-express-stash"

# 5. Create or reset release-express branch
git fetch origin
if git show-ref --quiet refs/heads/release-express; then
  git branch -D release-express
fi
git checkout --orphan release-express

# 6. Remove everything except .git and tmp
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'tmp' -exec rm -rf {} +

# 7. Move all contents from tmp to root, then delete tmp
mv tmp/* .
rmdir tmp

# 8. Add, commit, and force push
git add .
git commit -m "Release express dist on $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
git pull --no-edit --rebase=false --allow-unrelated-histories -X ours origin release-express || true
git push origin release-express

# 9. Return to the original branch and restore working directory
git checkout "$default_branch"
git reset --hard
git stash pop || true 