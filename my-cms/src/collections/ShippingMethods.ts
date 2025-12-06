import { CollectionConfig } from 'payload'

export const ShippingMethods: CollectionConfig = {
    slug: 'shipping-methods',
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
            label: 'Method Name (e.g. Standard, Express)',
        },
        {
            name: 'price',
            type: 'number',
            required: true,
            label: 'Price (INR)',
        },
        {
            name: 'duration',
            type: 'text',
            label: 'Estimated Duration (e.g. 5-7 business days)',
        },
        {
            name: 'freeShippingThreshold',
            type: 'number',
            label: 'Free Shipping Threshold (Order total above this gets free shipping)',
            admin: {
                description: 'Leave empty if this method never has free shipping',
            },
        },
    ],
}
