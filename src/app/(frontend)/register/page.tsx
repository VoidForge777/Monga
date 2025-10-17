'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/providers/Auth'
import { RegisterForm } from '@/components/Auth/RegisterForm'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
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
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-muted-foreground">
            Join our community and start building your manga library
          </p>
        </div>
        <RegisterForm
          onSuccess={() => router.push('/my-library')}
          onSwitchToLogin={() => router.push('/login')}
        />
      </div>
    </div>
  )
}
