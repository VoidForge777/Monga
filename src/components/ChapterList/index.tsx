import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Story } from '@/payload-types'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type ChapterListProps = {
  chapters: Story['chapters']
  item: Story
}
function ChapterList({ chapters, item }: ChapterListProps) {
  if (!chapters?.chapters) return null

  if (chapters.chapters.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-fg">
            This story has no chapters. It's either a one-shot or the author hasn't uploaded any
            chapters yet.
          </p>
        </CardContent>
      </Card>
    )

  return (
    <Card className="shadow-none bg-overlay text-overlay-fg">
      <CardHeader>
        <CardTitle>Chapters</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="relative [&>[data-drop-target]]:border [&>[data-drop-target]]:border-primary [&::-webkit-scrollbar]:size-0.5 [scrollbar-width:thin] max-h-96 overflow-auto rounded-lg border">
          {chapters.chapters.map(
            (chapter) =>
              typeof chapter !== 'number' && (
                <li
                  className="relative group transition outline-none flex select-none gap-3 border-y px-3 -mb-px py-2 lg:text-sm text-fg -outline-offset-2 first:rounded-t-md first:border-t-0 last:mb-0 last:rounded-b-md last:border-b-0 hover:bg-muted items-center cursor-pointer"
                  key={chapter.id}
                >
                  <Link
                    key={chapter.id}
                    href={`/stories/${item.slug}/${chapter.slug}`}
                    className="w-full h-full flex items-center gap-2"
                  >
                    <ChevronRight className="size-3 text-muted-fg" />
                    {chapter.title}
                  </Link>
                </li>
              ),
          )}
        </ul>
      </CardContent>
    </Card>
  )
}

export default ChapterList
