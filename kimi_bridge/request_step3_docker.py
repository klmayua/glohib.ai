#!/usr/bin/env python3
"""
GLOHIB.AI - Step 3: Docker & Local Development Environment
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

def build_step3_request():
    """Build the Step 3 Docker & Local Dev Environment request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 3: DOCKER & LOCAL DEVELOPMENT ENVIRONMENT
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 3: Docker & Local Development Environment.

From your architecture, the local development environment needs:
- PostgreSQL 16 with pgvector extension
- Redis 7 for caching and queues
- MinIO for local S3-compatible object storage
- Multiple service containers (Go services, Python AI services, Node.js video service)
- Network configuration for inter-service communication

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 3 that includes:

1. Root Dockerfile (multi-stage build for the platform)
2. Docker Compose configuration with:
   - PostgreSQL service with pgvector
   - Redis service
   - MinIO service
   - Service placeholders for future microservices
   - Network configuration
   - Volume mounts for development
3. docker-compose.override.yml.example for local customization
4. .env.docker template for Docker environment variables
5. Docker initialization scripts:
   - init_postgres.sql
   - init_minio.sh
   - health_check scripts
6. Makefile or scripts for common Docker operations:
   - docker-up
   - docker-down
   - docker-logs
   - docker-rebuild
   - docker-clean

OUTPUT FORMAT:
Provide complete YAML specification with:
- step_metadata (id, name, phase, priority, estimate)
- context
- tasks (each with action type: create_file, shell_command, etc.)
- Full file contents for each Docker configuration file
- deliverables checklist
- verification_checklist
- execution_commands
- next_step reference

Be atomic and executable. Each task should have clear actions.
Include proper health checks, volume persistence, and network isolation.
================================================================================
"""
    
    return prompt

def main():
    """Send Step 3 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 3: DOCKER & LOCAL DEV ENVIRONMENT YAML REQUEST")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for Docker and local development environment setup. You output complete Dockerfile, docker-compose.yml, and supporting scripts with proper health checks, volumes, and networking.'
                    },
                    {
                        'role': 'user',
                        'content': build_step3_request()
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
            filename = f'kimi_step3_docker_environment_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 3: DOCKER & LOCAL DEV ENVIRONMENT\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 3 RESPONSE')
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
