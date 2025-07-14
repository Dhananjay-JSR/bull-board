#!/bin/bash
set -e

echo "🧹 Cleaning up existing release branches..."

# List of release branches to reset
RELEASE_BRANCHES=("release-api" "release-ui" "release-express")

for branch in "${RELEASE_BRANCHES[@]}"; do
  echo "Processing branch: $branch"
  
  # Check if branch exists locally and remove it
  if git show-ref --quiet refs/heads/$branch; then
    echo "  📍 Removing local branch: $branch"
    git branch -D $branch
  else
    echo "  ℹ️  Local branch $branch does not exist"
  fi
  
  # Check if branch exists remotely and remove it
  if git ls-remote --exit-code --heads origin $branch > /dev/null 2>&1; then
    echo "  🌐 Removing remote branch: $branch"
    git push origin --delete $branch
  else
    echo "  ℹ️  Remote branch $branch does not exist"
  fi
  
  # Create new empty branch with no history
  echo "  ➕ Creating new empty branch: $branch"
  git checkout --orphan $branch
  
  # Remove all files from the working directory
  git rm -rf . || true
  
  # Create an empty commit to establish the branch
  git commit --allow-empty -m "Initial empty commit for $branch"
  
  # Push the new branch to remote
  git push origin $branch
  
  echo "  ✅ Branch $branch created successfully"
done

# Return to master branch
git checkout master

echo ""
echo "🎉 All release branches have been reset successfully!"
echo "📋 Created branches:"
for branch in "${RELEASE_BRANCHES[@]}"; do
  echo "  - $branch (empty with no history)"
done 