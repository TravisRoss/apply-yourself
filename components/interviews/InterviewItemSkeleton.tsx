import { Item, ItemActions, ItemContent } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_SKELETON_COUNT = 3

type InterviewItemSkeletonProps = {
  count?: number
}

export default function InterviewItemSkeleton({
  count = DEFAULT_SKELETON_COUNT,
}: InterviewItemSkeletonProps) {
  return (
    <ul className="mb-4 flex flex-col items-center gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Item
          key={index}
          className="flex-col items-stretch rounded-lg border border-border bg-card capitalize sm:flex-row sm:items-center"
        >
          <ItemContent>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </ItemActions>
        </Item>
      ))}
    </ul>
  )
}
