import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Create new user
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name,
        roles: ['user'], // Default role for new users
      },
    })

    // Log the user in automatically after registration
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (loginResult.user && loginResult.token) {
      // Set HTTP-only cookie with the token
      const cookieStore = await cookies()
      cookieStore.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      // Return user data (without sensitive info)
      return NextResponse.json({
        user: {
          id: loginResult.user.id,
          email: loginResult.user.email,
          name: loginResult.user.name,
          roles: loginResult.user.roles,
        },
      })
    }

    return NextResponse.json({ error: 'Registration successful but login failed' }, { status: 500 })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 })
  }
}
