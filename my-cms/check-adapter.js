try {
    const { cloudinaryAdapter } = require('@payloadcms/plugin-cloud-storage/cloudinary');
    console.log('Adapter found:', !!cloudinaryAdapter);
} catch (e) {
    console.error('Adapter not found:', e.message);
}
