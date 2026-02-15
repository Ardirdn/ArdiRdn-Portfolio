import React from 'react';
import { assetPath } from '../utils/assetPath';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import uiuxData from '../data/uiux_data.json';
import Navbar from '../components/Navbar';

const UiUxPage = () => {
    return (
        <div className="min-h-screen bg-[#000714] text-white">
            <Navbar />

            <div className="pt-32 px-[5%] md:px-[10%] pb-20 max-w-[1920px] mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10">
                    <ArrowLeft size={20} />
                    Back to Portfolio
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#cebdfc] to-[#ffffff] mb-12" data-aos="fade-up">
                    UI/UX Collections
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uiuxData.map((project, index) => (
                        <div key={project.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:bg-white/10 hover:-translate-y-2" data-aos="fade-up" data-aos-delay={index * 100}>
                            {/* Card Cover */}
                            <div className="aspect-video overflow-hidden relative">
                                <img
                                    src={assetPath(project.images[0])}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                            </div>

                            {/* Card Body */}
                            <div className="p-6 relative">
                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#14ace3] transition-colors">{project.title}</h2>
                                <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#14ace3]"></span>
                                    {project.images.length} Design Screens
                                </p>

                                <Link
                                    to={`/ui-ux/${project.id}`}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-[#14ace3] rounded-lg text-white font-medium transition-all duration-300"
                                >
                                    See All Images
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UiUxPage;
