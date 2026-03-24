"use client"

import AddApplicationSheet from "@/components/AddApplicationSheet"
import ApplicationsTable from "@/components/ApplicationsTable"
import { PageShell } from "@/components/PageShell"
import SearchBar from "@/components/SearchBar"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { Filter } from "lucide-react"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function ApplicationsPage() {
  const { data: sessionData } = useSession()
  const [input, setInput] = useState("")

  if (!sessionData) {
    redirect("/sign-in")
  }

  function handleInputChange(value: string) {
    setInput(value)
  }

  const userId = sessionData.user.id

  return (
    <PageShell
      title="Applications"
      action={<AddApplicationSheet userId={userId!} />}
    >
      <div className="flex items-center gap-2">
        <SearchBar onInputChange={handleInputChange} input={input} />
        <Button variant="outline">
          <Filter />
          <span>Filter</span>
        </Button>
      </div>

      <ApplicationsTable userId={userId!} withPagination={true} className="mt-4" />
    </PageShell>
  )
}
