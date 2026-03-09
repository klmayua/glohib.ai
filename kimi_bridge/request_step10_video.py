#!/usr/bin/env python3
"""
GLOHIB.AI - Step 10: Video Service (Node.js)
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

def build_step10_request():
    """Build the Step 10 Video Service (Node.js) request for Kimi."""
    
    prompt = """
================================================================================
GLOHIB.AI - STEP 10: VIDEO SERVICE (Node.js)
Request for Detailed Atomic YAML Specification
================================================================================

CONTEXT:
You previously provided the complete build plan for Glohib.ai.
Now we are executing Step 10: Video Service Implementation in Node.js.

From your architecture, the Video Service is responsible for:
- Video upload handling (TUS resumable upload protocol)
- Video transcoding (H.264, 720p, audio extraction)
- WebRTC signaling for live video interviews
- Integration with Whisper for transcription
- AI grading integration (speech clarity, content quality, presence metrics)
- Video storage (MinIO/S3)
- Progress tracking and failover mechanisms

YOUR TASK:
Generate a COMPLETE ATOMIC YAML SPECIFICATION for Step 10 that includes:

1. Node.js module structure:
   - package.json with all dependencies
   - src/index.ts (entry point)
   - src/routes/video.ts (video upload/download routes)
   - src/routes/webrtc.ts (WebRTC signaling routes)
   - src/services/transcoder.ts (FFmpeg transcoding)
   - src/services/transcription.ts (Whisper integration)
   - src/services/storage.ts (MinIO/S3 storage)
   - src/services/grading.ts (AI grading integration)
   - src/models/video.ts (video models)

2. Dependencies:
   - Node.js 20
   - Express/Fastify (HTTP server)
   - tus-js-server (TUS protocol)
   - fluent-ffmpeg (video processing)
   - @minio/minio-js (object storage)
   - socket.io (WebRTC signaling)
   - openai (Whisper transcription)

3. API Endpoints:
   - POST /api/v1/video/upload (initialize TUS upload)
   - PATCH /api/v1/video/upload/:id (TUS chunk upload)
   - GET /api/v1/video/upload/:id (TUS upload status)
   - GET /api/v1/video/:id (get video metadata)
   - DELETE /api/v1/video/:id (delete video)
   - POST /api/v1/video/:id/transcode (trigger transcoding)
   - POST /api/v1/video/:id/transcribe (trigger transcription)
   - POST /api/v1/video/:id/grade (trigger AI grading)
   - GET /api/v1/video/:id/progress (get processing progress)
   - POST /api/v1/webrtc/signal (WebRTC signaling)

4. Video processing pipeline:
   - Upload → Validate → Transcode → Transcribe → Grade → Store
   - Progress tracking at each stage
   - Retry/failover mechanisms

OUTPUT FORMAT:
Provide complete YAML specification with:
- step_metadata (id, name, phase, priority, estimate)
- context
- tasks (each with action type: create_file, shell_command, etc.)
- Full file contents for each TypeScript/JavaScript file
- deliverables checklist
- verification_checklist
- execution_commands
- next_step reference

Be atomic and executable. Each task should have clear actions.
================================================================================
"""
    
    return prompt

def main():
    """Send Step 10 request to Kimi API."""
    
    print("=" * 80)
    print("GLOHIB.AI - STEP 10: VIDEO SERVICE (NODE.JS) YAML REQUEST")
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
                        'content': 'You are Kimi K2, providing atomic YAML specifications for Node.js microservices. You output complete, production-ready TypeScript code with Express, TUS, FFmpeg, and WebRTC.'
                    },
                    {
                        'role': 'user',
                        'content': build_step10_request()
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
            filename = f'kimi_step10_video_service_{timestamp}.md'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('# GLOHIB.AI - STEP 10: VIDEO SERVICE (NODE.JS)\n')
                f.write(f'**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                f.write('---\n\n')
                f.write(content)
                f.write('\n\n---\n\n')
                f.write(f'**Token Usage:** {usage}\n')
            
            print('=' * 80)
            print('KIMI K2 STEP 10 RESPONSE')
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
