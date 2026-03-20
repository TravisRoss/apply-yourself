import ApplicationsTable from "@/components/ApplicationsTable";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold">Applications</h1>
      <p className="text-sm text-muted-foreground">
        Track every job you&apos;ve applied to.
      </p>
      <ApplicationsTable userId={session.user.id} />
    </div>
  );
}
