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

export function useApplications() {
  return useQuery({
    queryKey: queryKeys.applications(),
    queryFn: () => getApplicationsByUserId(),
  })
}

export function useApplicationsThisWeek() {
  return useQuery({
    queryKey: queryKeys.applicationsThisWeek(),
    queryFn: () => getApplicationsThisWeek(),
  })
}

export function useApplicationsForMonth(date: Date) {
  return useQuery({
    queryKey: queryKeys.applicationsForMonth(date.getFullYear(), date.getMonth()),
    queryFn: () => getApplicationsForMonth(date),
  })
}

export function useResponsesThisWeek() {
  return useQuery({
    queryKey: queryKeys.responsesThisWeek(),
    queryFn: () => getResponsesThisWeek(),
  })
}

export function useApplication(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.application(applicationId),
    queryFn: () => getApplicationById(applicationId),
  })
}

export function useOffers() {
  return useQuery({
    queryKey: queryKeys.offers(),
    queryFn: () => getOffersByUserId(),
  })
}

export function useStatusApplied() {
  return useQuery({
    queryKey: queryKeys.statusApplied(),
    queryFn: () => getApplictionsWhereStatusApplied(),
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  const t = useTranslations("applications.toasts")

  return useMutation({
    mutationFn: (formData: ApplicationFormData) => createApplication(formData),
    onMutate: async (formData: ApplicationFormData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.applications(),
      })
      const previousApplications = queryClient.getQueryData<Application[]>(
        queryKeys.applications()
      )
      queryClient.setQueryData<Application[]>(
        queryKeys.applications(),
        (previous = []) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            userId: "",
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
        queryKeys.applications(),
        context?.previousApplications
      )
      toast(t("createFailed", { error: error.message }))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications() })
      queryClient.invalidateQueries({ queryKey: queryKeys.offers() })
    },
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  const t = useTranslations("applications.toasts")

  return useMutation({
    mutationFn: (applicationId: string) => deleteApplication(applicationId),
    onMutate: async (applicationId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.applications(),
      })
      const previousApplications = queryClient.getQueryData<Application[]>(
        queryKeys.applications()
      )
      queryClient.setQueryData<Application[]>(
        queryKeys.applications(),
        (previous = []) => previous.filter((app) => app.id !== applicationId)
      )
      return { previousApplications }
    },
    onError: (error, _applicationId, context) => {
      queryClient.setQueryData(
        queryKeys.applications(),
        context?.previousApplications
      )
      toast(t("deleteFailed", { error: error.message }))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications() })
    },
  })
}

export function useUpdateApplication() {
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
      queryClient.cancelQueries({ queryKey: queryKeys.applications() })
      const previousApplications = queryClient.getQueryData<Application[]>(
        queryKeys.applications()
      )
      queryClient.setQueryData(
        queryKeys.applications(),
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
        queryKeys.applications(),
        context?.previousApplications
      )
      console.log(_error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications() })
    },
  })
}
