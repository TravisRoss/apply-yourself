import { Skeleton } from "../ui/skeleton"
import { TableCell, TableRow } from "../ui/table"

const skeletonWidths = ["w-24", "w-32", "w-24", "w-16", "w-24", "w-8"]

export default function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      {skeletonWidths.slice(1).map((width, index) => (
        <TableCell key={index}>
          <Skeleton className={`h-4 ${width}`} />
        </TableCell>
      ))}
    </TableRow>
  )
}
