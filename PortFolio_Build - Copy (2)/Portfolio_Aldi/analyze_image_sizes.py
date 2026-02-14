import os
import sys

# Configuration
PROJECT_ROOT = r"c:\Users\Studi\Downloads\PortFolio_Build - Copy (2)\Portfolio_Aldi"
ASSETS_DIR = os.path.join(PROJECT_ROOT, "public", "assets")

def analyze_images():
    print(f"Analyzing images in: {ASSETS_DIR}")
    
    image_extensions = {".png", ".jpg", ".jpeg", ".webp"}
    
    total_size = 0
    total_count = 0
    extension_stats = {}
    large_files = []
    
    # Walk through directory
    for root, dirs, files in os.walk(ASSETS_DIR):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in image_extensions:
                file_path = os.path.join(root, file)
                try:
                    size = os.path.getsize(file_path)
                    total_size += size
                    total_count += 1
                    
                    # Stats per extension
                    if ext not in extension_stats:
                        extension_stats[ext] = {"count": 0, "size": 0}
                    extension_stats[ext]["count"] += 1
                    extension_stats[ext]["size"] += size
                    
                    # Track large files (> 500KB)
                    if size > 500 * 1024:
                        large_files.append((file_path, size))
                        
                except OSError as e:
                    print(f"Error reading {file_path}: {e}")

    # Sort large files by size (descending)
    large_files.sort(key=lambda x: x[1], reverse=True)

    # Convert bytes to readable format
    def format_size(size_bytes):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} TB"

    print("\n" + "="*50)
    print("IMAGE ASSET ANALYSIS REPORT")
    print("="*50)
    
    print(f"\nTotal Image Files: {total_count}")
    print(f"Total Size: {format_size(total_size)}")
    
    print("\nBreakdown by Extension:")
    for ext, stats in extension_stats.items():
        print(f"  {ext}: {stats['count']} files, {format_size(stats['size'])}")
        
    print(f"\nLarge Files (> 500KB): {len(large_files)}")
    print("Top 10 Largest Images:")
    for path, size in large_files[:10]:
        rel_path = os.path.relpath(path, PROJECT_ROOT)
        print(f"  {format_size(size)} - {rel_path}")

    print("\n" + "="*50)
    print("PERFORMANCE ASSESSMENT")
    print("="*50)
    
    is_heavy = False
    reasons = []
    
    if total_size > 100 * 1024 * 1024: # > 100MB
        is_heavy = True
        reasons.append("- Total asset size is very large (> 100MB).")
    elif total_size > 50 * 1024 * 1024: # > 50MB
        is_heavy = True
        reasons.append("- Total asset size is considerable (> 50MB).")
        
    if any(size > 2 * 1024 * 1024 for _, size in large_files):
        is_heavy = True
        reasons.append("- Contains individual images larger than 2MB, which will slow down loading.")
        
    if len(large_files) > 20:
        is_heavy = True
        reasons.append(f"- Found {len(large_files)} files larger than 500KB. These should be optimized.")

    if is_heavy:
        print("RESULT: HEAVY & PERFORMANCE INTENSIVE")
        print("Reasons:")
        for r in reasons:
            print(r)
        print("\nRecommendation: converting to WebP and resizing could reduce size by 50-80%.")
    else:
        print("RESULT: OPTIMIZED / LIGHTWEIGHT")
        print("No major size issues detected, but WebP conversion could still improve performance.")

if __name__ == "__main__":
    analyze_images()
