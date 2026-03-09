from typing import Dict
import pandas as pd
import numpy as np

FEATURE_COLS = [
    "skill_overlap",
    "education_match",
    "exp_months",
    "industry_match",
    "culture_dot",
    "skill_missing",
    "seniority_delta",
]

def build_feature_row(student, internship) -> Dict[str, float]:
    s_skills = set(student.skills)
    i_skills = set(internship.required_skills)
    overlap = len(s_skills & i_skills)
    missing = len(i_skills - s_skills)
    total = len(i_skills)
    skill_overlap = overlap / max(total, 1)
    skill_missing = missing / max(total, 1)

    education_map = {"bachelor": 1, "master": 2, "phd": 3}
    seniority_map = {"intern": 0, "junior": 1, "mid": 2, "senior": 3}
    education_match = 1 if student.education_level == internship.seniority else 0
    seniority_delta = (
        seniority_map.get(internship.seniority, 0)
        - education_map.get(student.education_level, 0)
    )

    industry_match = 1 if internship.industry in student.industries else 0

    def dot(a, b):
        keys = set(a.keys()) & set(b.keys())
        return sum(a[k] * b[k] for k in keys)

    culture_dot = dot(student.culture_scores, internship.culture_scores)

    return {
        "skill_overlap": skill_overlap,
        "education_match": education_match,
        "exp_months": student.experience_months,
        "industry_match": industry_match,
        "culture_dot": culture_dot,
        "skill_missing": skill_missing,
        "seniority_delta": seniority_delta,
    }
