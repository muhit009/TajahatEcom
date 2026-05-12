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
if ! ollama list 2>/dev/null | grep -q "llama3.1:8b"; then
    echo "==> Pulling llama3.1:8b (~5GB, please wait)..."
    ollama pull llama3.1:8b
    echo "==> Model ready."
else
    echo "==> Model already cached, skipping pull."
fi

# Keep the foreground process alive
wait $SERVE_PID
