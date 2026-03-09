#!/usr/bin/env python3
"""
GLOHIB.AI - Kimi Build Plan Request
Send comprehensive context bundle and build request to Kimi K2
"""

import os
import sys
import requests
from datetime import datetime

# Fix Windows console encoding
if sys.platform == 'win32':
    os.system('chcp 65001 >nul')
    sys.stdout.reconfigure(encoding='utf-8')

# Configuration (from Uradi pattern)
KIMI_API_KEY = 'sk-rotZ1Ca3tR2hlQESgGCJkpP0N9qB0Nll16iHFMKQNrjq3S81'
KIMI_BASE_URL = 'https://api.moonshot.ai/v1'
KIMI_MODEL = 'kimi-k2-turbo-preview'

def build_kimi_prompt():
    """Build the complete Kimi build request prompt."""
    
    prompt = """
================================================================================
GLOHIB.AI - COMPLETE SYSTEM BUILD REQUEST
================================================================================

ROLE: You are Kimi K2, the chief architect for the Glohib.ai platform.

CONTEXT:
Qwen has performed forensic extraction of the pitch deck without any planning,
design, or assumptions. All intelligence has been structured and provided below.

YOUR TASK: Generate a COMPLETE SYSTEM BUILD PLAN for Glohib.ai.

================================================================================
EXTRACTED INTELLIGENCE SUMMARY
================================================================================

PROJECT: Glohib.ai - AI-first Global Health Internship Intelligence Platform

MISSION: "Where global health talent meets opportunity"

PROBLEM SPACE:
- 75% of CVs rejected before reaching human reviewers
- Lack of verified global health internships
- No centralized platform for AI matching + mentorship
- Hiring cycles in health fields exceed 44 days
- Students lack actionable career guidance

USER SEGMENTS:
1. Students: Undergraduate to mid-career global health professionals
2. Employers: WHO, UNICEF, MSF, PATH, GAVI, universities, agencies
3. Mentors: Industry experts, senior professionals
4. Institutions: Universities, professional associations, governments

WORKFLOW STAGES (7):
1. Internship Feed - AI-personalized opportunity discovery
2. Application Scoring - AI classifies candidates
3. Psychomotor Tests - Pass only, dynamic timing
4. Situational Analysis - Pass only, NLP evaluation
5. Mentorship or CV Routing - Pass->mentor, Fail->CV help
6. Video Interview - Final stage, AI grading
7. Employer Handoff - Dashboard with full breakdowns

SYSTEM CAPABILITIES:
- Discovery Engine: Profile vectors + internship metadata + behavioral signals
- Scoring Engine: AI classification of candidates
- Screening Pipeline: 4-stage adaptive evaluation
- Mentorship Routing: Weighted scoring algorithm
- Employer Dashboard: Read-only mode with full candidate breakdowns

AI LAYERS:
- Personalization: Profile vectors, behavioral signals
- NLP Evaluation: Speech clarity, content quality
- Dynamic Test Generation: Template-tuned LLM prompts
- Video Assessment: Timed questions, AI grading

REVENUE MODEL:
- Subscriptions, Mentorship, CV Services, Success Fees
- Projection: $1.98M monthly, $23.76M annually

TECHNICAL CONSTRAINTS:
- Latency reduction across all AI stages
- Verification APIs for credentials
- Scalability (10M+ annual health graduates)
- Bias reduction in evaluation
- Multi-region deployment (Africa, Asia CDN)

SHORT-TERM (3-6 months):
- Reduce AI scoring latency
- Improve video infrastructure
- OAuth 2.0 integrations
- Credential verification APIs
- Refactor for microservices

LONG-TERM VISION:
- Mobile app (iOS/Android)
- Gamified behavioral assessments
- Dynamic skill gap mapping
- Institutional dashboards
- Multi-region deployment

RESOURCE NEEDS:
- LLM finetuning credits (OpenAI/Anthropic or open-source)
- Cloud video processing (Mux, Cloudflare Stream)
- Observability stack (Grafana, Datadog, Prometheus+Loki)
- Senior DevOps, AI/ML Engineer, Mobile Developer, QA

DEVELOPMENT METHODOLOGY:
- Agile Scrum, 2-week sprints
- Sprint planning, daily standups, reviews, retrospectives

================================================================================
YOUR DELIVERABLES - COMPLETE SYSTEM BUILD PLAN
================================================================================

Generate comprehensive architecture and design for ALL of the following:

1. FULL PRODUCT ARCHITECTURE
   - Complete system architecture diagram
   - Component breakdown
   - Technology stack recommendations with justification
   - Frontend, backend, AI service boundaries

2. SYSTEM DESIGN
   - Component-level design for all 7 workflow stages
   - Integration points between components
   - Data flow diagrams
   - API design patterns

3. INFRASTRUCTURE DESIGN
   - Cloud provider recommendation
   - Scalability architecture (10M+ users)
   - Multi-region deployment (Africa, Asia optimization)
   - CDN strategy
   - Load balancing approach

4. AI ORCHESTRATION MODEL
   - LLM integration architecture
   - Prompt management system for dynamic test generation
   - AI scoring engine architecture
   - NLP evaluation pipeline
   - Model selection (OpenAI vs Anthropic vs open-source)

5. MVP → SCALE ROADMAP
   - MVP feature definition (minimum viable product)
   - Phase 1 (0-6 months): Strategic Launch
   - Phase 2 (6-18 months): Scale
   - Phase 3: Global Distribution
   - Milestone definitions

6. DATA ARCHITECTURE
   - Database schema for all 4 stakeholder types
   - Profile vectors storage design
   - Internship metadata structure
   - Assessment data storage (text, video, scores)
   - Analytics data layer
   - Data retention policies

7. MICROSERVICES BREAKDOWN
   - Service boundaries
   - API contracts for each service
   - Inter-service communication
   - Event-driven architecture if applicable
   - Service discovery approach

8. MENTOR MATCHING ENGINE LOGIC
   - Algorithm design for weighted scoring
   - Specialization tags data model
   - Availability management
   - Timezone constraint handling
   - Compatibility scoring formula

9. EVALUATION PIPELINE LOGIC
   - 4-stage adaptive workflow design
   - Pass/fail logic with AI metrics
   - Stage adaptation rules
   - Psychomotor test delivery
   - Situational analysis generation
   - Video interview pipeline

10. RECOMMENDATION ENGINE DESIGN
    - Profile vectors generation
    - Internship metadata processing
    - Behavioral signals collection
    - Ranking algorithm
    - Personalization logic
    - Cold start problem solution

11. VIDEO ASSESSMENT ARCHITECTURE
    - Video processing pipeline
    - Compression strategy
    - Progress tracking
    - Failover mechanisms
    - AI grading integration (speech, content, presence)
    - Timed question delivery

12. GOVERNANCE & AUDIT LAYER
    - AI scoring audit dashboard
    - Candidate scoring transparency
    - Audit log infrastructure
    - Compliance considerations
    - Security architecture
    - Bias monitoring

================================================================================
CONSTRAINTS FOR YOUR RESPONSE
================================================================================

1. Base ALL recommendations on the extracted intelligence above
2. Do NOT assume requirements not present in the pitch
3. Provide specific technology recommendations with justification
4. Include cost estimates where applicable
5. Consider the 10M+ annual health graduates market size
6. Address multi-region deployment for Africa/Asia
7. Design for the revenue model ($1.98M/month projection)
8. Support Agile Scrum development methodology

================================================================================
OUTPUT FORMAT
================================================================================

Provide your response in structured YAML format where possible, with:
- Clear section headers
- Bullet points for lists
- Code blocks for technical specifications
- Diagrams in Mermaid or ASCII format
- Tables for comparisons

Be comprehensive. This is the foundation document for the entire Glohib.ai build.

================================================================================
"""
    
    return prompt

