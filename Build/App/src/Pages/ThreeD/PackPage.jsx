import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import rawThreeDData from '../../data/3d_assets.json';
import { transformAssetPaths } from '../../utils/assetPath';
import { ArrowRight } from 'lucide-react';

const threeDData = transformAssetPaths(rawThreeDData);

const ItemCard = ({ item, link }) => {
    // Determine the preview source: Weighted towards Textured WebM
    const previewWebm = item.webms?.Textured || Object.values(item.webms || {})[0];

    return (
        <div className="flex flex-col gap-4 group">
            {/* Title */}
            <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                {item.name}
            </h4>

            {/* Preview - Square 1:1 with WebM */}
            <div className="aspect-square w-full rounded-xl overflow-hidden relative bg-transparent">
                {previewWebm ? (
                    <video
                        src={previewWebm}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        style={{ backgroundColor: 'transparent' }}
                    />
                ) : (
                    <img src={item.cover} alt={item.name} className="w-full h-full object-contain" />
                )}
            </div>

            {/* Button */}
            <div className="flex justify-end">
                <Link
                    to={link}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all hover:pr-8 duration-300"
                >
                    See all Images
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
};

const PackPage = () => {
    const { categoryId, packId } = useParams();
    const category = threeDData.categories.find(c => c.id === categoryId);
    const pack = category?.packs.find(p => p.id === packId);

    const [visibleCount, setVisibleCount] = useState(6);

    if (!pack) return <div className="text-white text-center py-20">Pack not found</div>;

    const displayedItems = pack.items.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-[#000714] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <Link to={`/3d-assets/${categoryId}`} className="text-slate-400 hover:text-white mb-8 inline-block">&larr; Back to {category.name}</Link>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">{pack.name} Collection</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {displayedItems.map(item => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            link={`/3d-assets/${categoryId}/${packId}/${item.id}`}
                        />
                    ))}
                </div>

                {visibleCount < pack.items.length && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
                        >
                            See More ({pack.items.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackPage;
