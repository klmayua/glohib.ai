#!/usr/bin/env python3
"""
GLOHIB.AI - Step 5: Student Service (Go)
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

def build_step5_request():
    """Build the Step 5 Student Service (Go) request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 5: STUDENT SERVICE (Go)
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 5: Student Service Implementation in Go.

From your architecture, the Student Service is responsible for:
- Student profile CRUD operations
- Profile vector generation and storage (512-dim embeddings)
- Skills and experience management
- Education history tracking
- Internship application history
- Profile completeness scoring

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 5 that includes:

1. Go module structure:
   - go.mod with all dependencies
   - cmd/main.go (entry point)
   - internal/handlers/profile.go (CRUD operations)
   - internal/handlers/vector.go (profile vector generation)
   - internal/handlers/applications.go (internship applications)
   - internal/models/student.go (student struct)
   - internal/models/profile.go (profile vector struct)
   - pkg/proto/student.proto (gRPC definitions)

2. Dependencies:
   - Go 1.22
   - gin-gonic/gin (HTTP server)
   - google.golang.org/grpc (gRPC server)
   - pgx (PostgreSQL driver with pgvector)
   - redis/go-redis (caching)
   - sentence-transformers via Python bridge or HTTP for embeddings

3. API Endpoints:
   - GET /api/v1/students/{id}
   - PUT /api/v1/students/{id}
   - DELETE /api/v1/students/{id}
   - POST /api/v1/students/{id}/skills
   - DELETE /api/v1/students/{id}/skills/{skillId}
   - POST /api/v1/students/{id}/education
   - DELETE /api/v1/students/{id}/education/{eduId}
   - POST /api/v1/students/{id}/experience
   - DELETE /api/v1/students/{id}/experience/{expId}
   - GET /api/v1/students/{id}/applications
   - POST /api/v1/students/{id}/applications
   - GET /api/v1/students/{id}/profile-score
   - POST /api/v1/students/{id}/vector/generate

4. Database integration:
   - students table queries
   - profile_vectors storage (pgvector 512-dim)
   - skills, education, experience tables
   - applications table

5. gRPC service definition:
   - StudentService with methods for GetStudent, UpdateProfile, GenerateVector

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
Include proper error handling, logging, and input validation.
================================================================================
"""
    
    return prompt

def main():
    """Send Step 5 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 5: STUDENT SERVICE (GO) YAML REQUEST")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for Go microservices. You output complete, production-ready Go code with proper error handling, logging, and input validation.'
                    },
                    {
                        'role': 'user',
                        'content': build_step5_request()
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
            
            # Save to file
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'kimi_step5_student_service_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 5: STUDENT SERVICE (GO)\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 5 RESPONSE')
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
