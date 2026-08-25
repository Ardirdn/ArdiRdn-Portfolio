import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { assetPath } from "../utils/assetPath";
import uiuxData from "../data/uiux_data.json";
import {
    cutsceneCollections,
    shaderCollections,
    vfxUiClips,
    flattenCollections,
} from "../services/techArt";
import { VideoFrame, VideoLightbox } from "./VideoShowcase";

export const GALLERY_TABS = [
    {
        id: "uiux",
        label: "UI/UX",
        blurb:
            "A curated collection of user interfaces and experiences designed for various games and applications.",
    },
    {
        id: "shader",
        label: "Shader",
        blurb:
            "Custom shaders and their breakdowns, including the enabled/disabled comparisons and graph views.",
    },
    {
        id: "cutscene",
        label: "Cutscene",
        blurb:
            "Every in-engine cinematic in full: the seamless gameplay hand-off and the complete quest cutscene set.",
    },
    {
        id: "vfx",
        label: "VFX & UI Animation",
        blurb:
            "Reward flows, game-feel effects and interface motion built for readable, satisfying feedback.",
    },
];

/** Images picked for the 7-cell UI/UX mosaic. */
const UIUX_MOSAIC = [
    "/assets/Ui Ux/JuraganNasiPadang/Asset 37.webp",
    "/assets/Ui Ux/DetainedSouls/MainMenu1.webp",
    "/assets/Ui Ux/JuraganEmpang/Banner.webp",
    "/assets/Ui Ux/TheDeathPath/Asset 4.webp",
    "/assets/Ui Ux/JuraganFauna/JuraganFaunaBanner.webp",
    "/assets/Ui Ux/LegendaryFIshHunter/Asset 25.webp",
    "/assets/Ui Ux/DropStackBall/Asset 1.webp",
];

const MosaicCell = ({ item, className, aos, delay, small }) => (
    <div
        className={`${className} relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900`}
        data-aos={aos}
        data-aos-delay={delay}
    >
        <img
            src={assetPath(item.src)}
            alt={item.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
            <span
                className={`text-white font-bold text-center ${small ? "text-xs md:text-sm" : ""}`}
            >
                {item.title}
            </span>
        </div>
    </div>
);

const UiUxTab = () => {
    const items = useMemo(
        () =>
            UIUX_MOSAIC.map((src) => {
                const project = uiuxData.find((p) => p.images.includes(src));
                return { src, title: project ? project.title : "UI/UX Design" };
            }),
        []
    );

    const cells = [
        { className: "md:col-span-3 h-[200px] md:h-[250px]", aos: "fade-right", delay: "100" },
        { className: "md:col-span-6 h-[200px] md:h-[250px]", aos: "fade-down", delay: "200" },
        { className: "md:col-span-3 h-[200px] md:h-[250px]", aos: "fade-left", delay: "300" },
        { className: "md:col-span-4 h-[200px] md:h-[250px]", aos: "fade-up-right", delay: "400" },
        { className: "md:col-span-2 h-[200px] md:h-[250px]", aos: "fade-up", delay: "500", small: true },
        { className: "md:col-span-2 h-[200px] md:h-[250px]", aos: "fade-up", delay: "600", small: true },
        { className: "md:col-span-4 h-[200px] md:h-[250px]", aos: "fade-up-left", delay: "700" },
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {cells.map((cell, i) => (
                    <MosaicCell key={items[i].src} item={items[i]} {...cell} />
                ))}
            </div>

            <div className="flex justify-center mt-10" data-aos="fade-up">
                <Link
                    to="/ui-ux"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white font-medium transition-all hover:scale-105"
                >
                    View All Collections
                    <ArrowRight size={20} />
                </Link>
            </div>
        </>
    );
};

const ClipGrid = ({ clips }) => {
    const [clip, setClip] = useState(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clips.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                        data-aos="fade-up"
                        data-aos-delay={(index % 3) * 100}
                    >
                        <VideoFrame
                            src={item.src}
                            poster={item.poster}
                            duration={item.duration}
                            fit={item.aspect === "portrait" ? "contain" : "cover"}
                            onExpand={() => setClip(item)}
                            className="aspect-video w-full"
                        />
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h4 className="text-white font-semibold text-base leading-snug">
                                    {item.label}
                                </h4>
                                <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                                    {item.tag}
                                </span>
                            </div>
                            {item.caption && (
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {item.caption}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <VideoLightbox clip={clip} onClose={() => setClip(null)} />
        </>
    );
};

const GallerySection = ({ activeTab = "uiux", onTabChange }) => {
    const cutsceneClips = useMemo(
        () => flattenCollections(cutsceneCollections),
        []
    );
    const shaderClips = useMemo(() => flattenCollections(shaderCollections), []);

    const current = GALLERY_TABS.find((tab) => tab.id === activeTab) ?? GALLERY_TABS[0];

    return (
        <div className="w-full py-20" id="Gallery">
            {/* Header */}
            <div
                className="flex flex-col items-center justify-center mb-8 text-center"
                data-aos="fade-up"
            >
                <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#cebdfc] to-[#ffffff] mb-6">
                    Design &amp; Tech Art Gallery
                </h3>
                <p className="text-slate-400 max-w-2xl text-base md:text-lg min-h-[3.5rem]">
                    {current.blurb}
                </p>
            </div>

            {/* Tabs */}
            <div
                className="flex flex-wrap justify-center gap-2 mb-10"
                data-aos="fade-up"
                role="tablist"
            >
                {GALLERY_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={tab.id === activeTab}
                        onClick={() => onTabChange?.(tab.id)}
                        className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 border ${tab.id === activeTab
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10">
                {activeTab === "uiux" && <UiUxTab />}
                {activeTab === "shader" && <ClipGrid clips={shaderClips} />}
                {activeTab === "cutscene" && <ClipGrid clips={cutsceneClips} />}
                {activeTab === "vfx" && <ClipGrid clips={vfxUiClips} />}
            </div>
        </div>
    );
};

export default GallerySection;
