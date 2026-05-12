#!/bin/bash
set -e

# Start Ollama server in background
ollama serve &
SERVE_PID=$!

# Wait for the server to be ready
echo "==> Waiting for Ollama server to start..."
until curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
    sleep 2
done
echo "==> Ollama server is ready."

# Pull the model if not already cached
if ! ollama list 2>/dev/null | grep -q "mistral:7b-instruct"; then
    echo "==> Pulling mistral:7b-instruct (~4GB, please wait)..."
    ollama pull mistral:7b-instruct
    echo "==> Model ready."
else
    echo "==> Model already cached, skipping pull."
fi

# Keep the foreground process alive
wait $SERVE_PID
