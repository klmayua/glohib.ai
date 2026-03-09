#!/usr/bin/env python3
"""
GLOHIB.AI - Step 11: Mentor Service (Go)
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

def build_step11_request():
    """Build the Step 11 Mentor Service (Go) request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 11: MENTOR SERVICE (Go)
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 11: Mentor Service Implementation in Go.

From your architecture, the Mentor Service is responsible for:
- Mentor profile management (CRUD)
- Mentor-mentee matching algorithm (weighted bipartite matching)
- Specialization tags management
- Availability/scheduling management
- Session booking and calendar integration
- Chat/messaging between mentors and mentees
- Rating and review system

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 11 that includes:

1. Go module structure:
   - go.mod with all dependencies
   - cmd/main.go (entry point)
   - internal/handlers/mentor.go (mentor CRUD)
   - internal/handlers/matching.go (matching algorithm)
   - internal/handlers/booking.go (session booking)
   - internal/handlers/chat.go (messaging)
   - internal/models/mentor.go (mentor models)
   - internal/models/matching.go (matching models)
   - internal/services/matching.go (OR-Tools matching)
   - pkg/proto/mentor.proto (gRPC definitions)

2. Dependencies:
   - Go 1.22
   - gin-gonic/gin (HTTP server)
   - google.golang.org/grpc (gRPC server)
   - pgx (PostgreSQL driver)
   - redis/go-redis (caching)
   - gonum/optimize or Google OR-Tools (matching algorithm)

3. API Endpoints:
   - GET /api/v1/mentors (list mentors)
   - GET /api/v1/mentors/{id} (get mentor profile)
   - POST /api/v1/mentors (create mentor - for passed candidates)
   - PUT /api/v1/mentors/{id} (update mentor profile)
   - GET /api/v1/mentors/{id}/availability (get availability)
   - PUT /api/v1/mentors/{id}/availability (set availability)
   - POST /api/v1/mentors/{id}/book (book a session)
   - GET /api/v1/mentors/{id}/sessions (get mentor sessions)
   - POST /api/v1/mentors/{id}/rating (submit rating)
   - POST /api/v1/matching/find (find matching mentors for student)

4. Matching algorithm:
   - Weighted scoring: domain (0.4), timezone (0.3), language (0.2), rating (0.1)
   - Google OR-Tools or stable marriage algorithm
   - Real-time matching on booking request

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
    """Send Step 11 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 11: MENTOR SERVICE (GO) YAML REQUEST")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for Go microservices. You output complete, production-ready Go code with matching algorithms.'
                    },
                    {
                        'role': 'user',
                        'content': build_step11_request()
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
            filename = f'kimi_step11_mentor_service_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 11: MENTOR SERVICE (GO)\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 11 RESPONSE')
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
