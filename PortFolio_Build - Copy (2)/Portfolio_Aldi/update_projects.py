
import json
import os

file_path = 'c:/Users/Studi/Downloads/PortFolio_Build - Copy (2)/Portfolio_Aldi/public/data/projects.json'

new_roles = [
    "Lead 3D Artist & Visual Director: Spearheading the creation of immersive 3D worlds, from modular asset generation to atlas texturing.",
    "Lead Level & Game Designer: Crafting engaging gameplay loops and intricately designed levels.",
    "Economy & Monetization Manager: Designing sustainable in-game economies to ensure long-term player engagement.",
    "Lead Developer & Technical Supervisor: Bridging the gap between artistic vision and technical implementation.",
    "Strategic Marketing Specialist: Driving engagement through targeted content on TikTok and social platforms."
]

new_tech_stack = [
    "Blender",
    "Atlas Texturing",
    "Modular Asset Creation",
    "Rigging"
]

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for project in data:
    project['Role'] = new_roles
    project['TechStack'] = new_tech_stack

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Updated projects.json successfully.")
