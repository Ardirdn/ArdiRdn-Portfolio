import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { shaderCollections } from "../services/techArt";
import { VideoFrame, VideoLightbox } from "./VideoShowcase";

/**
 * One shader per card. Shaders that ship a comparison (enabled/disabled) or a
 * graph breakdown get chips to switch which clip is playing, so the card stays
 * compact without hiding the second angle.
 */
const ShaderCard = ({ shader, onExpand }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = shader.videos[activeIndex];

    return (
        <div className="flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
            <VideoFrame
                src={active.src}
                poster={active.poster}
                duration={active.duration}
                onExpand={() => onExpand(active)}
                className="aspect-video w-full"
            />

            {shader.videos.length > 1 && (
                <div className="flex gap-2 px-4 pt-4">
                    {shader.videos.map((video, index) => (
                        <button
                            key={video.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-pressed={index === activeIndex}
                            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${index === activeIndex
                                ? "bg-blue-600 border-blue-500 text-white"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            {video.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-white font-semibold text-base md:text-lg leading-snug">
                        {shader.title}
                    </h4>
                    <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-400/20">
                        {shader.tag}
                    </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    {shader.description[0]}
                </p>

                <ul className="mt-auto space-y-1.5">
                    {shader.techniques.map((technique, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-400">
                            <Check size={13} className="shrink-0 mt-0.5 text-cyan-400" />
                            <span>{technique}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ShaderShowcase = ({ onSeeAll }) => {
    const [clip, setClip] = useState(null);
    const featured = shaderCollections.filter((shader) => shader.featured);

    return (
        <div className="w-full mb-16" id="shader-showcase">
            {/* Header */}
            <div className="text-center mb-10" data-aos="fade-up" data-aos-duration="1000">
                <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8ee9ff] to-[#ffffff] mb-4">
                    Shader Showcase
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                    Custom shaders written to solve a specific production problem — stylized
                    water without a depth buffer, art-directable folds, and realtime content
                    censorship that keeps one build shippable across ratings.
                </p>
            </div>

            <div
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                data-aos="fade-up"
                data-aos-duration="1200"
            >
                {featured.map((shader) => (
                    <ShaderCard key={shader.id} shader={shader} onExpand={setClip} />
                ))}
            </div>

            {/* See all */}
            <div className="flex justify-center mt-8" data-aos="fade-up">
                <button
                    type="button"
                    onClick={onSeeAll}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
                >
                    See All Shaders
                    <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </button>
            </div>

            <VideoLightbox clip={clip} onClose={() => setClip(null)} />
        </div>
    );
};

export default ShaderShowcase;
