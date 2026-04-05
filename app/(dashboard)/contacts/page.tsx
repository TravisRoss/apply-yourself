"use client"

import AddContactSheet from "@/components/contacts/AddContactSheet"
import ContactCard from "@/components/contacts/ContactCard"
import { PageShell } from "@/components/layout/PageShell"
import { useContacts } from "@/hooks/useContacts"
import { useSession } from "@/lib/auth-client"

export default function ContactsPage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const { data: contacts, isPending } = useContacts(userId ?? "")
  console.log("userId", userId)

  return (
    <>
      <PageShell title="Contacts" action={<AddContactSheet userId={userId!} />}>
        {!isPending && contacts?.length === 0 && (
          <p>You have no contacts yet.</p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {contacts?.map((contact) => (
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
