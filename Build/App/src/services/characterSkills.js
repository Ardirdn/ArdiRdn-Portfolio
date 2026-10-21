// Character Skills showcase data.
// Paths are resolved once here so every consumer gets deploy-ready URLs.
import rawCharacterSkills from '../data/characterskills_data.json';
import { transformAssetPaths } from '../utils/assetPath';

const data = transformAssetPaths(rawCharacterSkills);

export const characterSkillsIntro = {
    title: data.title,
    blurb: data.blurb,
};

export const characters = data.characters;

/** Characters surfaced in the landing-page showcase. */
export const featuredCharacters = characters.filter((character) => character.featured);

export const findCharacter = (id) => characters.find((character) => character.id === id);

/**
 * The skills a featured card cycles through, named per character in the data
 * (`previewSkills`). Several ultimates run 10-48s and weigh up to 18 MB, so a
 * card leads with a shorter signature move rather than whatever is longest.
 * Anything without an explicit list falls back to the ultimate.
 */
export const heroSkills = (character) => {
    const named = (character.previewSkills ?? [])
        .map((key) => character.skills.find((skill) => skill.key === key))
        .filter(Boolean);
    if (named.length) return named;
    const fallback =
        character.skills.find((skill) => skill.key === 'skill5') ??
        character.skills.find((skill) => skill.key !== 'm1s') ??
        character.skills[0];
    return fallback ? [fallback] : [];
};

/**
 * Playback source. `preview` is a short, cheap cut that only featured cards
 * use; everywhere else plays the real clip. Older characters were recorded
 * from two angles, newer ones as a single take.
 */
export const pickVariant = (skill, preferred) =>
    skill.variants[preferred] ??
    skill.variants.enemy ??
    skill.variants.solo ??
    skill.variants.full;

/** What a featured card should play: the trimmed preview when one exists. */
export const previewVariant = (skill) =>
    skill.variants.preview ?? pickVariant(skill, 'enemy');

/** Roles present in the set, in the order the filter bar should show them. */
export const ROLE_ORDER = ['Balanced', 'Bruiser', 'Burst', 'Ranger', 'Technical', 'Tank', 'Support'];

export const roles = ROLE_ORDER.filter((role) =>
    characters.some((character) => character.role === role)
);
