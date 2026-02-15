import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLevelDesignById } from "../services/dataService";
import { assetPath } from "../utils/assetPath";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowLeft, Calendar, Palette, Cpu } from "lucide-react";

export default function LevelDesignDetail() {
    const { id } = useParams();
    const [levelDesign, setLevelDesign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ once: false });
        fetchData();
    }, [id]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchLevelDesignById(id);
            setLevelDesign(data);
        } catch (error) {
            console.error("Error fetching level design:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#000714] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!levelDesign) {
        return (
            <div className="min-h-screen bg-[#000714] flex items-center justify-center">
                <div className="text-white text-xl">Level Design not found</div>
            </div>
        );
    }

    const allImages = levelDesign.images.map(
        (img) => assetPath(`${levelDesign.folder}/${img}`)
    );

    const getEngineColor = (engine) => {
        switch (engine) {
            case "unreal":
                return "bg-purple-500/20 text-purple-300 border-purple-500/30";
            case "unity":
                return "bg-green-500/20 text-green-300 border-green-500/30";
            case "roblox":
                return "bg-red-500/20 text-red-300 border-red-500/30";
            default:
                return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        }
    };

    const getEngineName = (engine) => {
        switch (engine) {
            case "unreal":
                return "Unreal Engine";
            case "unity":
                return "Unity";
            case "roblox":
                return "Roblox Studio";
            default:
                return engine;
        }
    };

    return (
        <div className="min-h-screen bg-[#000714] text-white">
            {/* Header */}
            <div className="md:px-[10%] px-[5%] pt-24 pb-10">
                <Link
                    to="/level-designs"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Level Designs</span>
                </Link>

                <h1
                    className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1659f5] to-[#14ace3] mb-4"
                    data-aos="fade-up"
                >
                    {levelDesign.title}
                </h1>

                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-3 mb-6" data-aos="fade-up">
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getEngineColor(levelDesign.engine)}`}
                    >
                        <Cpu size={16} />
                        <span className="text-sm font-medium">
                            {getEngineName(levelDesign.engine)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">
                            {levelDesign.year || "2024"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-amber-500/20 text-amber-300 border-amber-500/30">
                        <Palette size={16} />
                        <span className="text-sm font-medium">
                            {levelDesign.style || "Realistic"}
                        </span>
                    </div>
                </div>

                <p className="text-slate-400 max-w-3xl text-lg" data-aos="fade-up">
                    {levelDesign.description ||
                        "A detailed environment showcasing level design skills and artistic vision."}
                </p>
            </div>

            {/* Images Gallery */}
            <div className="w-full md:px-[10%] px-[5%] pb-20">
                <div className="mb-6">
                    <h2
                        className="text-2xl font-semibold text-white"
                        data-aos="fade-up"
                    >
                        Gallery ({allImages.length} Images)
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                    {allImages.map((img, index) => (
                        <div
                            key={index}
                            className="w-full aspect-video overflow-hidden relative group"
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                        >
                            <img
                                src={img}
                                alt={`${levelDesign.title} - Image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer>
                <center>
                    <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
                    <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                        This website was built using{" "}
                        <a
                            className="opacity-30 duration-300 transition-all hover:opacity-50"
                            href="https://github.com/EkiZR/Portofolio_V5/"
                        >
                            EkiZR's
                        </a>{" "}
                        website template.
                    </span>
                </center>
            </footer>
        </div>
    );
}
