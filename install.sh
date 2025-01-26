#!/bin/bash
set -e

URL="https://github.com/Cart1416/Classic-Deck/releases/latest/download/classicdeck.zip"
FILENAME="install.zip"
DEST_DIR="$HOME/Documents/Classic-Deck"

echo "Downloading $FILENAME from $URL..."
wget -q "$URL" -O "$FILENAME"

echo "Creating destination directory at $DEST_DIR..."
mkdir -p "$DEST_DIR"

echo "Extracting $FILENAME to $DEST_DIR..."
unzip -o "$FILENAME" -d "$DEST_DIR"

rm -f "$FILENAME"

chmod +x $DEST_DIR/Classic_Deck
$DEST_DIR/Classic_Deck --install

echo "Installed to $DEST_DIR. Please go back to gaming mode."
