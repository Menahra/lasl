#!/usr/bin/env bash
# invoke-jules.sh
#
# Fire-and-forget: creates a Jules session and exits immediately.
# Jules handles everything from here — it will clone the repo, do the work,
# and open a PR autonomously. No polling needed.
#
# Required env vars:
#   JULES_API_KEY       — Jules API key
#   JULES_PROMPT        — The prompt to send to Jules
#   STARTING_BRANCH     — Branch Jules starts from (becomes the PR base)
#   GITHUB_REPOSITORY   — owner/repo (set automatically by GitHub Actions)

set -euo pipefail

echo "🤖 Creating Jules session on branch: ${STARTING_BRANCH}"

jq -n \
  --arg prompt  "$JULES_PROMPT" \
  --arg branch  "$STARTING_BRANCH" \
  --arg repo    "$GITHUB_REPOSITORY" \
  '{
    prompt: $prompt,
    sourceContext: {
      source: ("sources/github/" + $repo),
      githubRepoContext: { startingBranch: $branch }
    },
    requirePlanApproval: false,
    automationMode: "AUTO_CREATE_PR"
  }' > /tmp/jules-payload.json

HTTP_STATUS=$(curl -s -o /tmp/jules-response.json -w "%{http_code}" \
  'https://jules.googleapis.com/v1alpha/sessions' \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: ${JULES_API_KEY}" \
  -d @/tmp/jules-payload.json)

if [ "$HTTP_STATUS" -lt 200 ] || [ "$HTTP_STATUS" -ge 300 ]; then
  echo "❌ Jules API returned HTTP ${HTTP_STATUS}:"
  cat /tmp/jules-response.json
  exit 1
fi

SESSION_ID=$(cat /tmp/jules-response.json | jq -r '.id // empty')

if [ -z "$SESSION_ID" ]; then
  echo "❌ Session created but no ID in response:"
  cat /tmp/jules-response.json | jq .
  exit 1
fi

echo "✅ Jules session created: ${SESSION_ID}"
echo "🔗 Monitor at: https://jules.google.com"
echo "📋 Jules will open a PR into ${STARTING_BRANCH} when complete."
