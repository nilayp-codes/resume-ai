"""
Pydantic v2 schemas for request/response validation.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Resume Data Sub-Schemas ─────────────────────────────────────────────────

class BasicInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""
    job_title: str = ""
    photo_url: str = ""


class ExperienceEntry(BaseModel):
    company: str = ""
    position: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""
    bullets: List[str] = []


class SchoolEntry(BaseModel):
    school_name: str = ""
    board: str = ""
    year: str = ""


class CollegeEntry(BaseModel):
    college_name: str = ""
    degree: str = ""
    field_of_study: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""


class UnifiedEducation(BaseModel):
    school10: Optional[SchoolEntry] = None
    school12: Optional[SchoolEntry] = None
    college: Optional[CollegeEntry] = None


class ProjectEntry(BaseModel):
    name: str = ""
    description: str = ""
    tech_stack: str = ""
    url: str = ""
    github: str = ""
    bullets: List[str] = []


class CertificationEntry(BaseModel):
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""


class SkillsData(BaseModel):
    technical: List[str] = []
    soft: List[str] = []
    languages: List[str] = []
    tools: List[str] = []


class ResumeData(BaseModel):
    basic_info: BasicInfo = Field(default_factory=BasicInfo)
    summary: str = ""
    experience: List[ExperienceEntry] = []
    education: UnifiedEducation = Field(default_factory=UnifiedEducation)
    projects: List[ProjectEntry] = []
    skills: SkillsData = Field(default_factory=SkillsData)
    certifications: List[CertificationEntry] = []


# ─── Resume Schemas ───────────────────────────────────────────────────────────

class ResumeCreate(BaseModel):
    title: str = "Untitled Resume"
    template_type: str = "modern"
    color_theme: str = "blue"
    font_family: str = "inter"
    resume_data: Dict[str, Any] = {}


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template_type: Optional[str] = None
    color_theme: Optional[str] = None
    font_family: Optional[str] = None
    resume_data: Optional[Dict[str, Any]] = None
    save_version: Optional[bool] = False
    version_note: Optional[str] = None


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    title: str
    template_type: str
    color_theme: str
    font_family: str
    resume_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResumeVersionResponse(BaseModel):
    id: str
    resume_id: str
    version_number: int
    resume_data: Dict[str, Any]
    template_type: str
    color_theme: str
    saved_at: datetime
    note: Optional[str]

    model_config = {"from_attributes": True}


# ─── PDF Schemas ──────────────────────────────────────────────────────────────

class PDFGenerateRequest(BaseModel):
    resume_id: str


# ─── AI Schemas ───────────────────────────────────────────────────────────────

class BulletImproveRequest(BaseModel):
    bullet_text: str = Field(min_length=3, max_length=2000)
    job_title: Optional[str] = None
    industry: Optional[str] = None


class BulletImproveResponse(BaseModel):
    success: bool
    suggestion: Optional[str] = None
    error: Optional[str] = None


class GenerateBulletsRequest(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    job_title: str = Field(min_length=1, max_length=200)
    skills: Optional[str] = None

class GenerateBulletsResponse(BaseModel):
    success: bool
    bullets: Optional[List[str]] = None
    error: Optional[str] = None


class GenerateSummaryRequest(BaseModel):
    full_name: str
    job_title: str
    skills: Optional[str] = None
    experience_years: Optional[str] = None

class GenerateSummaryResponse(BaseModel):
    success: bool
    summary: Optional[str] = None
    error: Optional[str] = None
