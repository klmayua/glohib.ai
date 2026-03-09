#!/usr/bin/env python3
"""
GLOHIB.AI - Step 4: Identity Service (Go)
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

def build_step4_request():
    """Build the Step 4 Identity Service (Go) request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 4: IDENTITY SERVICE (Go)
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 4: Identity Service Implementation in Go.

From your architecture, the Identity Service is responsible for:
- Authentication (AuthN) - login, logout, session management
- OAuth2 integration (Google, institutional SSO)
- Role management (student, employer, mentor, institution, admin)
- API key management for employers
- JWT token generation and validation

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 4 that includes:

1. Go module structure:
   - go.mod with all dependencies
   - cmd/main.go (entry point)
   - internal/handlers/auth.go (login, logout, register, refresh)
   - internal/handlers/oauth.go (OAuth2 flows)
   - internal/handlers/apikeys.go (API key CRUD)
   - internal/models/user.go (user struct)
   - internal/models/token.go (JWT token struct)
   - pkg/proto/identity.proto (gRPC definitions)

2. Dependencies:
   - Go 1.22
   - gin-gonic/gin (HTTP server)
   - golang-jwt/jwt (JWT handling)
   - golang.org/x/crypto (password hashing)
   - google.golang.org/grpc (gRPC server)
   - pgx (PostgreSQL driver)
   - redis/go-redis (session storage)

3. API Endpoints:
   - POST /api/v1/auth/register
   - POST /api/v1/auth/login
   - POST /api/v1/auth/logout
   - POST /api/v1/auth/refresh
   - GET /api/v1/auth/me
   - POST /api/v1/oauth/google
   - GET /api/v1/oauth/google/callback
   - POST /api/v1/apikeys (create)
   - GET /api/v1/apikeys (list)
   - DELETE /api/v1/apikeys/{id}

4. Database integration:
   - User table queries
   - Session storage in Redis
   - API key storage in PostgreSQL

5. gRPC service definition:
   - IdentityService with methods for ValidateToken, GetUser, GetAPIKey

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
    """Send Step 4 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 4: IDENTITY SERVICE (GO) YAML REQUEST")
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
                        'content': build_step4_request()
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
            filename = f'kimi_step4_identity_service_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 4: IDENTITY SERVICE (GO)\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 4 RESPONSE')
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
