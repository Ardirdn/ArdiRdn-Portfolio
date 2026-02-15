import React, { useState } from 'react';
import PackCard from './PackCard';
import AOS from 'aos';

const GallerySection = ({ data }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(3);

    // Flatten all packs
    const allPacks = data.flatMap(cat =>
        cat.packs.map(pack => ({ ...pack, categoryId: cat.id, categoryName: cat.name }))
    );

    // Custom gallery ordering: lower number = appears first
    const galleryPriority = {
        'basarnas-helicopter': 1,
        'lolplay': 2,
        'boxycharacters': 3,
    };

    const sortedPacks = [...allPacks].sort((a, b) => {
        const prioA = galleryPriority[a.id] ?? 999;
        const prioB = galleryPriority[b.id] ?? 999;
        return prioA - prioB;
    });

    const filteredPacks = activeFilter === 'all'
        ? sortedPacks
        : sortedPacks.filter(p => p.categoryId === activeFilter);

    const filters = [
        { id: 'all', label: 'All Assets' },
        { id: 'pbr', label: 'PBR' },
        { id: 'stylized-character', label: 'Stylized Characters' },
        { id: 'other', label: 'Other Assets' }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 pb-20">
            <h3
                className="text-3xl md:text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"
                data-aos="fade-up"
            >
                3D Assets Gallery
            </h3>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-10" data-aos="fade-up">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => {
                            setActiveFilter(filter.id);
                            setVisibleCount(3);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${activeFilter === filter.id
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                data-aos="fade-up"
                data-aos-duration="1000"
            >
                {filteredPacks.slice(0, visibleCount).map((pack) => (
                    <PackCard key={pack.id} pack={pack} categoryId={pack.categoryId} />
                ))}
            </div>

            {/* Pagination Buttons */}
            {(visibleCount < filteredPacks.length || visibleCount > 3) && (
                <div className="flex justify-center gap-4 mt-12" data-aos="fade-up">
                    {visibleCount < filteredPacks.length && (
                        <button
                            onClick={() => setVisibleCount(prev => prev + 3)}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-semibold transition-all hover:scale-105"
                        >
                            Show More +
                        </button>
                    )}

                    {visibleCount > 3 && (
                        <button
                            onClick={() => setVisibleCount(3)}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-red-400 border border-white/10 rounded-full font-semibold transition-all hover:scale-105 hover:bg-red-500/10 hover:border-red-500/30"
                        >
                            Show Less -
                        </button>
                    )}
                </div>
            )}

            {filteredPacks.length === 0 && (
                <div className="text-center text-slate-500 py-10">
                    No assets found in this category.
                </div>
            )}
        </div>
    );
};

export default GallerySection;
