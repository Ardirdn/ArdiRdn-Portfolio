import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Swords } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { VideoFrame, VideoLightbox } from "../components/VideoShowcase";
import { findCharacter } from "../services/characterSkills";

// `preview` is a trimmed cut for the landing page and never offered here.
const VARIANT_LABEL = { enemy: "vs Target", solo: "Solo", full: "Full Clip" };

/**
 * One ability. The same move was recorded twice — alone, so the effect reads,
 * and against a target, so the impact does — and the chips switch between them
 * without leaving the card.
 */
const SkillCard = ({ character, skill, index, onExpand }) => {
    const order = Object.keys(VARIANT_LABEL).filter((v) => skill.variants[v]);
    const [variant, setVariant] = useState(order[0]);
    const clip = skill.variants[variant];

    return (
        <div
            className="flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
            data-aos="fade-up"
            data-aos-delay={(index % 3) * 100}
        >
            <VideoFrame
                src={clip.src}
                poster={clip.poster}
                duration={skill.duration}
                onExpand={() =>
                    onExpand({
                        ...clip,
                        label: `${character.name} — ${skill.name}`,
                        caption: `${skill.slot} · ${VARIANT_LABEL[variant]}`,
                    })
                }
                className="aspect-video w-full"
            />

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                        <span className="block text-[11px] uppercase tracking-wider text-rose-300/80">
                            {skill.slot}
                        </span>
                        <h4 className="text-white font-semibold text-base leading-snug">
                            {skill.name}
                        </h4>
                    </div>
                    <span className="shrink-0 text-[11px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        {skill.duration}
                    </span>
                </div>

                {order.length > 1 && (
                    <div className="flex gap-2">
                        {order.map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setVariant(key)}
                                aria-pressed={key === variant}
                                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${key === variant
                                    ? "bg-rose-600 border-rose-500 text-white"
                                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                    }`}
                            >
                                {VARIANT_LABEL[key]}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CharacterSkillDetail = () => {
    const { id } = useParams();
    const character = findCharacter(id);
    const [clip, setClip] = useState(null);

    useEffect(() => {
        AOS.init();
        window.scrollTo(0, 0);
    }, [id]);

    if (!character) {
        return (
            <div className="min-h-screen bg-[#000714] text-white">
                <Navbar />
                <div className="pt-40 text-center">
                    <p className="text-xl mb-6">Character not found</p>
                    <Link
                        to="/character-skills"
                        className="text-rose-300 hover:text-white underline"
                    >
                        Back to all characters
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000714] text-white">
            <Navbar />

            <div className="pt-32 px-[5%] md:px-[10%] pb-20 max-w-[1920px] mx-auto">
                <Link
                    to="/character-skills"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"
                >
                    <ArrowLeft size={20} />
                    All Characters
                </Link>

                {/* Character header */}
                <div
                    className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12"
                    data-aos="fade-up"
                >
                    <img
                        src={character.thumbnail}
                        alt={character.name}
                        className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border border-white/15 shadow-lg shadow-black/50"
                    />
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-200 border border-rose-400/20">
                                {character.role}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider text-slate-500">
                                {character.series}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffb4b4] to-[#ffffff] mb-3">
                            {character.name}
                        </h1>
                        <p className="text-slate-400 max-w-2xl text-sm md:text-base">
                            {character.summary}
                        </p>
                        <p className="inline-flex items-center gap-2 text-slate-500 text-xs mt-3 font-mono">
                            <Swords size={13} className="text-rose-300" />
                            {character.skills.length} abilities recorded
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {character.skills.map((skill, index) => (
                        <SkillCard
                            key={skill.key}
                            character={character}
                            skill={skill}
                            index={index}
                            onExpand={setClip}
                        />
                    ))}
                </div>
            </div>

            <VideoLightbox clip={clip} onClose={() => setClip(null)} />
        </div>
    );
};

export default CharacterSkillDetail;
