/**
 * Optimizes a Cloudinary URL with transformations
 * @param {string} url - The original image URL
 * @param {object} options - Transformation options (width, height, quality, format)
 * @returns {string} - The optimized URL
 */
export const getCloudinaryUrl = (url, { width } = {}) => {
    if (!url) return '';
    if (!url.includes('cloudinary.com')) return url; // specific check

    // Default transformations
    const params = ['f_auto', 'q_auto'];

    if (width) {
        params.push(`w_${width}`);
    }

    // Insert params after /upload/
    const parts = url.split('/upload/');
    if (parts.length === 2) {
        return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`;
    }

    return url;
};
