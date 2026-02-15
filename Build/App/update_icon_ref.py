import os

# Configuration
PROJECT_ROOT = r"c:\Users\Studi\Downloads\PortFolio_Build - Copy (2)\Portfolio_Aldi"
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")
SRC_DIR = os.path.join(PROJECT_ROOT, "src")

def get_files(directory, extensions=None):
    file_list = []
    for root, dirs, files in os.walk(directory):
        if "assets_backup" in root: continue
        for file in files:
            if extensions:
                ext = os.path.splitext(file)[1].lower()
                if ext in extensions:
                    file_list.append(os.path.join(root, file))
            else:
                file_list.append(os.path.join(root, file))
    return file_list

def update_references(old_name, new_name):
    # Files to scan
    data_files = get_files(DATA_DIR, {".json"})
    src_data_files = get_files(os.path.join(SRC_DIR, "data"), {".json"}) if os.path.exists(os.path.join(SRC_DIR, "data")) else []
    code_files = get_files(SRC_DIR, {".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".json"}) 
    all_files = data_files + src_data_files + code_files
    
    count = 0
    for file_path in all_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if old_name in content:
                new_content = content.replace(old_name, new_name)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {file_path}")
                count += 1
        except Exception as e:
            print(f"Error {file_path}: {e}")
    print(f"Total updates: {count}")

update_references("JEIcon.png", "JEIcon.webp")
