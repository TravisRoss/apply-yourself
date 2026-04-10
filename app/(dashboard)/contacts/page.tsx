"use client"

import SearchBar from "@/components/applications/SearchBar"
import AddContactSheet from "@/components/contacts/AddContactSheet"
import ContactCard from "@/components/contacts/ContactCard"
import { PageShell } from "@/components/layout/PageShell"
import { useContacts } from "@/hooks/useContacts"
import { useSession } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function ContactsPage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const { data: contacts, isPending } = useContacts(userId ?? "")
  const t = useTranslations("contacts")
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
      <PageShell
        title={t("title")}
        action={<AddContactSheet userId={userId!} />}
      >
        {!isPending && contacts?.length === 0 && <p>{t("empty")}</p>}
        {contacts && contacts.length > 0 && (
          <SearchBar
            input={searchTerm}
            onInputChange={setSearchTerm}
            placeholder={t("searchPlaceholder")}
            className="mb-4"
          />
        )}
        {searchTerm !== "" && filteredContacts?.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("noResults")}</p>
        )}
        <div className="grid touch-pan-y grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
