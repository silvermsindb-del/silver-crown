import { GlobalConfig } from 'payload'

export const GlobalData: GlobalConfig = {
    slug: 'global-data',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'header',
            type: 'group',
            fields: [
                {
                    name: 'logo',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'navItems',
                    type: 'array',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'link',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'type',
                            type: 'select',
                            options: ['link', 'button'],
                            defaultValue: 'link',
                        },
                    ],
                },
            ],
        },
        {
            name: 'footer',
            type: 'group',
            fields: [
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'copyright',
                    type: 'text',
                },
                {
                    name: 'socialLinks',
                    type: 'array',
                    fields: [
                        {
                            name: 'platform',
                            type: 'select',
                            options: ['facebook', 'twitter', 'instagram', 'linkedin'],
                        },
                        {
                            name: 'url',
                            type: 'text',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'footerLinks',
                    type: 'array',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                        },
                        {
                            name: 'url',
                            type: 'text',
                        },
                    ],
                },
            ],
        },
        {
            name: 'settings',
            type: 'group',
            fields: [
                {
                    name: 'siteTitle',
                    type: 'text',
                },
                {
                    name: 'siteDescription',
                    type: 'textarea',
                },
                {
                    name: 'keywords',
                    type: 'text',
                },
            ],
        },
    ],
}
