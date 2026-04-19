import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import messages from "@/messages/en.json"
import { NextIntlClientProvider } from "next-intl"
import { beforeEach, describe, expect, test, vi } from "vitest"
import ApplicationsPage from "./page"

const mockCreateApplication = vi.fn()

vi.mock("@/lib/data/applications", () => ({
  getApplicationsByUserId: vi.fn().mockResolvedValue([]),
  createApplication: (...args: unknown[]) => mockCreateApplication(...args),
  deleteApplication: vi.fn().mockResolvedValue(undefined),
  updateApplication: vi.fn().mockResolvedValue(undefined),
  getApplicationById: vi.fn().mockResolvedValue(undefined),
  getApplicationsForMonth: vi.fn().mockResolvedValue([]),
  getApplicationsThisWeek: vi.fn().mockResolvedValue([]),
  getApplictionsWhereStatusApplied: vi.fn().mockResolvedValue([]),
  getResponsesThisWeek: vi.fn().mockResolvedValue([]),
}))

vi.mock("@/lib/data/offers", () => ({
  getOffersByUserId: vi.fn().mockResolvedValue([]),
}))

vi.mock("@/lib/data/interviews", () => ({
  getInterviewsByUserId: vi.fn().mockResolvedValue([]),
  createInterview: vi.fn().mockResolvedValue(undefined),
  deleteInterview: vi.fn().mockResolvedValue(undefined),
  updateInterview: vi.fn().mockResolvedValue(undefined),
  getInterviewById: vi.fn().mockResolvedValue(undefined),
  getInterviewsThisWeek: vi.fn().mockResolvedValue([]),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/applications",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}))

const baseApplication = {
  id: "app-1",
  userId: "user-1",
  company: "Acme Corp",
  position: "Engineer",
  appliedDate: new Date(),
  jobType: "full_time" as const,
  source: "linkedin" as const,
  location: null,
  salary: null,
  url: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ApplicationsPage />
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}

function getFieldCombobox(labelText: string) {
  const dialog = screen.getByRole("dialog", { name: "Add application" })
  const field = within(dialog).getByText(labelText).closest('[data-slot="field"]') as HTMLElement
  return within(field).getByRole("combobox")
}

async function fillAndSubmitApplicationForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Add application" }))
  await user.type(screen.getByRole("textbox", { name: "Company" }), "Acme Corp")
  await user.type(screen.getByRole("textbox", { name: "Position" }), "Engineer")
  await user.click(getFieldCombobox("Source"))
  await user.click(screen.getByRole("option", { name: "LinkedIn" }))
}

describe("ApplicationsPage — interview sheet on application creation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("opens the schedule interview sheet after creating an application with interview status", async () => {
    mockCreateApplication.mockResolvedValue({ ...baseApplication, status: "interview" })
    const user = userEvent.setup()

    renderPage()
    await fillAndSubmitApplicationForm(user)
    await user.click(getFieldCombobox("Status"))
    await user.click(screen.getByRole("option", { name: "Interview" }))
    await user.click(screen.getByRole("button", { name: "Save" }))

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Schedule interview" })).toBeInTheDocument()
    })
  })

  test("does not open the schedule interview sheet after creating an application with a non-interview status", async () => {
    mockCreateApplication.mockResolvedValue({ ...baseApplication, status: "applied" })
    const user = userEvent.setup()

    renderPage()
    await fillAndSubmitApplicationForm(user)
    await user.click(screen.getByRole("button", { name: "Save" }))

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Add application" })).not.toBeInTheDocument()
    })
    expect(screen.queryByRole("heading", { name: "Schedule interview" })).not.toBeInTheDocument()
  })
})
