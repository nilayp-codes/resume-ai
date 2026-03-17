"""
Resume CRUD routes: create, read, update, delete, and version history.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.auth import get_current_user
from app import models, schemas

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/", response_model=schemas.ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_data: schemas.ResumeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new resume for the authenticated user."""
    resume = models.Resume(
        user_id=current_user.id,
        title=resume_data.title,
        template_type=resume_data.template_type,
        color_theme=resume_data.color_theme,
        font_family=resume_data.font_family,
        resume_data=resume_data.resume_data,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/", response_model=List[schemas.ResumeResponse])
def list_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """List all resumes for the authenticated user."""
    return db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).order_by(models.Resume.updated_at.desc()).all()


@router.get("/{resume_id}", response_model=schemas.ResumeResponse)
def get_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get a specific resume by ID."""
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id,
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


@router.put("/{resume_id}", response_model=schemas.ResumeResponse)
def update_resume(
    resume_id: str,
    update_data: schemas.ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update a resume. Optionally saves a version snapshot."""
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id,
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    # Save version snapshot if requested
    if update_data.save_version:
        latest_version = db.query(func.max(models.ResumeVersion.version_number)).filter(
            models.ResumeVersion.resume_id == resume.id
        ).scalar() or 0

        version = models.ResumeVersion(
            resume_id=resume.id,
            version_number=latest_version + 1,
            resume_data=resume.resume_data,
            template_type=resume.template_type,
            color_theme=resume.color_theme,
            note=update_data.version_note,
        )
        db.add(version)

    # Apply updates
    if update_data.title is not None:
        resume.title = update_data.title
    if update_data.template_type is not None:
        resume.template_type = update_data.template_type
    if update_data.color_theme is not None:
        resume.color_theme = update_data.color_theme
    if update_data.font_family is not None:
        resume.font_family = update_data.font_family
    if update_data.resume_data is not None:
        resume.resume_data = update_data.resume_data

    db.commit()
    db.refresh(resume)
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a resume."""
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id,
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    db.delete(resume)
    db.commit()


@router.get("/{resume_id}/versions", response_model=List[schemas.ResumeVersionResponse])
def get_resume_versions(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get version history for a resume."""
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id,
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume.versions
