'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/providers/Auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star, MessageSquare, Loader2 } from 'lucide-react'
import { cn } from '@/utilities/cn'

interface RatingComponentProps {
  storyId: string
  className?: string
}

interface RatingData {
  averageRating: number
  totalRatings: number
  userRating: {
    id: string
    rating: number
    review: string
  } | null
}

export const RatingComponent: React.FC<RatingComponentProps> = ({ storyId, className }) => {
  const { user } = useAuth()
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
    userRating: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRatingData()
  }, [storyId])

  const fetchRatingData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/stories/${storyId}/rate`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setRatingData(data)
        if (data.userRating) {
          setSelectedRating(data.userRating.rating)
          setReview(data.userRating.review || '')
        }
      }
    } catch (error) {
      console.error('Failed to fetch rating data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitRating = async () => {
    if (!user) {
      setError('Please sign in to rate this story')
      return
    }

    if (selectedRating === 0) {
      setError('Please select a rating')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const response = await fetch(`/api/stories/${storyId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: selectedRating,
          review: review.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowRatingForm(false)
        await fetchRatingData()
      } else {
        setError(data.error || 'Failed to submit rating')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating)
    setError('')
  }

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= rating
      const isHovered = interactive && starValue <= hoveredRating

      return (
        <Star
          key={index}
          className={cn(size, 'transition-colors cursor-pointer', {
            'text-yellow-400 fill-yellow-400': isFilled || isHovered,
            'text-gray-300': !isFilled && !isHovered,
          })}
          onClick={interactive ? () => handleStarClick(starValue) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(starValue) : undefined}
          onMouseLeave={interactive ? handleStarLeave : undefined}
        />
      )
    })
  }

  if (isLoading) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn(className)}>
      <CardContent className="p-4 space-y-4">
        {/* Rating Display */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(ratingData.averageRating)}</div>
            <span className="font-semibold text-lg">{ratingData.averageRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({ratingData.totalRatings} rating{ratingData.totalRatings !== 1 ? 's' : ''})
          </span>
        </div>

        {/* User Rating Section */}
        {user && (
          <div className="border-t pt-4">
            {ratingData.userRating ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your rating:</span>
                  <div className="flex">
                    {renderStars(ratingData.userRating.rating, false, 'w-4 h-4')}
                  </div>
                  <span className="text-sm">{ratingData.userRating.rating}/5</span>
                </div>
                {ratingData.userRating.review && (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {ratingData.userRating.review}
                  </p>
                )}
                <Button intent="outline" size="sm" onClick={() => setShowRatingForm(true)}>
                  Update Rating
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowRatingForm(true)} className="w-full" size="md">
                <Star className="w-4 h-4 mr-2" />
                Rate this Story
              </Button>
            )}
          </div>
        )}

        {!user && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground text-center">Sign in to rate this story</p>
          </div>
        )}

        {/* Rating Form Modal */}
        {showRatingForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  {ratingData.userRating ? 'Update Your Rating' : 'Rate This Story'}
                </h3>

                {error && (
                  <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Star Rating Input */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(hoveredRating || selectedRating, true, 'w-8 h-8')}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedRating > 0 ? `${selectedRating}/5 stars` : 'Click to rate'}
                  </span>
                </div>

                {/* Review Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Review (Optional)</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts about this story..."
                    className="w-full p-2 border rounded-md resize-none h-20 text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    intent="outline"
                    onClick={() => {
                      setShowRatingForm(false)
                      setError('')
                      setHoveredRating(0)
                      if (!ratingData.userRating) {
                        setSelectedRating(0)
                        setReview('')
                      }
                    }}
                    isDisabled={isSubmitting}
                    className="flex-1"
                    size="md"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitRating}
                    isDisabled={isSubmitting || selectedRating === 0}
                    className="flex-1"
                    size="md"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {ratingData.userRating ? 'Update' : 'Submit'} Rating
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
