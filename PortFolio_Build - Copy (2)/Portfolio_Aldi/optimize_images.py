import os
import shutil
import json
import re
from PIL import Image

# Configuration
PROJECT_ROOT = r"c:\Users\Studi\Downloads\PortFolio_Build - Copy (2)\Portfolio_Aldi"
ASSETS_DIR = os.path.join(PROJECT_ROOT, "public", "assets")
BACKUP_DIR = os.path.join(PROJECT_ROOT, "public", "assets_backup")
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")
SRC_DIR = os.path.join(PROJECT_ROOT, "src")

# targeted extensions
IMG_EXTENSIONS = {".png", ".jpg", ".jpeg"}

def ensure_backup_dir():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)

def get_files(directory, extensions=None):
    file_list = []
    for root, dirs, files in os.walk(directory):
        # Skip backup dir
        if "assets_backup" in root:
            continue
            
        for file in files:
            if extensions:
                ext = os.path.splitext(file)[1].lower()
                if ext in extensions:
                    file_list.append(os.path.join(root, file))
            else:
                file_list.append(os.path.join(root, file))
    return file_list

def optimize_image(file_path):
    try:
        # Create backup path
        rel_path = os.path.relpath(file_path, ASSETS_DIR)
        backup_path = os.path.join(BACKUP_DIR, rel_path)
        
        # Ensure backup dir exists
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)
        
        # Copy to backup if not exists
        if not os.path.exists(backup_path):
            shutil.copy2(file_path, backup_path)
            
        # Open image
        with Image.open(file_path) as img:
            # Resize if too large
            max_size = 2560
            width, height = img.size
            
            if width > max_size or height > max_size:
                ratio = min(max_size / width, max_size / height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                print(f"Resized {rel_path}: {width}x{height} -> {new_width}x{new_height}")

            # Save as WebP
            new_file_path = os.path.splitext(file_path)[0] + ".webp"
            img.save(new_file_path, "WEBP", quality=85)
            
        # Remove original
        os.remove(file_path)
        return True, os.path.basename(file_path), os.path.basename(new_file_path)

    except Exception as e:
        print(f"Error optimizing {file_path}: {e}")
        return False, None, None

def update_references(old_name, new_name):
    replacement_count = 0
    
    # Files to scan for references
    # 1. JSON Data files
    data_files = get_files(DATA_DIR, {".json"})
    src_data_files = get_files(os.path.join(SRC_DIR, "data"), {".json"}) if os.path.exists(os.path.join(SRC_DIR, "data")) else []
    
    # 2. Source code files
    code_files = get_files(SRC_DIR, {".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".json"}) # Include json in src if any

    all_files = data_files + src_data_files + code_files
    
    for file_path in all_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Simple string replacement
            # Note: We replace exact filename to avoid partial matches on similar names
            # But we must be careful. old_name is like "image.png"
            # It's unique enough usually.
            
            if old_name in content:
                new_content = content.replace(old_name, new_name)
                
                # Write back only if changed
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                replacement_count += 1
                
        except Exception as e:
            print(f"Error updating references in {file_path}: {e}")
            
    return replacement_count

def main():
    print("Starting Optimization...")
    ensure_backup_dir()
    
    # Get all image files in assets
    images = get_files(ASSETS_DIR, IMG_EXTENSIONS)
    print(f"Found {len(images)} images to process.")
    
    processed_count = 0
    errors = 0
    
    for img_path in images:
        success, old_name, new_name = optimize_image(img_path)
        if success:
            refs = update_references(old_name, new_name)
            print(f"Processed: {old_name} -> {new_name} (Refs updated: {refs})")
            processed_count += 1
        else:
            errors += 1
            
    print("\n" + "="*50)
    print("OPTIMIZATION COMPLETE")
    print(f"Processed: {processed_count}")
    print(f"Errors: {errors}")
    print(f"Backups stored in: {BACKUP_DIR}")

if __name__ == "__main__":
    main()
