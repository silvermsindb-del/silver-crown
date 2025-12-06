import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user, // Allow logged-in users to upload
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false, // Make optional to avoid 400 errors if missing
    },
  ],
  upload: true,
}
