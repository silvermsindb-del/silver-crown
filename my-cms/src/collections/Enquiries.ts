import { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
    slug: 'enquiries',
    access: {
        create: () => true, // Public can create
        read: ({ req: { user } }) => Boolean(user), // Only admin can read
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => Boolean(user),
    },
    admin: {
        useAsTitle: 'email',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'phone',
            type: 'text',
            required: true,
        },
        {
            name: 'productName',
            type: 'text',
            label: 'Product Name (Optional)',
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            label: 'Reference Image',
        },
    ],
}
