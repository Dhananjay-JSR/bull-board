#!/bin/bash
set -e

# Ensure all release branches exist, create from master if missing
for branch in release-api release-ui release-express; do
  if ! git show-ref --quiet refs/heads/$branch && ! git ls-remote --exit-code --heads origin $branch > /dev/null; then
    git checkout master
    git checkout -b $branch
    git push origin $branch
    git checkout -
  fi
done

chmod +x scripts/release-api.sh scripts/release-ui.sh scripts/release-express.sh

./scripts/release-api.sh
./scripts/release-ui.sh
./scripts/release-express.sh 

echo "Bull Board Packages Updated 🎉 🎉 🎉" 