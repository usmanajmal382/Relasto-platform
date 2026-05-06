#!/bin/bash
echo "Building the project..."
python3.12 -m pip install -r requirements.txt
echo "Running Migrations..."
python3.12 manage.py migrate --noinput
echo "Collecting Static Files..."
python3.12 manage.py collectstatic --noinput --clear
