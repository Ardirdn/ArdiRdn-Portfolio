
import React, { useEffect } from "react";
import { assetPath } from "../utils/assetPath";
import ReactPlayer from "react-player";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const ModularCharacterDetail = () => {
    useEffect(() => {
        AOS.init();
        window.scrollTo(0, 0);
    }, []);

    const topVideos = [
        assetPath("/assets/ModularCharacterShowcase/ModularCharacter_Boy.mp4"),
        assetPath("/assets/ModularCharacterShowcase/ModularCharacter_Fat.mp4"),
        assetPath("/assets/ModularCharacterShowcase/ModularCharacter_Female.mp4"),
        assetPath("/assets/ModularCharacterShowcase/ModularCharacter_Girl.mp4"),
        assetPath("/assets/ModularCharacterShowcase/ModularCharacter_Male.mp4"),
        assetPath("/assets/ModularCharacterShowcase/ModularCharacter_Muscular.mp4")
    ];

    const contentSections = [
        {
            title: "Randomize",
            text: "Utilizing atlas texturing and a shared armature, we separate outfits and body parts to prevent overlap during animation. This allows for randomization where one fat NPC can wear dozens of shirts, pants, hair, and heads, creating hundreds or thousands of unique looks. This variety makes levels feel more flexible, modular, and easy to iterate because everything is shared.",
            media: assetPath("/assets/ModularCharacterShowcase/Showcase_Scripts.mp4"),
            type: "video",
            reversed: false
        },
        {
            title: "Shared Armature & Optimized",
            text: "A single armature is shared across every NPC type—whether fat, muscular, male, or female. This unified rig simplifies the animation pipeline, ensuring consistent behavior across all character variations while maintaining high performance.",
            media: assetPath("/assets/ModularCharacterShowcase/Showcase_Blender.mp4"),
            type: "video",
            reversed: true
        },
        {
            title: "Single Material",
            text: "Optimized for performance, the entire character system uses a single material. This significantly reduces draw calls and rendering overhead, making it ideal for mobile and high-performance game environments.",
            media: assetPath("/assets/ModularCharacterShowcase/MaterialShowcase.mp4"),
            type: "video",
            reversed: false
        },
        {
            title: "Atlas Texturing",
            text: "We utilize atlas texturing to map all character parts to a single texture file. This technique not only saves memory but also allows for easy color variations and style adjustments without creating multiple materials.",
            media: assetPath("/assets/ModularCharacterShowcase/Day.png"),
            type: "image",
            reversed: true
        }
    ];

    return (
        <div className="min-h-screen bg-[#000714] text-white pt-20 pb-20 px-4 md:px-10 overflow-hidden">

            {/* Back Button */}
            <div className="max-w-7xl mx-auto mb-10" data-aos="fade-right">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    Back to Portfolio
                </Link>
            </div>

            {/* Title */}
            <div className="text-center mb-16" data-aos="fade-up">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                    Modular Character Workflow
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    A comprehensive look at a scalable, optimized character system for games.
                </p>
            </div>

            {/* Top Grid - 6 Square Videos */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-24">
                {topVideos.map((videoArg, index) => (
                    <div
                        key={index}
                        className="aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/50 relative group"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <ReactPlayer
                            url={videoArg}
                            width="100%"
                            height="100%"
                            playing={true}
                            muted={true}
                            loop={true}
                            controls={false}
                            className="bg-black"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <span className="text-xs font-semibold tracking-wider uppercase">Variant {index + 1}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto space-y-32">
                {contentSections.map((section, index) => (
                    <div
                        key={index}
                        className={`flex flex-col ${section.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
                    >
                        {/* Text Content */}
                        <div
                            className="flex-1 space-y-6"
                            data-aos={section.reversed ? "fade-left" : "fade-right"}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                {section.title}
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed show-newlines">
                                {section.text}
                            </p>
                        </div>

                        {/* Media Content */}
                        <div
                            className="flex-1 w-full"
                            data-aos={section.reversed ? "fade-right" : "fade-left"}
                        >
                            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 aspect-video relative group">
                                {section.type === "video" ? (
                                    <ReactPlayer
                                        url={section.media}
                                        width="100%"
                                        height="100%"
                                        playing={true}
                                        muted={true}
                                        loop={true}
                                        controls={true}
                                    />
                                ) : (
                                    <img
                                        src={section.media}
                                        alt={section.title}
                                        className="w-full h-full object-contain bg-[#1a1a1a]"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModularCharacterDetail;
