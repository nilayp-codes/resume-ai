import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.auth import get_current_user
from app import models, schemas
from app.services.gemini_service import gemini_service, GeminiServiceError, RateLimitExceededError

router = APIRouter(prefix="/ai", tags=["AI Enhancement"])
logger = logging.getLogger(__name__)

@router.post("/improve-field", response_model=schemas.BulletImproveResponse)
async def improve_field(
    request: schemas.BulletImproveRequest,
    current_user: models.User = Depends(get_current_user),
):
    try:
        print("\n--- AI ROUTE CALLED: /improve-field ---")
        print("User authenticated:", current_user.email)
        print("Incoming payload:", request)

        context = f"Job Title: {request.job_title}" if request.job_title else "Resume general text"
        if request.industry:
            context += f", Industry: {request.industry}"
            
        improved_text = await gemini_service.improve_text(
            text=request.bullet_text,
            context=context,
            user_id=current_user.id
        )
        return schemas.BulletImproveResponse(
            success=True,
            suggestion=improved_text
        )
    except RateLimitExceededError as e:
        print("Gemini exception: Rate Limit 429")
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded", "details": str(e)})
    except GeminiServiceError as e:
        print(f"Gemini exception: {e.message}")
        content = {"error": e.message}
        if e.details:
            content["details"] = e.details
        return JSONResponse(status_code=e.status_code, content=content)
    except Exception as e:
        print("Gemini exception:", str(e))
        return JSONResponse(status_code=500, content={"error": "AI service failed", "details": str(e)})


@router.post("/generate-bullets", response_model=schemas.GenerateBulletsResponse)
async def generate_bullets(
    request: schemas.GenerateBulletsRequest,
    current_user: models.User = Depends(get_current_user),
):
    try:
        print("\n--- AI ROUTE CALLED: /generate-bullets ---")
        print("User authenticated:", current_user.email)
        print("Incoming payload:", request)

        bullets = await gemini_service.generate_bullets(
            company=request.company,
            job_title=request.job_title,
            skills=request.skills or "General professional skills",
            user_id=current_user.id
        )
        return schemas.GenerateBulletsResponse(
            success=True,
            bullets=bullets
        )
    except RateLimitExceededError as e:
        print("Gemini exception: Rate Limit 429")
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded", "details": str(e)})
    except GeminiServiceError as e:
        print(f"Gemini exception: {e.message}")
        content = {"error": e.message}
        if e.details:
            content["details"] = e.details
        return JSONResponse(status_code=e.status_code, content=content)
    except Exception as e:
        print("Gemini exception:", str(e))
        return JSONResponse(status_code=500, content={"error": "AI service failed", "details": str(e)})


@router.post("/generate-summary", response_model=schemas.GenerateSummaryResponse)
async def generate_summary(
    request: schemas.GenerateSummaryRequest,
    current_user: models.User = Depends(get_current_user),
):
    try:
        print("\n--- AI ROUTE CALLED: /generate-summary ---")
        print("User authenticated:", current_user.email)
        print("Incoming payload:", request)

        summary = await gemini_service.generate_summary(
            full_name=request.full_name,
            job_title=request.job_title,
            skills=request.skills or "",
            experience_years=request.experience_years or "Several years",
            user_id=current_user.id
        )
        return schemas.GenerateSummaryResponse(
            success=True,
            summary=summary
        )
    except RateLimitExceededError as e:
        print("Gemini exception: Rate Limit 429")
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded", "details": str(e)})
    except GeminiServiceError as e:
        print(f"Gemini exception: {e.message}")
        content = {"error": e.message}
        if e.details:
            content["details"] = e.details
        return JSONResponse(status_code=e.status_code, content=content)
    except Exception as e:
        print("Gemini exception:", str(e))
        return JSONResponse(status_code=500, content={"error": "AI service failed", "details": str(e)})
