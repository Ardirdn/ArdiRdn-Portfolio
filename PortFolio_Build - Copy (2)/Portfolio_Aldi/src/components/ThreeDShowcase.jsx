import React, { useEffect } from 'react';
import FeaturedSection from './ThreeDShowcase/FeaturedSection';
import GallerySection from './ThreeDShowcase/GallerySection';
import threeDData from '../data/3d_assets.json';

const ThreeDShowcaseList = () => {
    return (

        <div className="w-full py-20 relative overflow-hidden" id="3d-showcase">
            {/* Background decoration removed for seamless look */}

            {/* Header */}
            <div className="relative z-10 text-center mb-16 px-4">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    3D Assets Showcase
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    A comprehensive collection of game-ready 3D assets, ranging from stylized characters to realistic PBR models.
                </p>
            </div>

            {/* Sections */}
            <div className="relative z-10">
                <FeaturedSection data={threeDData.categories} />
                <GallerySection data={threeDData.categories} />
            </div>
        </div>
    );
};

export default ThreeDShowcaseList;
