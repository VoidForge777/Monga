'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/providers/Auth'
import { UserMenu } from '@/components/Auth/UserMenu'
import { AuthModal } from '@/components/Auth/AuthModal'
import { Button } from '@/components/ui/button'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const { user, isLoading } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const openLoginModal = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
  }

  const openRegisterModal = () => {
    setAuthMode('register')
    setIsAuthModalOpen(true)
  }

  return (
    <>
      <nav className="flex gap-3 items-center">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="plain" />
        })}
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>

        {!isLoading && (
          <>
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Button intent="plain" size="sm" onClick={openLoginModal}>
                  <LogIn className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sign in</span>
                </Button>
                <Button size="sm" onClick={openRegisterModal}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sign up</span>
                </Button>
              </div>
            )}
          </>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  )
}
