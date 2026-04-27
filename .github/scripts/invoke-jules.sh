#!/usr/bin/env bash
# invoke-jules.sh
#
# Creates a Jules session, polls until Jules opens a PR, then writes
# pr_url and pr_number to GITHUB_OUTPUT.
#
# Required env vars:
#   JULES_API_KEY       — Jules API key
#   JULES_PROMPT        — The prompt to send to Jules
#   STARTING_BRANCH     — Branch Jules starts from (becomes the PR base)
#   GITHUB_REPOSITORY   — owner/repo (set automatically by GitHub Actions)
#   GITHUB_OUTPUT       — Path to output file (set automatically by GitHub Actions)
#
# Optional env vars:
#   POLL_INTERVAL       — Seconds between polls (default: 30)
#   POLL_MAX_ATTEMPTS   — Max poll attempts (default: 60 = 30 min)

set -euo pipefail

POLL_INTERVAL="${POLL_INTERVAL:-30}"
POLL_MAX_ATTEMPTS="${POLL_MAX_ATTEMPTS:-120}"

# ── Create session ─────────────────────────────────────────────────────────────

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

CREATE_RESPONSE=$(cat /tmp/jules-response.json)
SESSION_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')

if [ -z "$SESSION_ID" ] || [ "$SESSION_ID" = "null" ]; then
  echo "❌ Session created but no ID in response:"
  echo "$CREATE_RESPONSE" | jq .
  exit 1
fi

echo "✅ Session created: ${SESSION_ID}"

# ── Poll for PR ────────────────────────────────────────────────────────────────

echo "⏳ Polling every ${POLL_INTERVAL}s (max $(( POLL_MAX_ATTEMPTS * POLL_INTERVAL / 60 )) min)..."

PR_URL=""

for i in $(seq 1 "$POLL_MAX_ATTEMPTS"); do
  sleep "$POLL_INTERVAL"

  STATUS=$(curl -sf \
    "https://jules.googleapis.com/v1alpha/sessions/${SESSION_ID}" \
    -H "X-Goog-Api-Key: ${JULES_API_KEY}" 2>/dev/null || echo '{}')

  PR_URL=$(echo "$STATUS" \
    | jq -r '(.outputs // []) | .[] | select(.pullRequest != null) | .pullRequest.url' \
    2>/dev/null | head -1 || true)

  # Check for terminal failure states
  SESSION_STATE=$(echo "$STATUS" | jq -r '.state // ""' 2>/dev/null || true)
  if [[ "$SESSION_STATE" == *"FAIL"* ]] || [[ "$SESSION_STATE" == *"ERROR"* ]] || [[ "$SESSION_STATE" == *"CANCELLED"* ]]; then
    echo "❌ Jules session ended with state: ${SESSION_STATE}"
    echo "$STATUS" | jq '{state, outputs}' 2>/dev/null || true
    exit 1
  fi

  ELAPSED=$(( i * POLL_INTERVAL ))
  echo "[${ELAPSED}s] state=${SESSION_STATE:-unknown} ${PR_URL:+PR: $PR_URL}"

  [ -n "$PR_URL" ] && break
done

if [ -z "$PR_URL" ]; then
  echo "❌ Jules did not create a PR within $(( POLL_MAX_ATTEMPTS * POLL_INTERVAL / 60 )) minutes"
  exit 1
fi

# ── Write outputs ──────────────────────────────────────────────────────────────

PR_NUMBER=$(echo "$PR_URL" | grep -oE '[0-9]+$')

echo "📌 PR: ${PR_URL} (#${PR_NUMBER})"
echo "pr_url=${PR_URL}"       >> "$GITHUB_OUTPUT"
echo "pr_number=${PR_NUMBER}" >> "$GITHUB_OUTPUT"
