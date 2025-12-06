import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function debugProduct() {
    console.log(`Debugging Product Data from ${API_URL}...`);
    try {
        // Fetch all products to get a sample
        const response = await axios.get(`${API_URL}/products`);
        const products = response.data.docs;

        if (!products || products.length === 0) {
            console.log('⚠️ No products found in the database.');
            return;
        }

        const sample = products[0];
        console.log('✅ Sample Product Found:', sample.title);
        console.log('--- RAW PRODUCT JSON ---');
        console.log(JSON.stringify(sample, null, 2));
        console.log('------------------------');

        // Check specifically for slug
        if (sample.slug) {
            console.log(`Testing Slug Query: ${sample.slug}`);
            // Test the exact query usage in frontend
            // In services/products.js we used: params: { where: { slug: { equals: slug } } }
            // Axios serializes this locally. Let's see if we can replicate the axios call exactly.

            try {
                // Mimicking query string standard for Payload
                // usually: ?where[slug][equals]=value
                const slugUrl = `${API_URL}/products?where[slug][equals]=${sample.slug}`;
                console.log(`Fetching: ${slugUrl}`);
                const slugRes = await axios.get(slugUrl);
                console.log('✅ Slug Query Result Count:', slugRes.data.docs.length);
            } catch (err) {
                console.error('❌ Slug Query Failed:', err.message);
            }
        } else {
            console.error('❌ Product has no slug field!');
        }

    } catch (error) {
        console.error('❌ Debug Failed:', error.message);
    }
}

debugProduct();
