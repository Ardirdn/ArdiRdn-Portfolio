import React from 'react';
import { useParams, Link } from 'react-router-dom';
import rawThreeDData from '../../data/3d_assets.json';
import { transformAssetPaths } from '../../utils/assetPath';
import PackCard from '../../components/ThreeDShowcase/PackCard';

const threeDData = transformAssetPaths(rawThreeDData);

const CategoryPage = () => {
    const { categoryId } = useParams();
    const category = threeDData.categories.find(c => c.id === categoryId);

    if (!category) return <div className="text-white text-center py-20">Category not found</div>;

    // Flatten packs (though category.packs is already the list)
    const packs = category.packs.map(p => ({ ...p, categoryId: category.id }));

    return (
        <div className="min-h-screen bg-[#000714] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="text-slate-400 hover:text-white mb-8 inline-block">&larr; Back to Home</Link>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{category.name}</h1>
                <p className="text-slate-400 max-w-2xl mb-12">{category.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packs.map(pack => (
                        <PackCard key={pack.id} pack={pack} categoryId={category.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
