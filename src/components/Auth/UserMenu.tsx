'use client'

import React, { useState, useRef } from 'react'
import { useAuth } from '@/providers/Auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, LogOut, BookOpen, Star, Settings, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  const menuItems = [
    {
      icon: BookOpen,
      label: 'My Library',
      href: '/my-library',
    },
    {
      icon: Star,
      label: 'My Ratings',
      href: '/my-ratings',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
    },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <Button
        intent="plain"
        className="flex items-center gap-2 hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block">{user.name}</span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </div>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-64 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="border-t py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
