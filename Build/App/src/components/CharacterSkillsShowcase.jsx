import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
    characterSkillsIntro,
    characters,
    featuredCharacters,
    heroSkills,
    pickVariant,
    previewVariant,
} from "../services/characterSkills";
import { VideoFrame, VideoLightbox } from "./VideoShowcase";
import CharacterRoster from "./CharacterRoster";

/**
 * One featured character: the clip, then the name and blurb under it. No card
 * around the pair — the only border in the grid is the one on the video, the
 * same way the cutscene and gallery sections carry theirs.
 */
export const CharacterCard = ({ character, index, onExpand }) => {
    const shown = heroSkills(character);
    const [active, setActive] = useState(0);
    const skill = shown[active] ?? shown[0];
    // The card plays the trimmed preview; the lightbox opens the real clip.
    const clip = previewVariant(skill);
    const full = pickVariant(skill, "enemy");

    return (
        <div data-aos="fade-up" data-aos-delay={(index % 3) * 100}>
            <div className="relative rounded-xl overflow-hidden border border-white/10">
                <VideoFrame
                    key={clip.src}
                    src={clip.src}
                    poster={clip.poster}
                    duration={skill.duration}
                    onExpand={() =>
                        onExpand({
                            ...full,
                            label: `${character.name} — ${skill.name}`,
                            caption: character.summary,
                        })
                    }
                    className="aspect-video w-full"
                />
                <img
                    src={character.thumbnail}
                    alt=""
                    loading="lazy"
                    className="absolute top-3 left-3 w-14 h-14 rounded-lg object-cover border-2 border-white/20 shadow-lg shadow-black/50 pointer-events-none"
                />
            </div>

            <Link
                to={`/character-skills/${character.id}`}
                className="group mt-4 flex items-center justify-between gap-2"
            >
                <h4 className="text-white font-semibold text-base md:text-lg leading-snug group-hover:text-rose-200 transition-colors">
                    {character.name}
                </h4>
                <ArrowRight
                    size={15}
                    className="shrink-0 text-slate-500 group-hover:text-rose-200 group-hover:translate-x-0.5 transition-all"
                />
            </Link>

            {/* Characters whose data names more than one preview skill keep
                their switcher — it is the only way both clips are reachable
                from the card. */}
            {shown.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {shown.map((option, i) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-pressed={i === active}
                            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${i === active
                                ? "bg-rose-600 border-rose-500 text-white"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const CharacterSkillsShowcase = () => {
    const [clip, setClip] = useState(null);
    const totalSkills = characters.reduce((sum, c) => sum + c.skills.length, 0);

    return (
        <div className="w-full mb-16" id="character-skills-showcase">
            {/* Header */}
            <div className="text-center mb-10" data-aos="fade-up" data-aos-duration="1000">
                <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffb4b4] to-[#ffffff] mb-4">
                    {characterSkillsIntro.title}
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                    {characterSkillsIntro.blurb}
                </p>
                <p className="text-slate-500 text-xs mt-3 font-mono">
                    {characters.length} characters · {totalSkills} abilities
                </p>
            </div>

            <div
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                data-aos="fade-up"
                data-aos-duration="1200"
            >
                {featuredCharacters.map((character, index) => (
                    <CharacterCard
                        key={character.id}
                        character={character}
                        index={index}
                        onExpand={setClip}
                    />
                ))}
            </div>

            {/* A look at the rest of the roster — not clickable, the See All
                below is the way in. */}
            <div className="mt-12">
                <CharacterRoster preview limit={12} />
            </div>

            {/* See all */}
            <div className="flex justify-center mt-10" data-aos="fade-up">
                <Link
                    to="/character-skills"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
                >
                    See All {characters.length} Characters
                    <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            </div>

            <VideoLightbox clip={clip} onClose={() => setClip(null)} />
        </div>
    );
};

export default CharacterSkillsShowcase;
