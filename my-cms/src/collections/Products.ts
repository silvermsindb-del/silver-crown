import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'price',
            type: 'number',
            required: true,
        },
        {
            name: 'material',
            type: 'select',
            options: [
                { label: 'Gold', value: 'gold' },
                { label: 'Silver', value: 'silver' },
                { label: 'Rose Gold', value: 'rose_gold' },
            ],
            defaultValue: 'gold',
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'sizes',
            type: 'select',
            hasMany: true,
            options: [
                { label: 'US 5', value: '5' },
                { label: 'US 6', value: '6' },
                { label: 'US 7', value: '7' },
                { label: 'US 8', value: '8' },
                { label: 'US 9', value: '9' },
                { label: '16 inch', value: '16_inch' },
                { label: '18 inch', value: '18_inch' },
                { label: '20 inch', value: '20_inch' },
                { label: 'One Size', value: 'one_size' },
            ],
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'description',
            type: 'richText',
        },
        {
            name: 'images',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: false,
        },
        {
            name: 'related_products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
        {
            name: 'isFeatured',
            type: 'checkbox',
            label: 'Show in Featured Collection',
            defaultValue: false,
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'stock',
            type: 'number',
            required: true,
            defaultValue: 10,
            admin: {
                position: 'sidebar',
                description: 'Quantity in stock',
            }
        },
    ],
}
