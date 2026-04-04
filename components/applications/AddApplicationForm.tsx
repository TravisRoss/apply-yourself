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
import { ApplicationStatus, JobType, Source } from "@/generated/prisma/enums"
import {
  applicationStatusLabels,
  jobTypeLabels,
  sourceLabels,
} from "@/lib/labels"
import DatePicker from "../shared/DatePicker"
import { Controller, useForm } from "react-hook-form"
import { ApplicationFormData, applicationSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

type AddApplicationFormProps = {
  onHandleSubmit: (formData: ApplicationFormData) => void
  application?: ApplicationFormData
  onDirtyChange?: (isDirty: boolean) => void
}

export default function AddApplicationForm({
  onHandleSubmit,
  application,
  onDirtyChange,
}: AddApplicationFormProps) {
  const {
    register,
    control,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: application
      ? application
      : {
          appliedDate: new Date(),
          status: ApplicationStatus.applied,
          jobType: "full_time" as const,
        },
  })

  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty)
    }
  }, [isDirty, onDirtyChange])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      <form
        id="add-application-form"
        onSubmit={handleSubmit(onHandleSubmit)}
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={!!errors.company}>
            <FieldLabel htmlFor="company">Company</FieldLabel>
            <Input
              id="company"
              placeholder="e.g. Stripe"
              type="text"
              aria-invalid={!!errors.company}
              {...register("company")}
            />
            <FieldError errors={[errors.company]} />
          </Field>
          <Field data-invalid={!!errors.position}>
            <FieldLabel htmlFor="position">Position</FieldLabel>
            <Input
              id="position"
              placeholder="e.g. Software Engineer"
              type="text"
              aria-invalid={!!errors.position}
              {...register("position")}
            />
            <FieldError errors={[errors.position]} />
          </Field>
          <Field data-invalid={!!errors.status}>
            <FieldLabel>Status</FieldLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.status}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ApplicationStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {applicationStatusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.status]} />
          </Field>
          <Field data-invalid={!!errors.appliedDate}>
            <FieldLabel htmlFor="appliedDate">Applied date</FieldLabel>
            <Controller
              name="appliedDate"
              control={control}
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldError errors={[errors.appliedDate]} />
          </Field>
          <Field data-invalid={!!errors.jobType}>
            <FieldLabel>Job type</FieldLabel>
            <Controller
              name="jobType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.jobType}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {jobTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError errors={[errors.jobType]} />
          </Field>
          <Field data-invalid={!!errors.source}>
            <FieldLabel>Source</FieldLabel>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.source}
                  >
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Source).map((source) => (
                      <SelectItem key={source} value={source}>
                        {sourceLabels[source]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.source]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="e.g. Remote"
              type="text"
              {...register("location")}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="salary">Salary</FieldLabel>
            <Input
              id="salary"
              placeholder="e.g. $120,000 - $150,000"
              type="text"
              {...register("salary")}
            />
          </Field>
          <Field data-invalid={!!errors.url}>
            <FieldLabel htmlFor="url">URL</FieldLabel>
            <Input
              id="url"
              placeholder="e.g. https://stripe.com/jobs/123"
              type="url"
              aria-invalid={!!errors.url}
              {...register("url")}
            />
            <FieldError errors={[errors.url]} />
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
          {errors.root && <FieldError errors={[errors.root]} />}
        </FieldGroup>
      </form>
    </div>
  )
}
