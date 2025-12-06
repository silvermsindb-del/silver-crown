import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
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
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'layout',
            type: 'blocks',
            blocks: [
                {
                    slug: 'hero',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                        },
                        {
                            name: 'subtitle',
                            type: 'text',
                        },
                        {
                            name: 'image',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'ctaText',
                            type: 'text',
                        },
                        {
                            name: 'ctaLink',
                            type: 'text',
                        },
                    ],
                },
                {
                    slug: 'content',
                    fields: [
                        {
                            name: 'content',
                            type: 'richText',
                        },
                    ],
                },
                {
                    slug: 'featuredProducts',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                        },
                        {
                            name: 'count',
                            type: 'number',
                            defaultValue: 4,
                        },
                    ],
                },
                {
                    slug: 'testimonials',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                        },
                        {
                            name: 'count',
                            type: 'number',
                            defaultValue: 3,
                        },
                    ],
                },
            ],
        },
        {
            name: 'meta',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
}
