#!/bin/bash
set -e

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Generating product embeddings..."
python manage.py generate_embeddings

echo "==> Starting Gunicorn..."
exec gunicorn mango.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --timeout 120 \
    --log-level info
