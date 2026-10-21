import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { VideoFrame, VideoLightbox } from "../components/VideoShowcase";
import { findSystem, systemClip } from "../services/systems";

/** One system in full: the complete recording plus its write-up. */
const SystemDetail = () => {
    const { id } = useParams();
    const item = findSystem(id);
    const [clip, setClip] = useState(null);

    useEffect(() => {
        AOS.init();
        window.scrollTo(0, 0);
    }, [id]);

    if (!item) {
        return (
            <div className="min-h-screen bg-[#000714] text-white">
                <Navbar />
                <div className="pt-40 text-center">
                    <p className="text-xl mb-6">System not found</p>
                    <Link to="/systems" className="text-emerald-200 hover:text-white underline">
                        Back to all systems
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000714] text-white">
            <Navbar />

            <div className="pt-32 px-[5%] md:px-[10%] pb-20 max-w-[1400px] mx-auto">
                <Link
                    to="/systems"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"
                >
                    <ArrowLeft size={20} />
                    All Systems
                </Link>

                <h1
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9df5c8] to-[#ffffff] mb-2"
                    data-aos="fade-up"
                >
                    {item.title}
                </h1>
                <p className="text-slate-500 text-xs font-mono mb-8" data-aos="fade-up">
                    {item.duration}
                </p>

                {/* The page plays the full recording, not the card's short cut. */}
                <div
                    className="rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-10"
                    data-aos="fade-up"
                    data-aos-duration="1200"
                >
                    <VideoFrame
                        src={item.src}
                        poster={item.poster}
                        duration={item.duration}
                        onExpand={() => setClip(systemClip(item))}
                        className="aspect-video w-full"
                    />
                </div>

                <div className="max-w-3xl" data-aos="fade-up">
                    <p className="text-slate-400 text-base leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </div>

            <VideoLightbox clip={clip} onClose={() => setClip(null)} />
        </div>
    );
};

export default SystemDetail;
