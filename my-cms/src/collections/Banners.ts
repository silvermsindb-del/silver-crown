import { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
    slug: 'banners',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'active', 'order'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'subtitle',
            type: 'textarea',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'mobileImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Optional: Upload a portrait image for mobile devices',
            }
        },
        {
            name: 'buttonText',
            type: 'text',
        },
        {
            name: 'buttonLink',
            type: 'text',
        },
        {
            name: 'contentPosition',
            type: 'select',
            options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
            ],
            defaultValue: 'center',
            admin: {
                description: 'Horizontal alignment of the text',
            }
        },
        {
            name: 'active',
            type: 'checkbox',
            defaultValue: true,
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 0,
        },
    ],
}
