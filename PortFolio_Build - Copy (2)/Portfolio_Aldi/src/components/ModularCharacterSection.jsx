
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const ModularCharacterSection = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const featuredImages = [
        "/assets/ModularCharacterShowcase/Featured1.png",
        "/assets/ModularCharacterShowcase/Featured2.png",
        "/assets/ModularCharacterShowcase/Featured3.png",
        "/assets/ModularCharacterShowcase/Featured4.png"
    ];

    return (
        <div className="w-full flex flex-col items-center justify-center mb-20 text-left px-4 md:px-0">
            <h3
                className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center"
                data-aos="fade-up"
                data-aos-duration="1000"
            >
                Modular Character Workflow
            </h3>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Side - Description */}
                <div
                    className="lg:col-span-7 flex flex-col justify-center h-full space-y-6"
                    data-aos="fade-right"
                    data-aos-duration="1200"
                >
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Experience a revolutionary Modular Character Workflow designed for scalability and performance.
                        Utilizing atlas texturing and a shared armature system, this workflow allows for the creation
                        of thousands of unique NPC variations from a single set of assets. Optimized for games,
                        it ensures visual variety without compromising performance.
                    </p>

                    <div className="pt-4">
                        <Link
                            to="/modular-character"
                            className="inline-flex items-center gap-2 text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
                        >
                            See Details
                            <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Right Side - Video and Featured Images */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Main Video */}
                    <div
                        className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 relative bg-black/50"
                        style={{ aspectRatio: "16/9" }}
                        data-aos="fade-left"
                        data-aos-duration="1200"
                    >
                        <ReactPlayer
                            url="/assets/ModularCharacterShowcase/Showcase_Scripts.mp4"
                            width="100%"
                            height="100%"
                            playing={true}
                            muted={true}
                            loop={true}
                            controls={false}
                        />
                    </div>

                    {/* Featured Images Grid */}
                    <div
                        className="grid grid-cols-4 gap-4"
                        data-aos="fade-up"
                        data-aos-duration="1400"
                        data-aos-delay="200"
                    >
                        {featuredImages.map((img, index) => (
                            <div
                                key={index}
                                className="relative rounded-lg overflow-hidden border border-white/10 aspect-square group cursor-pointer"
                            >
                                <img
                                    src={img}
                                    alt={`Featured ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModularCharacterSection;
