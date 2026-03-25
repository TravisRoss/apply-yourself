import { PageShell } from "@/components/PageShell"
import AddInterviewSheet from "@/components/AddInterviewSheet"

export default function InterviewsPage() {
  return (
    <PageShell
      title="Interviews"
      subtitle="Manage your upcoming and past interviews."
      action={<AddInterviewSheet />}
    />
  )
}
