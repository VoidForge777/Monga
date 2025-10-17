import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 })
    }

    // Verify the token and get user
    const headers = new Headers()
    headers.set('authorization', `JWT ${token.value}`)
    const user = await payload.auth({
      headers,
    })

    if (user.user) {
      // Return user data (without sensitive info)
      return NextResponse.json({
        user: {
          id: user.user.id,
          email: user.user.email,
          name: user.user.name,
          roles: user.user.roles,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Failed to get user information' }, { status: 500 })
  }
}