def main():
    """Send build request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - KIMI BUILD PLAN REQUEST")
    print("=" * 80)
    print("")
    print("Sending comprehensive context and build request to Kimi K2...")
    print("This may take 60-120 seconds...")
    print("")
    
    try:
        response = requests.post(
            f'{KIMI_BASE_URL}/chat/completions',
            headers={
                'Authorization': f'Bearer {KIMI_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': KIMI_MODEL,
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are Kimi K2, chief architect for complex AI platforms. You provide comprehensive, detailed system architecture and build plans. You base all recommendations on provided requirements without making assumptions. You output structured, actionable specifications.'
                    },
                    {
                        'role': 'user',
                        'content': build_kimi_prompt()
                    }
                ],
                'max_tokens': 8192,
                'temperature': 0.7,
                'stream': False
            },
            timeout=180
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            usage = result.get('usage', {})
            
            # Save to file
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'kimi_build_plan_response_{timestamp}.md'
            filepath = os.path.join(os.path.dirname(__file__), filename)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - KIMI K2 BUILD PLAN RESPONSE\n\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 BUILD PLAN RESPONSE')
            print('=' * 80)
            print('')
            print(content)
            print('')
            print('=' * 80)
            print(f'Full response saved to: {filename}')
            print(f'Token Usage: {usage}')
            print('=' * 80)
            
        else:
            print(f'Error: {response.status_code}')
            print(response.text)
            
    except Exception as e:
        print(f'Exception: {e}')

if __name__ == "__main__":
    main()
