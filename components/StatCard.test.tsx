import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"
import { FileText, Gift, TrendingUp } from "lucide-react"
import { describe, expect, test } from "vitest"
import StatCard from "./StatCard"

describe("StatCard", () => {
  test("displays the card title and total", () => {
    render(
      <StatCard
        title="Total Applied"
        icon={FileText}
        total={10}
        count={12}
        countLabel="this week"
        percentageGain={5}
      />
    )
    expect(
      screen.getByRole("heading", { name: "Total Applied" })
    ).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
  })

  test("displays the weekly activity summary", () => {
    render(
      <StatCard
        title="Total Applied"
        icon={FileText}
        total={10}
        count={12}
        countLabel="this week"
        percentageGain={5}
      />
    )
    expect(screen.getByText("12 this week")).toBeInTheDocument()
  })

  test("displays offers with a custom activity label", () => {
    render(
      <StatCard
        title="Offers"
        icon={Gift}
        total={5}
        count={8}
        countLabel="pending response"
        percentageGain={50}
      />
    )
    expect(screen.getByText("8 pending response")).toBeInTheDocument()
  })

  test("displays no activity summary when data is unavailable", () => {
    render(<StatCard title="Offers" icon={Gift} total={5} />)
    expect(screen.queryByText(/pending response/)).not.toBeInTheDocument()
  })

  test("displays an upward trend with a + indicator when percentage is positive", () => {
    render(
      <StatCard
        title="Total Applied"
        icon={FileText}
        total={10}
        percentageGain={5}
      />
    )
    expect(screen.getByText(/\+5%.*from last month/)).toBeInTheDocument()
  })

  test("displays a downward trend when percentage is negative", () => {
    render(
      <StatCard
        title="Response Rate"
        icon={TrendingUp}
        total={90}
        count={12}
        countLabel="this week"
        percentageGain={-5}
      />
    )
    expect(screen.getByText(/\-5%.*from last month/)).toBeInTheDocument()
  })

  test("displays no trend indicator when data is unavailable", () => {
    render(
      <StatCard
        title="Offers"
        icon={Gift}
        total={5}
        count={8}
        countLabel="pending response"
      />
    )
    expect(screen.queryByText(/from last month/)).not.toBeInTheDocument()
  })

  describe("accessibility", () => {
    test("decorative icon is not announced by screen readers", () => {
      const { container } = render(
        <StatCard title="Total Applied" icon={FileText} total={10} />
      )
      expect(container.querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true"
      )
    })

    test("a full card has no axe violations", async () => {
      const { container } = render(
        <StatCard
          title="Total Applied"
          icon={FileText}
          total={10}
          count={12}
          countLabel="this week"
          percentageGain={5}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
