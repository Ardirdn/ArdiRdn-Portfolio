import os

# Configuration
PROJECT_ROOT = r"c:\Users\Studi\Downloads\PortFolio_Build - Copy (2)\Portfolio_Aldi"
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
UNUSED_ASSETS_FILE = "unused_assets.txt"

def delete_assets():
    if not os.path.exists(UNUSED_ASSETS_FILE):
        print(f"Error: {UNUSED_ASSETS_FILE} not found.")
        return

    deleted_count = 0
    errors = 0

    with open(UNUSED_ASSETS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            
            # Line format: /assets/path/to/file.ext
            # We need to construct absolute path
            # Remove leading / if present
            rel_path = line.lstrip("/\\")
            full_path = os.path.join(PUBLIC_DIR, rel_path)
            
            try:
                if os.path.exists(full_path):
                    os.remove(full_path)
                    print(f"Deleted: {line}")
                    deleted_count += 1
                else:
                    # Try to find case-insensitive match if direct path doesn't exist
                    # (Though Windows is case insensitive, os.path.exists should work if path is correct)
                    print(f"File not found (already deleted?): {full_path}")
            except Exception as e:
                print(f"Error deleting {full_path}: {e}")
                errors += 1

    print(f"\nSummary:")
    print(f"Successfully deleted: {deleted_count} files")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    delete_assets()
