"use client"

import { InterviewRound, InterviewType } from "@/generated/prisma/enums"
import {
  InterviewFormData,
  InterviewFormValues,
  createInterviewFormSchema,
} from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "../shared/DatePicker"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0")
)
const MINUTES = ["00", "15", "30", "45"]

type Application = { id: string; company: string; position: string }

type InterviewFormProps = {
  applications: Application[]
  onHandleSubmit: (formData: InterviewFormData) => void
  defaultValues?: InterviewFormValues
  onDirtyChange?: (isDirty: boolean) => void
  lockedApplication?: Application
}

export default function InterviewForm({
  applications,
  onHandleSubmit,
  defaultValues,
  onDirtyChange,
  lockedApplication,
}: InterviewFormProps) {
  const t = useTranslations("interviews.form")
  const tInterviews = useTranslations("interviews")
  const tCommon = useTranslations("common")
  const tValidation = useTranslations("validation")

  const {
    control,
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(createInterviewFormSchema(tValidation)),
    defaultValues: defaultValues ?? {
      date: new Date(),
      hour: "09",
      minute: "00",
      ...(lockedApplication !== undefined ? { applicationId: lockedApplication.id } : {}),
    },
  })

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  function handleFormSubmit({ hour, minute, date, ...rest }: InterviewFormValues) {
    const dateWithTime = new Date(date)
    dateWithTime.setHours(Number(hour), Number(minute), 0, 0)
    onHandleSubmit({ ...rest, date: dateWithTime })
  }

  return (
    <div className="min-w-0 flex-1 overflow-y-auto px-4 py-2">
      <form
        id="add-interview-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={!!errors.applicationId}>
            <FieldLabel>{t("application")}</FieldLabel>
            <Controller
              name="applicationId"
              control={control}
              render={({ field }) =>
                lockedApplication !== undefined ? (
                  <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    {lockedApplication.company} — {lockedApplication.position}
                  </div>
                ) : (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.applicationId}
                    >
                      <SelectValue placeholder={t("applicationPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem
                          key={app.id}
                          value={app.id}
                          className="truncate"
                        >
                          {app.company} — {app.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }
            />
            <FieldError errors={[errors.applicationId]} />
          </Field>
          <Field data-invalid={!!errors.date}>
            <FieldLabel>{t("date")}</FieldLabel>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldError errors={[errors.date]} />
          </Field>
          <Field data-invalid={!!(errors.hour || errors.minute)}>
            <FieldLabel>{t("time")}</FieldLabel>
            <div className="flex gap-2">
              <Controller
                name="hour"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.hour}
                      aria-label={t("hour")}
                    >
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="minute"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.minute}
                      aria-label={t("minute")}
                    >
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {MINUTES.map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FieldError errors={[errors.hour, errors.minute]} />
          </Field>
          <Field data-invalid={!!errors.type}>
            <FieldLabel>{t("type")}</FieldLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.type}
                  >
                    <SelectValue placeholder={t("typePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InterviewType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {tInterviews(`types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.type]} />
          </Field>
          <Field data-invalid={!!errors.round}>
            <FieldLabel>{t("round")}</FieldLabel>
            <Controller
              name="round"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.round}
                  >
                    <SelectValue placeholder={t("roundPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InterviewRound).map((round) => (
                      <SelectItem key={round} value={round}>
                        {tInterviews(`rounds.${round}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.round]} />
          </Field>
          <Field data-invalid={!!errors.notes}>
            <FieldLabel htmlFor="notes">{tCommon("notes")}</FieldLabel>
            <Textarea
              id="notes"
              placeholder={tCommon("notesPlaceholder")}
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
