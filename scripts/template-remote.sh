#!/bin/bash

# Check if the project is a git repository
if [ ! -d .git ]; then
  echo "This script should be run at the root of a git repository"
  exit 1
fi

# Check if the template remote already exists
if git remote get-url template > /dev/null 2>&1; then
  echo "Template remote already exists"
  git remote remove template
fi

# Delete the template branch if it already exists
if git branch --list template > /dev/null 2>&1; then
  git branch -D template
  git push origin --delete template
fi

# Save current branch
current_branch=$(git branch --show-current)

# Setup Template Remote for the project
git remote add template git@github.com:TheGoatedDev/EnterpriseNest.git

# Fetch the template remote
git fetch template

# Create a new branch from the template remote
git checkout -b template $current_branch

# Push the new branch to the origin remote
git push origin template

# Merge the template branch into the saved branch
git merge template/main

# Push the saved branch to the origin remote
git push origin template

# Checkout the saved branch
git checkout $current_branch

# Delete the template remote
git remote remove template

# Setup PR for the saved branch
gh pr create --base $current_branch --head template --title "Merge template changes" --body "This PR merges the latest changes from the template repository" -d --auto

# Print success message
echo "Template remote setup successfully"