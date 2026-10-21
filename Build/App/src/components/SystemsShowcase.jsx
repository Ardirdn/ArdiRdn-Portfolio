import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
    systemsIntro,
    systems,
    featuredSystems,
    systemClip,
    systemPreview,
} from "../services/systems";
import { VideoFrame, VideoLightbox } from "./VideoShowcase";

/**
 * One system: the clip and its name, nothing else. The write-up lives on the
 * system's own page, which the title links to; the card autoplays a short
 * preview cut because these recordings run up to four minutes.
 */
export const SystemCard = ({ item, index, columns = 3, onExpand }) => {
    const preview = systemPreview(item);

    return (
        <div data-aos="fade-up" data-aos-delay={(index % columns) * 100}>
            <div className="rounded-xl overflow-hidden border border-white/10">
                <VideoFrame
                    src={preview.src}
                    poster={preview.poster}
                    duration={item.duration}
                    onExpand={() => onExpand(systemClip(item))}
                    className="aspect-video w-full"
                />
            </div>

            <Link
                to={`/systems/${item.id}`}
                className="group mt-4 flex items-center justify-between gap-2"
            >
                <h4 className="text-white font-semibold text-base md:text-lg leading-snug group-hover:text-emerald-200 transition-colors">
                    {item.title}
                </h4>
                <ArrowRight
                    size={15}
                    className="shrink-0 text-slate-500 group-hover:text-emerald-200 group-hover:translate-x-0.5 transition-all"
                />
            </Link>
        </div>
    );
};

// Tailwind only keeps classes it can see literally, so the column options are
// spelled out rather than built from the number.
const COLUMNS = {
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

/** The grid on its own, reused by the landing page and the full listing. */
export const SystemGrid = ({ items, columns = 3 }) => {
    const [clip, setClip] = useState(null);

    return (
        <>
            <div
                className={`w-full grid ${COLUMNS[columns] ?? COLUMNS[3]} gap-6 md:gap-8`}
                data-aos="fade-up"
                data-aos-duration="1200"
            >
                {items.map((item, index) => (
                    <SystemCard
                        key={item.id}
                        item={item}
                        index={index}
                        columns={columns}
                        onExpand={setClip}
                    />
                ))}
            </div>
            <VideoLightbox clip={clip} onClose={() => setClip(null)} />
        </>
    );
};

/** `only` lets a page narrow the set; the rest sit behind "See All". */
const SystemsShowcase = ({ only, showHeader = true }) => {
    const source = only ?? systems;
    const shown = source.filter((item) => item.featured);

    return (
        <div className="w-full mb-16" id="systems-showcase">
            {showHeader && (
                <div
                    className="text-center mb-10"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9df5c8] to-[#ffffff] mb-4">
                        {systemsIntro.title}
                    </h3>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                        {systemsIntro.blurb}
                    </p>
                    <p className="text-slate-500 text-xs mt-3 font-mono">
                        {source.length} systems
                    </p>
                </div>
            )}

            <SystemGrid items={shown} columns={5} />

            {source.length > shown.length && (
                <div className="flex justify-center mt-10" data-aos="fade-up">
                    <Link
                        to="/systems"
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
                    >
                        See All {source.length} Systems
                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
            )}
        </div>
    );
};

export { featuredSystems };
export default SystemsShowcase;
