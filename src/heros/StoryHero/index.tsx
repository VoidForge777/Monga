import { Button, Heading } from '@/components/ui'
import StoryDescription from '@/heros/StoryHero/StoryDescription'
import StoryDescriptionList from '@/heros/StoryHero/StoryDescriptionList'
import { Story } from '@/payload-types'
import { BookmarkPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ReadNowButton from './ReadNowButton'
import { RatingComponent } from '@/components/StoryActions/RatingComponent'
import { BookmarkButton } from '@/components/StoryActions/BookmarkButton'

type StoryHeroProps = {
  item: Story
}
function StoryHero({ item }: StoryHeroProps) {
  const { title, banner } = item
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-[minmax(200px,400px)_auto] gap-4">
      <div className="space-y-4">
        {banner && typeof banner !== 'number' && (
          <Image
            src={banner.url ?? banner.thumbnailURL ?? ''}
            width={500}
            height={800}
            alt={banner.alt ?? banner.filename ?? title}
            className="min-h-[600px] rounded-md"
          />
        )}
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <ReadNowButton story={item} className="uppercase col-span-full" />
          <Button intent="outline" size="lg" className="">
            Newest chapter
          </Button>
          <BookmarkButton storyId={item.id.toString()} size="lg" />
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <Heading level={1} tracking="wider">
            {title}
          </Heading>
        </div>
        <StoryDescriptionList item={item} />
        <div className="space-y-2">
          <Heading level={4}>Description</Heading>
          <StoryDescription item={item} />
        </div>

        {/* Rating Component */}
        <div className="space-y-2">
          <Heading level={4}>Rating & Reviews</Heading>
          <RatingComponent storyId={item.id.toString()} />
        </div>
      </div>
    </div>
  )
}

export default StoryHero
