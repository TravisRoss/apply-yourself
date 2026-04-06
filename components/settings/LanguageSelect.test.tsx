import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, test, vi } from "vitest"
import LanguageSelect from "./LanguageSelect"

const mockRefresh = vi.fn()
const mockSetLocale = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

vi.mock("@/lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "user-1" } } }),
}))

vi.mock("@/lib/data/settings", () => ({
  setLocale: (...args: unknown[]) => mockSetLocale(...args),
}))

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe("LanguageSelect", () => {
  test("shows the currently active locale as the selected value", () => {
    render(<LanguageSelect />)
    expect(screen.getByRole("combobox")).toHaveTextContent("English")
  })

  test("lists all available languages", async () => {
    render(<LanguageSelect />)
    await userEvent.click(screen.getByRole("combobox"))
    expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Deutsch" })).toBeInTheDocument()
  })

  test("calls setLocale with the user id and chosen locale when a language is selected", async () => {
    render(<LanguageSelect />)
    await userEvent.click(screen.getByRole("combobox"))
    await userEvent.click(screen.getByRole("option", { name: "Deutsch" }))
    expect(mockSetLocale).toHaveBeenCalledWith("user-1", "de")
  })

  test("refreshes the page after the locale is saved", async () => {
    render(<LanguageSelect />)
    await userEvent.click(screen.getByRole("combobox"))
    await userEvent.click(screen.getByRole("option", { name: "Deutsch" }))
    expect(mockRefresh).toHaveBeenCalledOnce()
  })
})
