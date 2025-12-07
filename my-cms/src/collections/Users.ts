import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true, // Public registration
    admin: ({ req: { user } }) => user?.role === 'admin', // Only admins can access the admin panel
  },
  auth: {
    cookies: {
      secure: true,
      sameSite: 'None',
      domain: undefined, // Let the browser handle the domain
    },
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      // required: true, // Removed to prevent 500 if missing
    },
    // Email added by default
  ],
}
