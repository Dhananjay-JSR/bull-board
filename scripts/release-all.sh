#!/bin/bash
set -e

# Ensure all release branches exist, create from master if missing
for branch in release-api release-ui release-express; do
  if ! git show-ref --quiet refs/heads/$branch && ! git ls-remote --exit-code --heads origin $branch > /dev/null; then
    git checkout master
    git checkout --orphan $branch
    # Remove all files except .git to ensure the branch is empty
    find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
    git rm -rf --cached .
    git commit --allow-empty -m "Initialize $branch as empty orphan branch"
    # Do not make any commit, push the empty orphan branch
    git push origin $branch
    git checkout -
    git reset --hard HEAD
  fi
done

chmod +x scripts/release-api.sh scripts/release-ui.sh scripts/release-express.sh

# Remove yarn.lock and node_modules before running release-api.sh
rm -f yarn.lock
rm -rf node_modules
yarn install
./scripts/release-api.sh

# Remove yarn.lock and node_modules before running release-ui.sh
rm -f yarn.lock
rm -rf node_modules
yarn install
./scripts/release-ui.sh

# Remove yarn.lock and node_modules before running release-express.sh
rm -f yarn.lock
rm -rf node_modules
yarn install
./scripts/release-express.sh 

echo "Bull Board Packages Updated 🎉 🎉 🎉" 