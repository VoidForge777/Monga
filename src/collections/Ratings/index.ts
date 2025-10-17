import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Ratings: CollectionConfig = {
  slug: 'ratings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['user', 'story', 'rating', 'createdAt'],
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'story',
      type: 'relationship',
      relationTo: 'stories',
      required: true,
      index: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        step: 0.5,
      },
    },
    {
      name: 'review',
      type: 'textarea',
      admin: {
        description: 'Optional review text',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Ensure user can only rate each story once
        if (operation === 'create' && req.user) {
          const existingRating = await req.payload.find({
            collection: 'ratings',
            where: {
              and: [
                {
                  user: {
                    equals: req.user.id,
                  },
                },
                {
                  story: {
                    equals: data.story,
                  },
                },
              ],
            },
          })

          if (existingRating.docs.length > 0) {
            throw new Error('You have already rated this story')
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
