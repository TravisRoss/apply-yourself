import { Contact } from "@/generated/prisma/client"
import {
  createContact,
  deleteContact,
  getContactById,
  getContactsByUserId,
  updateContact,
} from "@/lib/data/contacts"
import { queryKeys } from "@/lib/query-keys"
import { ContactFormData } from "@/lib/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useContact(contactId: string) {
  return useQuery({
    queryKey: queryKeys.contact(contactId),
    queryFn: () => getContactById(contactId),
    enabled: !!contactId,
  })
}

export function useContacts(userId: string) {
  return useQuery({
    queryKey: queryKeys.contacts(userId),
    queryFn: () => getContactsByUserId(userId),
    enabled: !!userId,
  })
}

export function useDeleteContact(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contactId: string) => deleteContact(contactId),
    onSuccess: () => toast.success("Contact deleted successfully."),
    onError: (error) => {
      toast.error("Contact could not be deleted.")
      console.error(`Error when attempting to delete contact: ${error}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts(userId) })
    },
  })
}

export function useCreateContact(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      formData,
      userId,
    }: {
      formData: ContactFormData
      userId: string
    }) => createContact(userId, formData),
    onMutate: async ({
      formData,
      userId,
    }: {
      formData: ContactFormData
      userId: string
    }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.contacts(userId) })
      const previous = queryClient.getQueryData(queryKeys.contacts(userId))

      queryClient.setQueryData(
        queryKeys.contacts(userId),
        (contacts: Contact[] = []) => [
          ...contacts,
          { userId: userId, ...formData },
        ]
      )

      return { previous }
    },
    onSuccess: () => toast.success("Contact created successfully."),
    onError: (error, _variables, context) => {
      toast.error("Contact could not be created.")
      console.error(`Error when creating contact: ${error}`)
      queryClient.setQueryData(queryKeys.contacts(userId), context?.previous)
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts(userId) }),
  })
}

export function useUpdateContact(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      formData,
      contactId,
    }: {
      formData: ContactFormData
      contactId: string
    }) => updateContact(contactId, formData),
    onMutate: async ({
      formData,
      contactId,
    }: {
      formData: ContactFormData
      contactId: string
    }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.contacts(userId) })
      const previous = queryClient.getQueryData(queryKeys.contacts(userId))

      queryClient.setQueryData(
        queryKeys.contacts(userId),
        (contacts: Contact[] = []) =>
          contacts.map((contact) => {
            return contact.id === contactId
              ? { ...contact, ...formData }
              : contact
          })
      )

      return { previous }
    },
    onSuccess: () => toast.success("Contact updated successfully."),
    onError: (error, _variables, context) => {
      toast.error("Contact could not be updated.")
      console.error(`Error when updating contact: ${error}`)
      queryClient.setQueryData(queryKeys.contacts(userId), context?.previous)
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts(userId) }),
  })
}
