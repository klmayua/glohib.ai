#!/usr/bin/env python3
"""
GLOHIB.AI - Step 9: Assessment Service (Go)
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

def build_step9_request():
    """Build the Step 9 Assessment Service (Go) request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 9: ASSESSMENT SERVICE (Go)
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 9: Assessment Service Implementation in Go.

From your architecture, the Assessment Service is responsible for:
- Managing the 7-stage assessment workflow (screening → technical → cultural → final)
- State machine for assessment progression
- Pass/fail logic at each stage
- Timer service for timed assessments
- Integration with LLM for dynamic question generation
- Integration with NLP service for answer evaluation
- Psychomotor test delivery
- Situational analysis generation and grading

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 9 that includes:

1. Go module structure:
   - go.mod with all dependencies
   - cmd/main.go (entry point)
   - internal/handlers/assessment.go (workflow management)
   - internal/handlers/stage.go (stage-specific handlers)
   - internal/models/assessment.go (assessment state model)
   - internal/models/stage.go (stage definitions)
   - internal/services/statemachine.go (state machine logic)
   - internal/services/timer.go (timer service)
   - pkg/proto/assessment.proto (gRPC definitions)

2. Dependencies:
   - Go 1.22
   - gin-gonic/gin (HTTP server)
   - google.golang.org/grpc (gRPC server)
   - pgx (PostgreSQL driver)
   - redis/go-redis (state caching, timer locks)
   - robfig/cron (scheduled tasks)

3. API Endpoints:
   - POST /api/v1/assessment/start (begin assessment workflow)
   - GET /api/v1/assessment/{id}/status (get current stage and status)
   - POST /api/v1/assessment/{id}/stage/{stage}/submit (submit stage answers)
   - GET /api/v1/assessment/{id}/stage/{stage}/result (get stage results)
   - POST /api/v1/assessment/{id}/stage/psychomotor/start (start psychomotor test)
   - POST /api/v1/assessment/{id}/stage/psychomotor/submit (submit psychomotor answers)
   - POST /api/v1/assessment/{id}/stage/situational/start (start situational analysis)
   - POST /api/v1/assessment/{id}/stage/situational/submit (submit situational answers)
   - GET /api/v1/assessment/{id}/final-result (get final assessment result)

4. State machine:
   - States: draft, screening, technical, cultural, final, passed, failed
   - Transitions with guard conditions
   - Pass/fail thresholds per stage

5. Timer service:
   - JWT-based timed sessions
   - Server-side countdown with Redis
   - Auto-submit on timeout
   - Blur detection support

OUTPUT FORMAT:
Provide complete YAML specification with:
- step_metadata (id, name, phase, priority, estimate)
- context
- tasks (each with action type: create_file, shell_command, etc.)
- Full file contents for each Go file
- deliverables checklist
- verification_checklist
- execution_commands
- next_step reference

Be atomic and executable. Each task should have clear actions.
================================================================================
"""
    
    return prompt

def main():
    """Send Step 9 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 9: ASSESSMENT SERVICE (GO) YAML REQUEST")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for Go microservices. You output complete, production-ready Go code with state machines and timer services.'
                    },
                    {
                        'role': 'user',
                        'content': build_step9_request()
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
            filename = f'kimi_step9_assessment_service_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 9: ASSESSMENT SERVICE (GO)\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 9 RESPONSE')
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
