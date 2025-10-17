import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Verify the token and get user
    const headers = new Headers()
    headers.set('authorization', `JWT ${token.value}`)
    const auth = await payload.auth({
      headers,
    })

    if (!auth.user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const { rating, review } = await request.json()
    const resolvedParams = await params
    const storyId = resolvedParams.id

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if story exists
    const story = await payload.findByID({
      collection: 'stories',
      id: storyId,
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // Check if user has already rated this story
    const existingRating = await payload.find({
      collection: 'ratings',
      where: {
        and: [
          {
            user: {
              equals: auth.user.id,
            },
          },
          {
            story: {
              equals: storyId,
            },
          },
        ],
      },
    })

    let ratingDoc

    if (existingRating.docs.length > 0) {
      // Update existing rating
      ratingDoc = await payload.update({
        collection: 'ratings',
        id: existingRating.docs[0].id,
        data: {
          rating,
          review: review || '',
        },
      })
    } else {
      // Create new rating
      ratingDoc = await payload.create({
        collection: 'ratings',
        data: {
          user: auth.user.id,
          story: parseInt(storyId),
          rating,
          review: review || '',
        },
      })
    }

    return NextResponse.json({
      success: true,
      rating: {
        id: ratingDoc.id,
        rating: ratingDoc.rating,
        review: ratingDoc.review,
        user: {
          id: auth.user.id,
          name: auth.user.name,
        },
      },
    })
  } catch (error: any) {
    console.error('Rating error:', error)
    return NextResponse.json({ error: error.message || 'Failed to rate story' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')
    const resolvedParams = await params
    const storyId = resolvedParams.id

    let userRating = null

    // If user is authenticated, get their rating
    if (token) {
      const headers = new Headers()
      headers.set('authorization', `JWT ${token.value}`)
      const auth = await payload.auth({
        headers,
      })

      if (auth.user) {
        const userRatingResult = await payload.find({
          collection: 'ratings',
          where: {
            and: [
              {
                user: {
                  equals: auth.user.id,
                },
              },
              {
                story: {
                  equals: storyId,
                },
              },
            ],
          },
        })

        if (userRatingResult.docs.length > 0) {
          userRating = userRatingResult.docs[0]
        }
      }
    }

    // Get all ratings for this story to calculate average
    const allRatings = await payload.find({
      collection: 'ratings',
      where: {
        story: {
          equals: storyId,
        },
      },
      limit: 1000,
    })

    const ratings = allRatings.docs
    const totalRatings = ratings.length
    const averageRating =
      totalRatings > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings,
      userRating: userRating
        ? {
            id: userRating.id,
            rating: userRating.rating,
            review: userRating.review,
          }
        : null,
    })
  } catch (error: any) {
    console.error('Get rating error:', error)
    return NextResponse.json({ error: 'Failed to get ratings' }, { status: 500 })
  }
}
