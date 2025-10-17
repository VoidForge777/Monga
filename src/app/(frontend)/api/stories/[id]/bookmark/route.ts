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

    const resolvedParams = await params
    const storyId = resolvedParams.id

    // Check if story exists
    const story = await payload.findByID({
      collection: 'stories',
      id: storyId,
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // Get current followers
    const currentFollowers = story.followers || []
    const userId = auth.user.id

    // Check if user is already following
    const isFollowing = currentFollowers.some(
      (follower: any) => (typeof follower === 'string' ? follower : follower.id) === userId,
    )

    let updatedFollowers
    if (isFollowing) {
      // Remove user from followers (unbookmark)
      updatedFollowers = currentFollowers.filter(
        (follower: any) => (typeof follower === 'string' ? follower : follower.id) !== userId,
      )
    } else {
      // Add user to followers (bookmark)
      updatedFollowers = [...currentFollowers, userId]
    }

    // Update the story with new followers list
    await payload.update({
      collection: 'stories',
      id: storyId,
      data: {
        followers: updatedFollowers,
      },
    })

    return NextResponse.json({
      success: true,
      bookmarked: !isFollowing,
      message: !isFollowing ? 'Story bookmarked' : 'Bookmark removed',
    })
  } catch (error: any) {
    console.error('Bookmark error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to bookmark story' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')
    const resolvedParams = await params
    const storyId = resolvedParams.id

    if (!token) {
      return NextResponse.json({
        bookmarked: false,
        totalBookmarks: 0,
      })
    }

    // Verify the token and get user
    const headers = new Headers()
    headers.set('authorization', `JWT ${token.value}`)
    const auth = await payload.auth({
      headers,
    })

    if (!auth.user) {
      return NextResponse.json({
        bookmarked: false,
        totalBookmarks: 0,
      })
    }

    // Get the story
    const story = await payload.findByID({
      collection: 'stories',
      id: storyId,
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const followers = story.followers || []
    const userId = auth.user.id

    // Check if user is following this story
    const isBookmarked = followers.some(
      (follower: any) => (typeof follower === 'string' ? follower : follower.id) === userId,
    )

    return NextResponse.json({
      bookmarked: isBookmarked,
      totalBookmarks: followers.length,
    })
  } catch (error: any) {
    console.error('Get bookmark error:', error)
    return NextResponse.json({ error: 'Failed to get bookmark status' }, { status: 500 })
  }
}
