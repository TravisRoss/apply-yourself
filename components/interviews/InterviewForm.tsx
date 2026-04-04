import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { InterviewRound, InterviewType } from "@/generated/prisma/enums"
import { interviewTypeLabels, interviewRoundLabels } from "@/lib/labels"
import DatePicker from "../shared/DatePicker"
import { Controller, useForm } from "react-hook-form"
import { InterviewFormData, InterviewFormValues, interviewFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

type Application = { id: string; company: string; position: string }

type InterviewFormProps = {
  applications: Application[]
  onHandleSubmit: (formData: InterviewFormData) => void
  defaultValues?: InterviewFormValues
  onDirtyChange?: (isDirty: boolean) => void
}

export default function InterviewForm({
  applications,
  onHandleSubmit,
  defaultValues,
  onDirtyChange,
}: InterviewFormProps) {
  const {
    register,
    control,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: defaultValues ?? {
      date: new Date(),
      time: "09:00",
    },
  })

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  function handleFormSubmit({ time, date, ...rest }: InterviewFormValues) {
    const [hours, minutes] = time.split(":").map(Number)
    const dateWithTime = new Date(date)
    dateWithTime.setHours(hours, minutes, 0, 0)
    onHandleSubmit({ ...rest, date: dateWithTime })
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      <form
        id="add-interview-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={!!errors.applicationId}>
            <FieldLabel>Application</FieldLabel>
            <Controller
              name="applicationId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-invalid={!!errors.applicationId}>
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.id} value={app.id} className="truncate">
                        {app.company} — {app.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.applicationId]} />
          </Field>
          <Field data-invalid={!!errors.date}>
            <FieldLabel>Date</FieldLabel>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldError errors={[errors.date]} />
          </Field>
          <Field data-invalid={!!errors.time}>
            <FieldLabel htmlFor="time">Time</FieldLabel>
            <Input
              id="time"
              type="time"
              aria-invalid={!!errors.time}
              {...register("time")}
            />
            <FieldError errors={[errors.time]} />
          </Field>
          <Field data-invalid={!!errors.type}>
            <FieldLabel>Type</FieldLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-invalid={!!errors.type}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InterviewType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {interviewTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.type]} />
          </Field>
          <Field data-invalid={!!errors.round}>
            <FieldLabel>Round</FieldLabel>
            <Controller
              name="round"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-invalid={!!errors.round}>
                    <SelectValue placeholder="Select round" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InterviewRound).map((round) => (
                      <SelectItem key={round} value={round}>
                        {interviewRoundLabels[round]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.round]} />
          </Field>
          <Field data-invalid={!!errors.notes}>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              aria-invalid={!!errors.notes}
              {...register("notes")}
            />
            <FieldError errors={[errors.notes]} />
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
