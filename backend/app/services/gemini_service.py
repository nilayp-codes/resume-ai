import logging
import time
from typing import List
from fastapi.concurrency import run_in_threadpool
from google import genai
from app.config import settings

logger = logging.getLogger(__name__)

_rate_limits = {}
MAX_CALLS_PER_SESSION = 10

class GeminiServiceError(Exception):
    def __init__(self, message, status_code=500, details=""):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)

class RateLimitExceededError(Exception):
    pass

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            self.client = None
            logger.error("GEMINI_API_KEY missing")
        else:
            self.client = genai.Client(api_key=self.api_key)
            logger.info("Gemini client initialized successfully")

    def _check_rate_limit(self, user_id: str):
        count = _rate_limits.get(user_id, 0)
        if count >= MAX_CALLS_PER_SESSION:
            raise RateLimitExceededError("Rate limit exceeded.")
        _rate_limits[user_id] = count + 1

    async def _generate_content(self, prompt: str, user_id: str) -> str:
        if not self.client:
            raise GeminiServiceError("Gemini API key not configured", 400)

        self._check_rate_limit(user_id)

        start_time = time.time()

        try:
            response = await run_in_threadpool(
                self.client.models.generate_content,
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "temperature": 0.7,
                    "max_output_tokens": 800
                }
            )

            elapsed = time.time() - start_time
            logger.info(f"Gemini response received in {elapsed:.2f}s")

            if response and hasattr(response, "text") and response.text:
                return response.text.strip()

            raise GeminiServiceError("Empty response from Gemini", 500)

        except GeminiServiceError:
            raise
        except Exception as e:
            elapsed = time.time() - start_time
            logger.error(f"Gemini error after {elapsed:.2f}s: {str(e)}", exc_info=True)
            raise GeminiServiceError("AI service failed", 500, str(e))

    async def improve_text(self, text: str, context: str, user_id: str) -> str:
        prompt = f"""
You are an ATS-optimized resume expert.
Improve the following resume text to be more impactful and professional.
Return ONLY the improved text.

Context: {context}
Text:
{text}
"""
        return await self._generate_content(prompt, user_id)

    async def generate_bullets(self, company: str, job_title: str, skills: str, user_id: str) -> List[str]:
        prompt = f"""
Generate exactly 4 strong professional resume bullets.
Company: {company}
Role: {job_title}
Skills: {skills}
"""
        text = await self._generate_content(prompt, user_id)
        return [b.strip() for b in text.split("\n") if b.strip()][:4]

    async def generate_summary(self, full_name: str, job_title: str, skills: str, experience_years: str, user_id: str) -> str:
        prompt = f"""
You are an expert ATS resume writer.

Write a cohesive, professional resume summary in EXACTLY 4 sentences.

STRICT RULES:
- Output a single, cohesive paragraph.
- Produce EXACTLY 4 sentences.
- Each sentence must be 15–25 words.
- Do NOT exceed 110 total words.
- Do NOT use bullet points or lists.
- Do NOT force newline characters between sentences.
- Include measurable impact where possible.
- Avoid generic adjectives (hardworking, passionate, etc.).
- No extra commentary. Returns ONLY the paragraph.

CANDIDATE DETAILS:
Name: {full_name}
Target Role: {job_title}
Key Skills: {skills}
Experience: {experience_years}
"""
        return await self._generate_content(prompt, user_id)

gemini_service = GeminiService()
