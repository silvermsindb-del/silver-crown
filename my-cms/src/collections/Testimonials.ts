import { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
    slug: 'testimonials',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
        create: () => true, // Public feedback
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            type: 'text',
        },
        {
            name: 'content',
            type: 'textarea',
            required: true,
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'rating',
            type: 'number',
            min: 1,
            max: 5,
            defaultValue: 5,
        },
    ],
}
