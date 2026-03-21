import { Application } from "@/generated/prisma/client"
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplicationsByUserId,
  updateApplication,
} from "@/lib/data-service"
import { ApplicationFormData } from "@/lib/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useApplications(userId: string) {
  return useQuery({
    queryKey: ["applications", userId],
    queryFn: () => getApplicationsByUserId(userId),
  })
}

export function useApplication(applicationId: string) {
  return useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplicationById(applicationId),
  })
}

export function useCreateApplication(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: ApplicationFormData) =>
      createApplication(userId, formData),
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

export function useDeleteApplication(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => deleteApplication(applicationId),
    onMutate: async (applicationId) => {
      await queryClient.cancelQueries({ queryKey: ["applications", userId] })

      const previousApplications = queryClient.getQueryData<Application[]>([
        "applications",
        userId,
      ])

      queryClient.setQueryData<Application[]>(
        ["applications", userId],
        (previous = []) => previous.filter((app) => app.id !== applicationId)
      )

      return { previousApplications }
    },
    onError: (error, _applicationId, context) => {
      queryClient.setQueryData(
        ["applications", userId],
        context?.previousApplications
      )
      toast(`Failed to delete application: ${error.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", userId] })
    },
  })
}

export function useUpdateApplication(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      applicationId,
      formData,
    }: {
      applicationId: string
      formData: ApplicationFormData
    }) => updateApplication(applicationId, formData),
    onMutate: async ({
      applicationId,
      formData,
    }: {
      applicationId: string
      formData: ApplicationFormData
    }) => {
      // cancel any in flight queries
      queryClient.cancelQueries({ queryKey: ["applications", userId] })

      // store a snapshot of the previous applications array
      const previousApplications = queryClient.getQueryData<Application[]>([
        "applications",
        userId,
      ])

      //optimistically update applications
      queryClient.setQueryData(
        ["applications", userId],
        (prev: Application[] = []) =>
          prev.map((app) =>
            app.id === applicationId
              ? {
                  id: app.id,
                  userId: app.userId,
                  createdAt: app.createdAt,
                  updatedAt: new Date(),
                  ...formData,
                  location: formData.location ?? null,
                  salary: formData.salary ?? null,
                  url: formData.url ?? null,
                  notes: formData.notes ?? null,
                }
              : app
          )
      )
      toast("Application updated successfully")

      return { previousApplications }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["applications", userId],
        context?.previousApplications
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", userId] })
    },
  })
}
