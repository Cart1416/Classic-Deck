#!/bin/bash
set -e

URL="https://github.com/Cart1416/Classic-Deck/releases/latest/download/classicdeck.zip"
FILENAME="update.zip"

echo "Downloading $FILENAME from $URL..."
wget -q "$URL" -O "$FILENAME"

echo "Extracting $FILENAME..."
unzip -o "$FILENAME"

rm -f "$FILENAME"

echo "Update completed."
