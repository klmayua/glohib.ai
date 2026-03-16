from typing import List, Dict, Any

def calculate_competency_score(student_skills: List[str], assessment_results: Dict[str, Any]) -> float:
    skill_weight = 0.6
    assessment_weight = 0.4
    
    skill_score = len(student_skills) * 10
    if skill_score > 100:
        skill_score = 100
    
    assessment_score = assessment_results.get("score", 0)
    
    return (skill_score * skill_weight) + (assessment_score * assessment_weight)

def calculate_skill_match(student_skills: List[str], required_skills: List[str]) -> float:
    if not required_skills:
        return 100.0
    
    student_set = set(s.lower() for s in student_skills)
    required_set = set(s.lower() for s in required_skills)
    
    matches = student_set.intersection(required_set)
    return (len(matches) / len(required_set)) * 100

def generate_recommendations(student_skills: List[str], required_skills: List[str]) -> List[str]:
    recommendations = []
    student_set = set(s.lower() for s in student_skills)
    
    for skill in required_skills:
        if skill.lower() not in student_set:
            recommendations.append(f"Consider learning {skill}")
    
    return recommendations[:5]
