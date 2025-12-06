import React, { useState } from 'react';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Image = ({ src, alt, width, height, className, priority = false }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Generate responsive srcSet
    // We can generate 3 sizes: small (sw), medium (md), large (lg)
    const smUrl = getCloudinaryUrl(src, { width: 640 });
    const mdUrl = getCloudinaryUrl(src, { width: 1024 });
    const lgUrl = getCloudinaryUrl(src, { width: 1920 });

    const srcSet = `${smUrl} 640w, ${mdUrl} 1024w, ${lgUrl} 1920w`;

    return (
        <div className={clsx("relative overflow-hidden bg-gray-100", className)} style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}>
            <motion.img
                src={getCloudinaryUrl(src, { width: 1200 })} // Default fallack
                srcSet={srcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={alt || "Jewelry Image"}
                loading={priority ? "eager" : "lazy"}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                onLoad={() => setIsLoaded(true)}
                className="w-full h-full object-cover"
            />
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
};

export default Image;
