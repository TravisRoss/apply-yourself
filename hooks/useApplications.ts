import { Application } from "@/generated/prisma/client"
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplicationsByUserId,
  getApplicationsForMonth,
  getApplicationsThisWeek,
  getApplictionsWhereStatusApplied,
  getResponsesThisWeek,
  updateApplication,
} from "@/lib/data/applications"
import { getOffersByUserId } from "@/lib/data/offers"
import { queryKeys } from "@/lib/query-keys"
import { ApplicationFormData } from "@/lib/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export function useApplications(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.applications(userId!),
    queryFn: () => getApplicationsByUserId(userId!),
    enabled: !!userId,
  })
}

export function useApplicationsThisWeek(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.applicationsThisWeek(userId!),
    queryFn: () => getApplicationsThisWeek(userId!),
    enabled: !!userId,
  })
}

export function useApplicationsForMonth(
  userId: string | undefined,
  date: Date
) {
  return useQuery({
    queryKey: queryKeys.applicationsForMonth(
      userId!,
      date.getFullYear(),
      date.getMonth()
    ),
    queryFn: () => getApplicationsForMonth(userId!, date),
    enabled: !!userId,
  })
}

export function useResponsesThisWeek(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.responsesThisWeek(userId!),
    queryFn: () => getResponsesThisWeek(userId!),
    enabled: !!userId,
  })
}

export function useApplication(userId: string, applicationId: string) {
  return useQuery({
    queryKey: queryKeys.application(userId, applicationId),
    queryFn: () => getApplicationById(applicationId),
  })
}

export function useOffers(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.offers(userId!),
    queryFn: () => getOffersByUserId(userId!),
    enabled: !!userId,
  })
}

export function useStatusApplied(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.statusApplied(userId!),
    queryFn: () => getApplictionsWhereStatusApplied(userId!),
    enabled: !!userId,
  })
}

export function useCreateApplication(userId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("applications.toasts")

  return useMutation({
    mutationFn: (formData: ApplicationFormData) =>
      createApplication(userId, formData),
    onMutate: async (formData: ApplicationFormData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.applications(userId),
      })
      const previousApplications = queryClient.getQueryData<Application[]>(
        queryKeys.applications(userId)
      )
      queryClient.setQueryData<Application[]>(
        queryKeys.applications(userId),
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
      toast(t("created"))
    },
    onError: (error, _formData, context) => {
      queryClient.setQueryData(
        queryKeys.applications(userId),
        context?.previousApplications
      )
      toast(t("createFailed", { error: error.message }))
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications(userId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.offers(userId) })
    },
  })
}

export function useDeleteApplication(userId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("applications.toasts")

  return useMutation({
    mutationFn: (applicationId: string) => deleteApplication(applicationId),
    onMutate: async (applicationId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.applications(userId),
      })

      const previousApplications = queryClient.getQueryData<Application[]>(
        queryKeys.applications(userId)
      )

      queryClient.setQueryData<Application[]>(
        queryKeys.applications(userId),
        (previous = []) => previous.filter((app) => app.id !== applicationId)
      )

      return { previousApplications }
    },
    onError: (error, _applicationId, context) => {
      queryClient.setQueryData(
        queryKeys.applications(userId),
        context?.previousApplications
      )
      toast(t("deleteFailed", { error: error.message }))
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications(userId),
      })
    },
  })
}

export function useUpdateApplication(userId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("applications.toasts")

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
      queryClient.cancelQueries({ queryKey: queryKeys.applications(userId) })
      const previousApplications = queryClient.getQueryData<Application[]>(
        queryKeys.applications(userId)
      )

      queryClient.setQueryData(
        queryKeys.applications(userId),
        (prev: Application[] = []) =>
          prev.map((app) =>
            app.id === applicationId
              ? {
                  id: app.id,
                  userId: app.userId,
                  createdAt: app.createdAt,
                  updatedAt: new Date(),
                  ...formData,
                  location: formData.location || null,
                  salary: formData.salary || null,
                  url: formData.url || null,
                  notes: formData.notes || null,
                }
              : app
          )
      )

      return { previousApplications }
    },
    onSuccess: () => {
      toast(t("updated"))
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        queryKeys.applications(userId),
        context?.previousApplications
      )
      console.log(_error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications(userId),
      })
    },
  })
}
