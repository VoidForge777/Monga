'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/providers/Auth'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, Loader2, Heart } from 'lucide-react'
import { cn } from '@/utilities/cn'

interface BookmarkButtonProps {
  storyId: string
  className?: string
  intent?: 'primary' | 'secondary' | 'outline' | 'plain'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showText?: boolean
}

interface BookmarkData {
  bookmarked: boolean
  totalBookmarks: number
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  storyId,
  className,
  intent = 'outline',
  size = 'md',
  showText = true,
}) => {
  const { user } = useAuth()
  const [bookmarkData, setBookmarkData] = useState<BookmarkData>({
    bookmarked: false,
    totalBookmarks: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    fetchBookmarkData()
  }, [storyId])

  const fetchBookmarkData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/stories/${storyId}/bookmark`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setBookmarkData(data)
      }
    } catch (error) {
      console.error('Failed to fetch bookmark data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBookmark = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 3000)
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/stories/${storyId}/bookmark`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setBookmarkData((prev) => ({
          bookmarked: data.bookmarked,
          totalBookmarks: data.bookmarked
            ? prev.totalBookmarks + 1
            : Math.max(0, prev.totalBookmarks - 1),
        }))
      } else {
        const errorData = await response.json()
        console.error('Bookmark error:', errorData.error)
      }
    } catch (error) {
      console.error('Network error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span>Loading...</span>}
        </>
      )
    }

    if (isSubmitting) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span>{bookmarkData.bookmarked ? 'Removing...' : 'Adding...'}</span>}
        </>
      )
    }

    const Icon = bookmarkData.bookmarked ? BookmarkCheck : Bookmark
    const text = bookmarkData.bookmarked ? 'Bookmarked' : 'Bookmark'

    return (
      <>
        <Icon className={cn('w-4 h-4', bookmarkData.bookmarked && 'text-primary fill-current')} />
        {showText && <span>{text}</span>}
        {bookmarkData.totalBookmarks > 0 && (
          <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
            {bookmarkData.totalBookmarks}
          </span>
        )}
      </>
    )
  }

  return (
    <div className="relative">
      <Button
        intent={bookmarkData.bookmarked ? 'primary' : intent}
        size={size}
        onClick={toggleBookmark}
        isDisabled={isLoading || isSubmitting}
        className={cn(
          'flex items-center gap-2',
          bookmarkData.bookmarked && intent === 'outline' && 'border-primary bg-primary/10',
          className,
        )}
      >
        {getButtonContent()}
      </Button>

      {/* Login Prompt Tooltip */}
      {showLoginPrompt && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
          Please sign in to bookmark stories
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  )
}
