import { cloudinaryStorage } from 'payload-cloudinary'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Enquiries } from './collections/Enquiries'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Banners } from './collections/Banners'
import { Pages } from './collections/Pages'
import { Testimonials } from './collections/Testimonials'
import { Orders } from './collections/Orders'
import { GlobalData } from './globals/GlobalData'

import { ShippingMethods } from './collections/ShippingMethods'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Enquiries, Banners, Pages, Testimonials, Orders, ShippingMethods],
  globals: [GlobalData],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000',
  cors: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://silver-crown-silvers-projects-e5cb6465.vercel.app',
    'https://silver-crown-git-main-silvers-projects-e5cb6465.vercel.app',
    'https://silver-crown-i2vylc686-silvers-projects-e5cb6465.vercel.app',
    'https://www.silvercrowncreation.com/',
    ...(process.env.PAYLOAD_PUBLIC_FRONTEND_URL || '').split(',').filter(Boolean).map((url) => url.trim().replace(/\/$/, '')), // Support multiple comma-separated URLs, and strip trailing slashes
  ],
  csrf: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://silver-crown-silvers-projects-e5cb6465.vercel.app',
    'https://silver-crown-git-main-silvers-projects-e5cb6465.vercel.app',
    'https://silver-crown-i2vylc686-silvers-projects-e5cb6465.vercel.app',
    'https://www.silvercrowncreation.com/',
    ...(process.env.PAYLOAD_PUBLIC_FRONTEND_URL || '').split(',').filter(Boolean).map((url) => url.trim().replace(/\/$/, '')), // Support multiple comma-separated URLs, and strip trailing slashes
  ],
  sharp,
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true,
      },
      config: {
        cloud_name: process.env.CLOUDINARY_NAME || '',
        api_key: process.env.CLOUDINARY_KEY || '',
        api_secret: process.env.CLOUDINARY_SECRET || '',
      },
    }),
  ],
})
