import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { vfxUiClips } from "../services/techArt";
import { VideoFrame, VideoLightbox } from "./VideoShowcase";

const VfxUiShowcase = ({ onSeeAll }) => {
    const [clip, setClip] = useState(null);
    const featured = vfxUiClips.filter((item) => item.featured);

    return (
        <div className="w-full mb-16" id="vfx-ui-showcase">
            {/* Header */}
            <div className="text-center mb-10" data-aos="fade-up" data-aos-duration="1000">
                <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffd9a0] to-[#ffffff] mb-4">
                    VFX &amp; UI Animation
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                    Reward flows and interface motion built around game feel — anticipation,
                    impact and payoff timed so every interaction reads clearly and lands with
                    weight.
                </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                        data-aos={index % 2 === 0 ? "fade-up-right" : "fade-up-left"}
                        data-aos-duration="1200"
                    >
                        <VideoFrame
                            src={item.src}
                            poster={item.poster}
                            duration={item.duration}
                            fit={item.aspect === "portrait" ? "contain" : "cover"}
                            onExpand={() => setClip(item)}
                            className="aspect-video w-full"
                        />
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-white font-semibold text-lg">{item.label}</h4>
                                <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-400/20">
                                    {item.tag}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {item.caption}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* See all */}
            <div className="flex justify-center mt-8" data-aos="fade-up">
                <button
                    type="button"
                    onClick={onSeeAll}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
                >
                    See All VFX &amp; UI Animation
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

export default VfxUiShowcase;
