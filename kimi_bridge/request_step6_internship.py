#!/usr/bin/env python3
"""
GLOHIB.AI - Step 6: Internship Service (Go)
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

def build_step6_request():
    """Build the Step 6 Internship Service (Go) request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 6: INTERNSHIP SERVICE (Go)
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 6: Internship Service Implementation in Go.

From your architecture, the Internship Service is responsible for:
- Internship posting CRUD operations
- Internship vector embeddings for matching (512-dim)
- Employer-internship relationship management
- Internship search and filtering
- Application management (linking students to internships)
- Internship analytics and metrics

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 6 that includes:

1. Go module structure:
   - go.mod with all dependencies
   - cmd/main.go (entry point)
   - internal/handlers/internship.go (CRUD operations)
   - internal/handlers/search.go (search and filtering)
   - internal/handlers/applications.go (application management)
   - internal/models/internship.go (internship struct)
   - internal/models/search.go (search filters, vector search)
   - pkg/proto/internship.proto (gRPC definitions)

2. Dependencies:
   - Go 1.22
   - gin-gonic/gin (HTTP server)
   - google.golang.org/grpc (gRPC server)
   - pgx (PostgreSQL driver with pgvector)
   - redis/go-redis (caching)
   - sentence-transformers via HTTP for embeddings

3. API Endpoints:
   - GET /api/v1/internships
   - GET /api/v1/internships/{id}
   - POST /api/v1/internships (employer only)
   - PUT /api/v1/internships/{id} (employer only)
   - DELETE /api/v1/internships/{id} (employer only)
   - POST /api/v1/internships/search
   - GET /api/v1/internships/recommended/{studentId}
   - POST /api/v1/internships/{id}/applications
   - GET /api/v1/internships/{id}/applications
   - POST /api/v1/internships/{id}/vector/generate

4. Database integration:
   - internships table with pgvector
   - internship_skills, internship_tags tables
   - applications table (linking students to internships)

5. gRPC service definition:
   - InternshipService with methods for CRUD, search, recommendations

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
    """Send Step 6 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 6: INTERNSHIP SERVICE (GO) YAML REQUEST")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for Go microservices. You output complete, production-ready Go code.'
                    },
                    {
                        'role': 'user',
                        'content': build_step6_request()
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
            filename = f'kimi_step6_internship_service_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 6: INTERNSHIP SERVICE (GO)\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 6 RESPONSE')
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
