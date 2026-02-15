import React from 'react';
import { useParams, Link } from 'react-router-dom';
import rawThreeDData from '../../data/3d_assets.json';
import { transformAssetPaths } from '../../utils/assetPath';

const threeDData = transformAssetPaths(rawThreeDData);

const ItemPage = () => {
    const { categoryId, packId, itemId } = useParams();
    const category = threeDData.categories.find(c => c.id === categoryId);
    const pack = category?.packs.find(p => p.id === packId);
    const item = pack?.items.find(i => i.id === itemId);

    if (!item) return <div className="text-white text-center py-20">Item not found</div>;

    const webms = item.webms || {};
    // Ensure consistent order: MaterialPreview, Normal, Solid, Textured
    const orderedKeys = ['MaterialPreview', 'Normal', 'Solid', 'Textured'];

    // Generate 3View image paths based on assuming cover follows naming convention
    // e.g., ..._MaterialPreview.png -> ..._Normal.png
    // If cover is not found or doesn't match standard, we might have issues.
    // However, for this task we assume the structure holds as per JSON.

    const get3ViewPath = (key) => {
        if (!item.cover) return null;
        // Key mapping to filename suffix part if needed, but usually they match key name
        // MaterialPreview -> MaterialPreview
        // Normal -> Normal
        // Solid -> Solid
        // Textured -> Textured

        // Replace 'MaterialPreview' in cover path with current key
        // Note: Cover usually is MaterialPreview or Solid_Wireframe in some cases.
        // Let's try to replace the known suffix.

        // Check if cover has 'MaterialPreview'
        if (item.cover.includes('MaterialPreview')) {
            return item.cover.replace('MaterialPreview', key);
        }
        // Check if cover has 'Solid_Wireframe' (common in Stylized)
        if (item.cover.includes('Solid_Wireframe')) {
            if (key === 'Solid') return item.cover; // Keep as is? Or maybe replace?
            // If key is Textured, replace Solid_Wireframe with Textured?
            // Let's assume consistent naming: Name_3View_SUFFIX.png
            return item.cover.replace('Solid_Wireframe', key === 'MaterialPreview' ? 'MaterialPreview' : key);
            // Note: if key is Solid, it might just be Solid? or Solid_Wireframe?
            // User requested "normal, solid, serta textured".
            // If the file on disk is Solid_Wireframe, we should use that.
        }

        // Fallback: simple replace if possible, or just return cover for MaterialPreview slot
        return key === 'MaterialPreview' ? item.cover : item.cover.replace(/MaterialPreview|Solid_Wireframe/g, key);
    };

    return (
        <div className="min-h-screen bg-[#000714] py-20 px-4">
            <div className="max-w-[1920px] mx-auto">
                {/* Navigation Breadcrumb */}
                {/* Header with Back Button and Breadcrumb */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 max-w-7xl mx-auto px-4">
                    {/* Back Button */}
                    <Link
                        to={`/3d-assets/${categoryId}/${packId}`}
                        className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors self-start md:self-auto"
                    >
                        <span>&larr;</span> Back
                    </Link>

                    {/* Breadcrumb */}
                    <div className="flex gap-2 text-sm text-slate-400">
                        <Link to={`/3d-assets/${categoryId}`} className="hover:text-white">{category.name}</Link>
                        <span>/</span>
                        <Link to={`/3d-assets/${categoryId}/${packId}`} className="hover:text-white">{pack.name}</Link>
                        <span>/</span>
                        <span className="text-white">{item.name}</span>
                    </div>
                </div>

                {/* Content Layout - Only for Stylized/Other with WebMs */}
                {Object.keys(webms).length > 0 ? (
                    <div className="flex flex-col gap-0 w-full">
                        {/* Row 1: 4 WebMs */}
                        <div className="grid grid-cols-4 w-full gap-0">
                            {orderedKeys.map(key => (
                                <div key={`webm-${key}`} className="aspect-square w-full relative">
                                    {webms[key] ? (
                                        <video
                                            src={webms[key]}
                                            className="w-full h-full object-contain"
                                            style={{ backgroundColor: 'transparent' }}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-transparent" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Row 2: 4 Images (3 View) */}
                        <div className="grid grid-cols-4 w-full gap-0">
                            {orderedKeys.map(key => {
                                const imgPath = get3ViewPath(key);
                                return (
                                    <div key={`img-${key}`} className="w-full">
                                        {imgPath ? (
                                            <img
                                                src={imgPath}
                                                alt={`${key} 3View`}
                                                className="w-full h-auto object-contain"
                                                onError={(e) => e.target.style.display = 'none'} // Hide if missing
                                            />
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Fallback for PBR or items without standard WebMs */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                        {item.images && item.images.map((img, idx) => (
                            <div key={idx} className="w-full">
                                <img src={img} alt="" className="w-full h-auto object-contain" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemPage;
