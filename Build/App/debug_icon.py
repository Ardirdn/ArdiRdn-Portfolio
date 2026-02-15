from PIL import Image, ImageFile
import os

ImageFile.LOAD_TRUNCATED_IMAGES = True

file_path = r"c:\Users\Studi\Downloads\PortFolio_Build - Copy (2)\Portfolio_Aldi\public\assets\game\AkuSiJuraganEmpang\JEIcon.png"

try:
    with Image.open(file_path) as img:
        print(f"Opened image: {img.format}, {img.size}, {img.mode}")
        new_file_path = os.path.splitext(file_path)[0] + ".webp"
        img.save(new_file_path, "WEBP", quality=85)
        print(f"Saved successfully to {new_file_path}")
except Exception as e:
    print(f"Error: {e}")
