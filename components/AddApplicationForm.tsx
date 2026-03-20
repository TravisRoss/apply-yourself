import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { ApplicationStatus, JobType, Source } from "@/generated/prisma/enums"
import {
  applicationStatusLabels,
  jobTypeLabels,
  sourceLabels,
} from "@/lib/labels"
import DatePicker from "./DatePicker"

type AddApplicationFormProps = {
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function AddApplicationForm({
  onHandleSubmit,
}: AddApplicationFormProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      <form onSubmit={onHandleSubmit} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="company">Company</FieldLabel>
            <Input id="company" placeholder="e.g. Stripe" type="text" />
          </Field>
          <Field>
            <FieldLabel htmlFor="position">Position</FieldLabel>
            <Input
              id="position"
              placeholder="e.g. Software Engineer"
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select defaultValue={ApplicationStatus.applied}>
              <SelectTrigger className="w-full">
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
          </Field>
          <Field>
            <FieldLabel htmlFor="appliedDate">Applied date</FieldLabel>
            <DatePicker />
          </Field>
          <Field>
            <FieldLabel>Job type</FieldLabel>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(JobType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {jobTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Source</FieldLabel>
            <Select>
              <SelectTrigger className="w-full">
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
          </Field>
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input id="location" placeholder="e.g. Remote" type="text" />
          </Field>
          <Field>
            <FieldLabel htmlFor="salary">Salary</FieldLabel>
            <Input
              id="salary"
              placeholder="e.g. $120,000 - $150,000"
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="url">URL</FieldLabel>
            <Input
              id="url"
              placeholder="e.g. https://stripe.com/jobs/123"
              type="url"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea id="notes" placeholder="Any additional notes..." />
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
