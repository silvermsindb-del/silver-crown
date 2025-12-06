const axios = require('axios');

async function checkMedia() {
    try {
        const response = await axios.get('http://localhost:3005/api/media');
        console.log('Media items:', JSON.stringify(response.data.docs, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkMedia();
