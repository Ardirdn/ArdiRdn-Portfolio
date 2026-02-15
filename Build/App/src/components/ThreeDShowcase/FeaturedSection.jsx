import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedCard = ({ title, description, video, link, align = 'left', categoryId, aspectRatio = 'aspect-video' }) => {
    return (
        <div className={`flex flex-col md:flex-row items-center gap-8 mb-24 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
            data-aos="fade-up"
        >
            {/* Content Side */}
            <div className={`flex-1 text-left ${align === 'right' ? 'md:pl-10' : 'md:pr-10'}`}>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {title}
                </h3>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                    {description}
                </p>
                <Link
                    to={`/3d-assets/${categoryId}`}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    See All
                    <ArrowRight size={20} />
                </Link>
            </div>

            {/* Media Side */}
            <div className={`flex-1 w-full ${aspectRatio} flex items-center justify-center relative`}>
                {/* Background glow effect behind the model */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-[80px] opacity-60" />

                {video ? (
                    <video
                        src={video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain relative z-10"
                        style={{
                            backgroundColor: 'transparent',
                            transform:
                                categoryId === 'stylized-character' ? 'scale(0.8)' :
                                    categoryId === 'other' ? 'scale(0.9)' : 'none'
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 bg-white/5 rounded-xl border border-white/10">
                        No Preview
                    </div>
                )}
            </div>
        </div>
    );
};

const FeaturedSection = ({ data }) => {
    const pbr = data.find(c => c.id === 'pbr');
    const stylized = data.find(c => c.id === 'stylized-character');
    const other = data.find(c => c.id === 'other');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12 relative z-10">
            {pbr && (
                <FeaturedCard
                    title={pbr.name}
                    description={pbr.description}
                    video={pbr.featuredVideo}
                    align="left"
                    link="/3d-assets/pbr"
                    categoryId={pbr.id}
                    aspectRatio="aspect-video"
                />
            )}
            {stylized && (
                <FeaturedCard
                    title={stylized.name}
                    description={stylized.description}
                    video={stylized.featuredVideo}
                    align="right"
                    link="/3d-assets/stylized-character"
                    categoryId={stylized.id}
                    aspectRatio="aspect-square"
                />
            )}
            {other && (
                <FeaturedCard
                    title={other.name}
                    description={other.description}
                    video={other.featuredVideo}
                    align="left"
                    link="/3d-assets/other"
                    categoryId={other.id}
                    aspectRatio="aspect-square"
                />
            )}
        </div>
    );
};

export default FeaturedSection;
