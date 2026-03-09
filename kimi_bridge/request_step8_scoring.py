#!/usr/bin/env python3
"""
GLOHIB.AI - Step 8: Scoring Service (Python)
Request detailed YAML specification from Kimi K2
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

def build_step8_request():
    """Build the Step 8 Scoring Service (Python) request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 8: SCORING SERVICE (Python)
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 8: Scoring Service Implementation in Python.

From your architecture, the Scoring Service is responsible for:
- Application scoring engine (XGBoost model)
- Feature extraction from student profiles and internship data
- SHAP explanations for scoring transparency
- Model registry and versioning
- Real-time inference (<150ms p99 latency)
- Batch scoring for historical applications

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 8 that includes:

1. Python module structure:
   - requirements.txt with all dependencies
   - app/main.py (FastAPI entry point)
   - app/services/scorer.py (XGBoost scoring)
   - app/services/features.py (feature extraction)
   - app/services/explainer.py (SHAP explanations)
   - app/services/model_registry.py (model versioning)
   - app/models/score.py (score models)
   - app/models/features.py (feature models)

2. Dependencies:
   - Python 3.11
   - FastAPI (HTTP server)
   - xgboost (ML model)
   - shap (explainability)
   - scikit-learn (preprocessing)
   - pandas/numpy (data handling)
   - joblib (model persistence)
   - redis (feature caching)
   - pgvector (PostgreSQL vector operations)

3. API Endpoints:
   - POST /api/v1/score/application (score single application)
   - POST /api/v1/score/batch (batch score applications)
   - GET /api/v1/score/{application_id}/explain (get SHAP explanation)
   - POST /api/v1/model/train (trigger model training)
   - GET /api/v1/model/version (get current model version)
   - POST /api/v1/features/extract (extract features for scoring)

4. Feature extraction:
   - Student features (skills match, education level, experience)
   - Internship features (requirements, seniority, industry)
   - Interaction features (skill overlap, culture fit indicators)

5. Scoring model:
   - XGBoost classifier (pass/fail) + regressor (score 0-100)
   - Feature importance tracking
   - SHAP value computation for explanations

OUTPUT FORMAT:
Provide complete YAML specification with:
- step_metadata (id, name, phase, priority, estimate)
- context
- tasks (each with action type: create_file, shell_command, etc.)
- Full file contents for each Python file
- deliverables checklist
- verification_checklist
- execution_commands
- next_step reference

Be atomic and executable. Each task should have clear actions.
================================================================================
"""
    
    return prompt

def main():
    """Send Step 8 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 8: SCORING SERVICE (PYTHON) YAML REQUEST")
    print("=" * 80)
    print("")
    print("Requesting detailed YAML specification from Kimi K2...")
    print("This may take 30-60 seconds...")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for Python ML microservices. You output complete, production-ready Python code with FastAPI, XGBoost, and SHAP.'
                    },
                    {
                        'role': 'user',
                        'content': build_step8_request()
                    }
                ],
                'max_tokens': 8192,
                'temperature': 0.7,
                'stream': False
            },
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            usage = result.get('usage', {})
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'kimi_step8_scoring_service_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 8: SCORING SERVICE (PYTHON)\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 8 RESPONSE')
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
