# Content Repurposing Workflow

## Objective
Transform long-form content (blog posts, articles, transcripts) into 5 platform-ready assets in a single run.

## Inputs
- `content` (string): Source text. Minimum 50 characters.

## Tasks
Each task runs in parallel. All use the same source content.

| Task ID   | Output                                                                 |
|-----------|------------------------------------------------------------------------|
| linkedin  | LinkedIn post, ~200 words, professional tone, 3–5 hashtags at end     |
| twitter   | 5-tweet thread, each tweet under 280 chars, first tweet is a hook     |
| email     | Subject line + 2-sentence preview + 150-word body with CTA            |
| video     | 60-second script with [HOOK], [MAIN POINTS], [CTA] sections           |
| seo       | Page title (< 60 chars), meta description (< 155 chars), 5 keywords   |

## Execution
1. Validate input: reject if under 50 characters
2. Dispatch all 5 tasks simultaneously via `asyncio.gather`
3. Model: `claude-haiku-4-5-20251001` — fast, cost-effective for structured outputs
4. Max tokens per task: 1000
5. Return all results as a flat JSON object keyed by task ID

## Expected Output
```json
{
  "linkedin": "...",
  "twitter":  "...",
  "email":    "...",
  "video":    "...",
  "seo":      "..."
}
```

## Edge Cases
- Content under 50 chars → return HTTP 400: "Content too short. Minimum 50 characters required."
- Anthropic API error on a single task → return error string for that task only; do not fail the whole run
- Empty content block in response → return "No output generated." for that task
- Rate limit (429) → retry once after 2 seconds, then return error string
