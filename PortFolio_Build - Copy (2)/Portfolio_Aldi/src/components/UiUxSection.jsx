import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import uiuxData from '../data/uiux_data.json';

const UiUxSection = () => {
    // Specific images requested by the user for the 7-grid layout
    const targetImages = [
        "/assets/Ui Ux/JuraganNasiPadang/Asset 37.webp",
        "/assets/Ui Ux/DetainedSouls/MainMenu1.webp",
        "/assets/Ui Ux/JuraganEmpang/Banner.webp",
        "/assets/Ui Ux/TheDeathPath/Asset 4.webp",
        "/assets/Ui Ux/JuraganFauna/JuraganFaunaBanner.webp",
        "/assets/Ui Ux/LegendaryFIshHunter/Asset 25.webp",
        "/assets/Ui Ux/DropStackBall/Asset 1.webp"
    ];

    const displayItems = useMemo(() => {
        // Map target images to their project data
        return targetImages.map(imgSrc => {
            const project = uiuxData.find(p => p.images.includes(imgSrc));
            return {
                src: imgSrc,
                title: project ? project.title : "UI/UX Design"
            };
        });
    }, []);

    return (
        <div className="w-full py-20" id="UiUx">
            {/* Header */}
            <div className="flex flex-col items-center justify-center mb-10 text-center" data-aos="fade-up">
                <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#cebdfc] to-[#ffffff] mb-6">
                    UI/UX Gallery
                </h3>
                <p className="text-slate-400 max-w-2xl text-lg">
                    A curated collection of user interfaces and experiences designed for various games and applications.
                </p>
            </div>

            {/* 
                Custom 7-Grid Layout 
                Based on user sketch:
                Row 1: [1 (2x2)] [2 (3x2)] [3 (2x2)]
                Row 2: [4 (2x2)] [5 (1x1)] [6 (1x1)] [7 (3x1)]  <-- Adjusted to fit 7 cols total or similar ratio
                
                Let's use a 12-column grid for flexibility.
                Row 1:
                - Img 1: col-span-3 (approx 25%)
                - Img 2: col-span-6 (approx 50%)
                - Img 3: col-span-3 (approx 25%)
                Height: h-[250px]
                
                Row 2:
                - Img 4: col-span-4 (approx 33%) -> Big square-ish
                - Img 5: col-span-2 (approx 16%) -> Small
                - Img 6: col-span-2 (approx 16%) -> Small
                - Img 7: col-span-4 (approx 33%) -> Wide
                Height: h-[250px]
            */}

            <div className="max-w-7xl mx-auto px-4 md:px-10 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Row 1 - Height 250px */}
                    <div className="md:col-span-3 h-[200px] md:h-[250px] relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900" data-aos="fade-right" data-aos-delay="100">
                        <img src={displayItems[0].src} alt={displayItems[0].title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2"><span className="text-white font-bold text-center">{displayItems[0].title}</span></div>
                    </div>

                    <div className="md:col-span-6 h-[200px] md:h-[250px] relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900" data-aos="fade-down" data-aos-delay="200">
                        <img src={displayItems[1].src} alt={displayItems[1].title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2"><span className="text-white font-bold text-center">{displayItems[1].title}</span></div>
                    </div>

                    <div className="md:col-span-3 h-[200px] md:h-[250px] relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900" data-aos="fade-left" data-aos-delay="300">
                        <img src={displayItems[2].src} alt={displayItems[2].title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2"><span className="text-white font-bold text-center">{displayItems[2].title}</span></div>
                    </div>

                    {/* Row 2 - Height 250px */}
                    <div className="md:col-span-4 h-[200px] md:h-[250px] relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900" data-aos="fade-up-right" data-aos-delay="400">
                        <img src={displayItems[3].src} alt={displayItems[3].title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2"><span className="text-white font-bold text-center">{displayItems[3].title}</span></div>
                    </div>

                    <div className="md:col-span-2 h-[200px] md:h-[250px] relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900" data-aos="fade-up" data-aos-delay="500">
                        <img src={displayItems[4].src} alt={displayItems[4].title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2"><span className="text-white font-bold text-xs md:text-sm text-center">{displayItems[4].title}</span></div>
                    </div>

                    <div className="md:col-span-2 h-[200px] md:h-[250px] relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900" data-aos="fade-up" data-aos-delay="600">
                        <img src={displayItems[5].src} alt={displayItems[5].title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2"><span className="text-white font-bold text-xs md:text-sm text-center">{displayItems[5].title}</span></div>
                    </div>

                    <div className="md:col-span-4 h-[200px] md:h-[250px] relative rounded-xl overflow-hidden group border border-white/10 bg-slate-900" data-aos="fade-up-left" data-aos-delay="700">
                        <img src={displayItems[6].src} alt={displayItems[6].title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2"><span className="text-white font-bold text-center">{displayItems[6].title}</span></div>
                    </div>

                </div>
            </div>

            {/* See All Button */}
            <div className="flex justify-center" data-aos="fade-up">
                <Link
                    to="/ui-ux"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white font-medium transition-all hover:scale-105"
                >
                    View All Collections
                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default UiUxSection;
