import React, { useState } from "react";
import { ArrowRight, Film } from "lucide-react";
import { cutsceneCollections, featuredVideos } from "../services/techArt";
import { VideoFrame, VideoLightbox } from "./VideoShowcase";

const TagBadge = ({ children }) => (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-200 border border-purple-400/20">
        <Film size={12} />
        {children}
    </span>
);

const CutsceneShowcase = ({ onSeeAll }) => {
    const [clip, setClip] = useState(null);
    const [seamless, quest] = cutsceneCollections;
    const [seamlessMain, seamlessTimeline] = featuredVideos(seamless);
    const [questFeature] = featuredVideos(quest);

    return (
        <div className="w-full mb-16" id="cutscene-showcase">
            {/* Header */}
            <div className="text-center mb-10" data-aos="fade-up" data-aos-duration="1000">
                <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#cebdfc] to-[#ffffff] mb-4">
                    Cutscene Showcase
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                    In-engine cinematics built to carry story without pulling the player out
                    of the game — camera work, staging and timing authored against live
                    gameplay state.
                </p>
            </div>

            {/* Featured — seamless cutscene to gameplay */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-8">
                <div
                    className="md:col-span-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                    data-aos="fade-right"
                    data-aos-duration="1200"
                >
                    <VideoFrame
                        src={seamlessMain.src}
                        poster={seamlessMain.poster}
                        label={seamlessMain.label}
                        duration={seamlessMain.duration}
                        onExpand={() => setClip(seamlessMain)}
                        className="aspect-video w-full"
                    />
                </div>

                <div
                    className="md:col-span-4 flex flex-col gap-4"
                    data-aos="fade-left"
                    data-aos-duration="1200"
                >
                    <div>
                        <TagBadge>{seamless.tag}</TagBadge>
                        <h4 className="text-xl md:text-2xl font-semibold text-white mt-3 mb-2">
                            {seamless.title}
                        </h4>
                        {seamless.description.map((paragraph, i) => (
                            <p key={i} className="text-slate-400 text-sm leading-relaxed mb-2">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/10 mt-auto">
                        <VideoFrame
                            src={seamlessTimeline.src}
                            poster={seamlessTimeline.poster}
                            label={seamlessTimeline.label}
                            duration={seamlessTimeline.duration}
                            onExpand={() => setClip(seamlessTimeline)}
                            className="aspect-video w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Secondary — quest cutscenes */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                <div
                    className="md:col-span-4 flex flex-col justify-center order-2 md:order-1"
                    data-aos="fade-right"
                    data-aos-duration="1200"
                >
                    <TagBadge>{quest.tag}</TagBadge>
                    <h4 className="text-xl md:text-2xl font-semibold text-white mt-3 mb-2">
                        {quest.title}
                    </h4>
                    {quest.description.map((paragraph, i) => (
                        <p key={i} className="text-slate-400 text-sm leading-relaxed mb-3">
                            {paragraph}
                        </p>
                    ))}
                    <span className="text-xs text-slate-500">
                        {quest.videos.length} cutscenes in this set
                    </span>
                </div>

                <div
                    className="md:col-span-8 rounded-xl overflow-hidden border border-white/10 order-1 md:order-2"
                    data-aos="fade-left"
                    data-aos-duration="1200"
                >
                    <VideoFrame
                        src={questFeature.src}
                        poster={questFeature.poster}
                        label={questFeature.label}
                        duration={questFeature.duration}
                        onExpand={() => setClip(questFeature)}
                        className="aspect-video w-full"
                    />
                </div>
            </div>

            {/* See all */}
            <div className="flex justify-center mt-8" data-aos="fade-up">
                <button
                    type="button"
                    onClick={onSeeAll}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
                >
                    See All Cutscenes
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

export default CutsceneShowcase;
