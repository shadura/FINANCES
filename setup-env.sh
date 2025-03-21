#!/bin/bash

# Check if .env file exists
if [ -f .env ]; then
  echo ".env file already exists. Do you want to overwrite it? (y/n)"
  read answer
  if [ "$answer" != "y" ]; then
    echo "Aborted. Your .env file was not modified."
    exit 0
  fi
fi

# Copy .env.example to .env
cp .env.example .env
echo ".env file has been created from .env.example"
echo "Please edit .env file with your actual Supabase credentials"
echo ""
echo "You can get your Supabase credentials from your Supabase project dashboard:"
echo "1. Go to https://app.supabase.com/"
echo "2. Select your project"
echo "3. Go to Project Settings > API"
echo "4. Copy the URL and anon/public key to your .env file"
