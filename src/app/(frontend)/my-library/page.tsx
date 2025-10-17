import React from 'react'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { BookOpen, Calendar, User } from 'lucide-react'

async function getUserLibrary() {
  const payload = await getPayload({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  if (!token) {
    return null
  }

  try {
    // Verify the token and get user
    const headers = new Headers()
    headers.set('authorization', `JWT ${token.value}`)
    const auth = await payload.auth({
      headers,
    })

    if (!auth.user) {
      return null
    }

    // Get stories where user is in followers array
    const bookmarkedStories = await payload.find({
      collection: 'stories',
      where: {
        followers: {
          contains: auth.user.id,
        },
      },
      depth: 2,
      limit: 50,
    })

    // Get user's ratings
    const userRatings = await payload.find({
      collection: 'ratings',
      where: {
        user: {
          equals: auth.user.id,
        },
      },
      depth: 2,
      limit: 50,
    })

    return {
      user: auth.user,
      bookmarkedStories: bookmarkedStories.docs,
      userRatings: userRatings.docs,
    }
  } catch (error) {
    console.error('Failed to get user library:', error)
    return null
  }
}

export default async function MyLibraryPage() {
  const libraryData = await getUserLibrary()

  if (!libraryData) {
    redirect('/login')
  }

  const { user, bookmarkedStories, userRatings } = libraryData

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Library</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here are your bookmarked stories and ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookmarked Stories */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Bookmarked Stories ({bookmarkedStories.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookmarkedStories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedStories.map((story: any) => (
                      <Link key={story.id} href={`/stories/${story.slug}`} className="group">
                        <Card className="transition-shadow hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="w-16 h-20 flex-shrink-0 rounded overflow-hidden">
                                {story.banner && (
                                  <Media
                                    resource={story.banner}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                  {story.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {story.author}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                  {story.description}
                                </p>
                                {story.categories && story.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {story.categories.slice(0, 2).map((category: any) => (
                                      <Badge
                                        key={category.id}
                                        intent="secondary"
                                        className="text-xs"
                                      >
                                        {category.title}
                                      </Badge>
                                    ))}
                                    {story.categories.length > 2 && (
                                      <Badge intent="primary" className="text-xs">
                                        +{story.categories.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">No bookmarked stories yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring and bookmark your favorite stories!
                    </p>
                    <Link
                      href="/stories"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Browse Stories
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Ratings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Ratings ({userRatings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRatings.length > 0 ? (
                  <div className="space-y-4">
                    {userRatings.slice(0, 10).map((rating: any) => (
                      <div key={rating.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                        <Link href={`/stories/${rating.story.slug}`} className="group block">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                            {rating.story.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={`text-xs ${
                                    i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{rating.rating}/5</span>
                          </div>
                          {rating.review && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {rating.review}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No ratings yet. Start rating stories you've read!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Library Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Library Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bookmarked Stories</span>
                    <span className="font-medium">{bookmarkedStories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stories Rated</span>
                    <span className="font-medium">{userRatings.length}</span>
                  </div>
                  {userRatings.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Rating Given</span>
                      <span className="font-medium">
                        {(
                          userRatings.reduce((sum: number, r: any) => sum + r.rating, 0) /
                          userRatings.length
                        ).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'My Library - Monga',
  description: 'Your personal library of bookmarked stories and ratings',
}
