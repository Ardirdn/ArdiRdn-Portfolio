import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import uiuxData from '../data/uiux_data.json';
import Navbar from '../components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const UiUxDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const found = uiuxData.find(p => p.id === id);
        setProject(found);
    }, [id]);

    useEffect(() => {
        AOS.init();
    }, []);

    if (!project) {
        return (
            <div className="min-h-screen bg-[#000714] flex items-center justify-center text-white">
                <p className="text-xl">Project not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000714] text-white">
            <Navbar />

            <div className="pt-32 px-[5%] md:px-[10%] pb-20 max-w-[1920px] mx-auto">
                <Link to="/ui-ux" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <ArrowLeft size={20} />
                    Back to Collections
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#cebdfc] to-[#ffffff] mb-12" data-aos="fade-up">
                    {project.title}
                </h1>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {project.images.map((img, index) => (
                        <div key={index} className="break-inside-avoid rounded-xl overflow-hidden group relative hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500" data-aos="fade-up" data-aos-delay={index * 50}>
                            <img
                                src={img}
                                alt={`${project.title} - ${index}`}
                                className="w-full h-auto object-contain bg-[#1a1a1a]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 ring-1 ring-white/10 rounded-xl pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UiUxDetail;
