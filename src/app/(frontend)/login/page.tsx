'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/providers/Auth'
import { LoginForm } from '@/components/Auth/LoginForm'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/my-library')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your library and rate stories
          </p>
        </div>
        <LoginForm
          onSuccess={() => router.push('/my-library')}
          onSwitchToRegister={() => router.push('/register')}
        />
      </div>
    </div>
  )
}
