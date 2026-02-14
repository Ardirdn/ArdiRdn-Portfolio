import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchLevelDesigns } from "../services/dataService";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Carousel component for image slideshow
const Carousel = ({ images, interval = 4000 }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, [images.length, interval]);

    return (
        <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={index}
                    src={images[index]}
                    alt={`Slide ${index}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            </AnimatePresence>
        </div>
    );
};

// Engine filter buttons
const engines = [
    { id: "all", label: "All" },
    { id: "unreal", label: "Unreal Engine" },
    { id: "unity", label: "Unity" },
    { id: "roblox", label: "Roblox" },
];

// Level Design Card Component
const LevelDesignCard = ({ levelDesign }) => {
    const allImages = levelDesign.images.map(
        (img) => `${levelDesign.folder}/${img}`
    );

    // Get first 3 images for thumbnails
    const thumbnailImages = allImages.slice(0, 3);

    return (
        <div
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group"
            data-aos="fade-up"
        >
            {/* Main Image */}
            <div className="relative h-[200px] md:h-[250px] overflow-hidden">
                <img
                    src={levelDesign.thumbnail}
                    alt={levelDesign.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Thumbnails Row - Rotating */}
            <div className="flex h-[60px] md:h-[80px]">
                {[0, 1, 2].map((i) => {
                    const slotImages = allImages.filter((_, idx) => idx % 3 === i);
                    return (
                        <div key={i} className="flex-1 overflow-hidden relative border-r border-slate-900/50 last:border-r-0">
                            {slotImages.length > 0 ? (
                                <Carousel images={slotImages} interval={3000 + i * 1000} />
                            ) : (
                                <div className="w-full h-full bg-slate-800" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Info Section */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                        {levelDesign.title}
                    </h3>
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${levelDesign.engine === "unreal"
                            ? "bg-purple-500/20 text-purple-300"
                            : levelDesign.engine === "unity"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                    >
                        {levelDesign.engine === "unreal"
                            ? "Unreal Engine"
                            : levelDesign.engine === "unity"
                                ? "Unity"
                                : "Roblox"}
                    </span>
                </div>
                <Link
                    to={`/level-designs/${levelDesign.id}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    See All Images
                    <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default function LevelDesignPage() {
    const [levelDesigns, setLevelDesigns] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        AOS.init({ once: false });
        fetchData();
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const data = await fetchLevelDesigns();
            setLevelDesigns(data);
        } catch (error) {
            console.error("Error fetching level designs:", error);
        }
    }, []);

    const filteredDesigns =
        activeFilter === "all"
            ? levelDesigns
            : levelDesigns.filter((ld) => ld.engine === activeFilter);

    return (
        <div className="min-h-screen bg-[#000714] text-white">
            {/* Header */}
            <div className="md:px-[10%] px-[5%] pt-24 pb-10">
                <Link
                    to="/#Portfolio"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Portfolio</span>
                </Link>

                <h1
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1659f5] to-[#14ace3] mb-4"
                    data-aos="fade-up"
                >
                    Level Design Portfolio
                </h1>
                <p className="text-slate-400 max-w-2xl" data-aos="fade-up">
                    Explore my level design work across different game engines. Each
                    project showcases unique environments and artistic vision.
                </p>
            </div>

            {/* Filter Buttons */}
            <div
                className="md:px-[10%] px-[5%] mb-8 flex flex-wrap gap-3"
                data-aos="fade-up"
            >
                {engines.map((engine) => (
                    <button
                        key={engine.id}
                        onClick={() => setActiveFilter(engine.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${activeFilter === engine.id
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                            }`}
                    >
                        {engine.label}
                    </button>
                ))}
            </div>

            {/* Level Designs Grid */}
            <div className="md:px-[10%] px-[5%] pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDesigns.map((levelDesign) => (
                        <LevelDesignCard key={levelDesign.id} levelDesign={levelDesign} />
                    ))}
                </div>

                {filteredDesigns.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        No level designs found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
}
