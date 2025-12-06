import axios from 'axios';

const API_URL = 'http://localhost:3005/api';

async function testConnection() {
    console.log(`Testing connection to ${API_URL}...`);
    try {
        // Test 1: Health check / basic fetch
        console.log('Fetching Products...');
        const products = await axios.get(`${API_URL}/products`);
        console.log('✅ Products Fetch Success:', products.status);
        console.log('Count:', products.data.totalDocs || products.data.docs?.length);

        // Test 2: Categories
        console.log('Fetching Categories...');
        const categories = await axios.get(`${API_URL}/categories`);
        console.log('✅ Categories Fetch Success:', categories.status);
        console.log('Count:', categories.data.totalDocs || categories.data.docs?.length);

    } catch (error) {
        console.error('❌ Connection Failed');
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: Connection Refused. Is the backend running on port 3005?');
        } else if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testConnection();
