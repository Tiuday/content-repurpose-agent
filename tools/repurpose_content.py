import asyncio
import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

_client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

TASK_PROMPTS: dict[str, str] = {
    "linkedin": (
        "You are a LinkedIn content expert. Repurpose the following content into a compelling "
        "LinkedIn post. Use line breaks for readability, include 3-5 relevant hashtags at the end, "
        "and aim for ~200 words. Only output the post itself.\n\nContent:\n{content}"
    ),
    "twitter": (
        "You are a viral Twitter/X content expert. Repurpose the following content into a 5-tweet "
        "thread. Number each tweet (1/, 2/, etc.), keep each under 280 characters, make the first "
        "tweet a hook. Only output the thread.\n\nContent:\n{content}"
    ),
    "email": (
        "You are an email marketing expert. Repurpose the following content into an email newsletter "
        "snippet: a punchy subject line, a 2-sentence preview text, and a 150-word body with a "
        "call-to-action. Format clearly with labels. Only output the email snippet.\n\nContent:\n{content}"
    ),
    "video": (
        "You are a short-form video scriptwriter. Repurpose the following content into a 60-second "
        "video script. Include [HOOK], [MAIN POINTS], and [CTA] sections. Use spoken, conversational "
        "language. Only output the script.\n\nContent:\n{content}"
    ),
    "seo": (
        "You are an SEO specialist. From the following content, generate: 1) An SEO-optimized page "
        "title (under 60 chars), 2) A meta description (under 155 chars), 3) 5 target keywords. "
        "Format with clear labels. Only output these three items.\n\nContent:\n{content}"
    ),
}


async def _run_task(task_id: str, content: str) -> tuple[str, str]:
    prompt = TASK_PROMPTS[task_id].format(content=content)
    for attempt in range(2):
        try:
            message = await _client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}],
            )
            text = "".join(
                block.text for block in message.content if hasattr(block, "text")
            )
            return task_id, text or "No output generated."
        except anthropic.RateLimitError:
            if attempt == 0:
                await asyncio.sleep(2)
            else:
                return task_id, "Error: rate limit reached. Try again in a moment."
        except Exception as e:
            return task_id, f"Error: {str(e)}"
    return task_id, "Error: unexpected failure."


async def repurpose(content: str) -> dict[str, str]:
    if len(content.strip()) < 50:
        raise ValueError("Content too short. Minimum 50 characters required.")
    results = await asyncio.gather(*[_run_task(tid, content) for tid in TASK_PROMPTS])
    return dict(results)
