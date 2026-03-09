#!/usr/bin/env python3
"""
GLOHIB.AI - Step 2: Database Schema Setup
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

def build_step2_request():
    """Build the Step 2 database schema request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 2: DATABASE SCHEMA SETUP
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 2: Database Schema Setup.

From your architecture, the database schema includes:

STAKEHOLDER TABLES:
1. students - id, email, password_hash, profile_vector (512), created_at
2. employers - id, name, tier (enum), api_key, verified_domains
3. mentors - id, student_id (fkey), expertise_tags (array), timezone, rating
4. institutions - id, type (enum), name, verified_domains

CORE TABLES:
5. internships - id, employer_id (fkey), metadata (jsonb), vector (512), active, expires_at
6. assessments - id, student_id (fkey), stage (int), answers (jsonb), scores (jsonb), pass, ai_explain, created_at
7. video_submissions - id, assessment_id (fkey), object_path, transcription, ai_grade (jsonb), duration_sec

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 2 that includes:

1. Full PostgreSQL schema with:
   - All column definitions with exact data types
   - Primary keys, foreign keys, indexes
   - pgvector extension setup
   - Enums (tier, institution_type, assessment_stage)
   - Constraints (unique, not null, check)
   - Partitioning for assessments table (by month)

2. Migration scripts:
   - 001_create_extensions.sql
   - 002_create_enums.sql
   - 003_create_tables.sql
   - 004_create_indexes.sql
   - 005_create_triggers.sql

3. Seed data:
   - Sample employers (WHO, UNICEF, MSF, PATH, GAVI)
   - Sample institutions
   - Sample internship categories

4. Verification queries to test schema

OUTPUT FORMAT:
Provide complete YAML specification with:
- step_metadata (id, name, phase, priority, estimate)
- context
- tasks (each with action type: create_file, shell_command, etc.)
- Full file contents for each SQL file
- deliverables checklist
- verification_checklist
- execution_commands
- next_step reference

Be atomic and executable. Each task should have clear actions.
================================================================================
"""
    
    return prompt

def main():
    """Send Step 2 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 2: DATABASE SCHEMA YAML REQUEST")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for database schema setup. You output complete, executable SQL files with exact column types, constraints, indexes, and migrations. You follow PostgreSQL best practices and include pgvector setup.'
                    },
                    {
                        'role': 'user',
                        'content': build_step2_request()
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
            filename = f'kimi_step2_database_schema_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 2: DATABASE SCHEMA\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 2 RESPONSE')
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
