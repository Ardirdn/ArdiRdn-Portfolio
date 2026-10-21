import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cross-fading image slideshow, the same one the landing page's featured level
 * design block uses. Pulled out into its own file so the Roblox page can show
 * that layout without a third copy of it.
 */
const Carousel = ({ images, interval = 4000, alt = "" }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return undefined;
        const timer = setInterval(
            () => setIndex((prev) => (prev + 1) % images.length),
            interval
        );
        return () => clearInterval(timer);
    }, [images.length, interval]);

    if (!images.length) return null;

    return (
        <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={index}
                    src={images[index]}
                    alt={alt}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            </AnimatePresence>
        </div>
    );
};

export default Carousel;
