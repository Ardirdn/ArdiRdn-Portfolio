import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PackCard = ({ pack, categoryId }) => {
    return (
        <div className="flex flex-col gap-4 group">
            {/* Title */}
            <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                {pack.name}
            </h4>

            {/* Main Image - Transparent Background */}
            <div className="aspect-video w-full overflow-hidden rounded-xl relative">
                <img
                    src={pack.cover}
                    alt={pack.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Button - Right Aligned */}
            <div className="flex justify-end">
                <Link
                    to={categoryId === 'pbr' && pack.items.length === 1
                        ? `/3d-assets/${categoryId}/${pack.id}/${pack.items[0].id}`
                        : `/3d-assets/${categoryId}/${pack.id}`
                    }
                    className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all hover:pr-8 duration-300"
                >
                    See All
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
};

export default PackCard;
