"use client"

import { formatDate } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type DatePickerProps = {
  value: Date
  onChange: (date: Date | undefined) => void
}

export default function DatePicker({ value: date, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-full justify-start text-left text-base font-normal data-[empty=true]:text-muted-foreground sm:text-sm"
        >
          <CalendarIcon />
          {date ? formatDate(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        collisionPadding={20}
        className="w-auto p-0"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  )
}
