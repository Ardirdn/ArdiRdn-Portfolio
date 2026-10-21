// What counts as Roblox work, in one place.
//
// Nothing here duplicates content — it filters the same data the landing page
// reads, so a change to a project, map or clip shows up in both views.
import { vfxUiClips } from './techArt';
import { characters } from './characterSkills';

/** A game is Roblox work when it ships on roblox.com. */
export const isRobloxProject = (project) =>
    typeof project?.StorePage === 'string' && project.StorePage.includes('roblox.com');

export const robloxProjects = (projects = []) => projects.filter(isRobloxProject);

export const robloxLevelDesigns = (levelDesigns = []) =>
    levelDesigns.filter((design) => design.engine === 'roblox');

/**
 * Tech-art clips are tagged by hand in techart_data.json — the data carries no
 * engine otherwise, and only the author knows which engine a clip came from.
 */
export const robloxVfxClips = vfxUiClips.filter((clip) => clip.engine === 'roblox');

/** Every character was captured in Roblox Studio, so the whole set qualifies. */
export const robloxCharacters = characters;

export const robloxSkillCount = characters.reduce(
    (sum, character) => sum + character.skills.length,
    0
);
