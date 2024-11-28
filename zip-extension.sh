#!/bin/bash

# Set the source directory where your extension files are located
SOURCE_DIR="/home/astrapi69/dev/git/hub/bookmark-folder-finder/"

# Set the destination directory where you want to copy the extension files
DEST_DIR="./extension_package"

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# List of extension files and directories to include
FILES_TO_INCLUDE=(
  "manifest.json"
  "background.js"
  "popup.html"
  "popup.js"
  "icon.png"
  "icon_16x16.png"
  "icon_48x48.png"
  "icon_128x128.png"
)

# Copy each file from the source to the destination directory
for file in "${FILES_TO_INCLUDE[@]}"; do
  if [ -e "$SOURCE_DIR/$file" ]; then
    cp "$SOURCE_DIR/$file" "$DEST_DIR/"
    echo "Copied $file"
  else
    echo "Warning: $file does not exist in $SOURCE_DIR"
  fi
done

# Optionally, create a ZIP file of the extension
read -p "Do you want to create a ZIP file of the extension? (y/n): " create_zip

if [[ "$create_zip" =~ ^[Yy]$ ]]; then
  ZIP_FILE="bookmark-folder-finder.zip"
  zip -r "$ZIP_FILE" "$DEST_DIR"
  echo "Created ZIP file: $ZIP_FILE"
fi

echo "Extension files have been extracted to $DEST_DIR"
