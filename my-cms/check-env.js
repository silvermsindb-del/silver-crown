import dotenv from 'dotenv';
dotenv.config();

console.log('Checking Cloudinary Environment Variables:');
console.log('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME ? 'Set' : 'Missing');
console.log('CLOUDINARY_KEY:', process.env.CLOUDINARY_KEY ? 'Set' : 'Missing');
console.log('CLOUDINARY_SECRET:', process.env.CLOUDINARY_SECRET ? 'Set' : 'Missing');

if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET) {
    console.log('All Cloudinary variables are present.');
} else {
    console.error('Some Cloudinary variables are missing. Please check your .env file.');
}
