import { Application } from "@/generated/prisma/client"
import { createApplication, getApplicationsByUserId } from "@/lib/data-service"
import { ApplicationFormData } from "@/lib/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useApplications(userId: string) {
  return useQuery({
    queryKey: ["applications", userId],
    queryFn: () => getApplicationsByUserId(userId),
  })
}

export function useCreateApplication(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: ApplicationFormData) =>
      createApplication(userId, formData),
    mutationKey: ["applications", userId],
    onMutate: async (formData: ApplicationFormData) => {
      await queryClient.cancelQueries({ queryKey: ["applications", userId] })
      const previousApplications = queryClient.getQueryData<Application[]>([
        "applications",
        userId,
      ])
      queryClient.setQueryData<Application[]>(
        ["applications", userId],
        (previous = []) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            userId,
            ...formData,
            location: formData.location ?? null,
            salary: formData.salary ?? null,
            url: formData.url ?? null,
            notes: formData.notes ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
      )

      return { previousApplications }
    },
    onSuccess: async () => {
      toast("Application created successfully.")
    },
    onError: (error, _formData, context) => {
      // restore the applications from snapshot
      queryClient.setQueryData(
        ["applications", userId],
        context?.previousApplications
      )
      toast(`Failed to create application: ${error.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", userId] })
    },
  })
}
