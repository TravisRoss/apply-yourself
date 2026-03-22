import ApplicationsTable from "@/components/ApplicationsTable"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="p-8 pt-4">
      <h1 className="mb-1 pb-4 text-xl font-semibold">Applications</h1>
      <ApplicationsTable userId={session.user.id} withPagination={true} />
    </div>
  )
}
