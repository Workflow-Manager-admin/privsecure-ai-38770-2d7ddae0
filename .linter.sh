#!/bin/bash
cd /home/kavia/workspace/code-generation/privsecure-ai-38770-2d7ddae0/privsecure_ai_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

