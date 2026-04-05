"use client"

import SearchBar from "@/components/applications/SearchBar"
import AddContactSheet from "@/components/contacts/AddContactSheet"
import ContactCard from "@/components/contacts/ContactCard"
import { PageShell } from "@/components/layout/PageShell"
import { useContacts } from "@/hooks/useContacts"
import { useSession } from "@/lib/auth-client"
import { useState } from "react"

export default function ContactsPage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const { data: contacts, isPending } = useContacts(userId ?? "")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContacts = contacts?.filter((contact) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchTermLower) ||
      contact.company.toLowerCase().includes(searchTermLower) ||
      (contact.role && contact.role.toLowerCase().includes(searchTermLower)) ||
      (contact.notes && contact.notes.toLowerCase().includes(searchTermLower))
    )
  })

  return (
    <>
      <PageShell title="Contacts" action={<AddContactSheet userId={userId!} />}>
        {!isPending && contacts?.length === 0 && (
          <p>You have no contacts yet.</p>
        )}
        <SearchBar
          input={searchTerm}
          onInputChange={setSearchTerm}
          placeholder="Search contacts..."
          className="mb-4"
        />
        {searchTerm !== "" && filteredContacts?.length === 0 && (
          <p className="text-muted-foreground text-sm">No contacts found matching your search.</p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredContacts?.map((contact) => (
            <ContactCard
              key={contact.id}
              userId={userId!}
              contactId={contact.id}
              company={contact.company}
              name={contact.name}
              role={contact.role}
              email={contact.email ?? undefined}
              linkedInUrl={contact.linkedinUrl || undefined}
              notes={contact.notes || undefined}
            />
          ))}
        </div>
      </PageShell>
    </>
  )
}
