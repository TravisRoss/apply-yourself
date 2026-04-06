import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import { WeeklySummaryEmail } from "./WeeklySummaryEmail"

const defaultProps = {
  userName: "Jane Smith",
  weekOf: "March 30, 2026",
  totalApplications: 12,
  newApplications: [
    { company: "Acme Corp", position: "Software Engineer", status: "Applied" },
    { company: "Globex", position: "Frontend Developer", status: "Interview" },
  ],
  upcomingInterviews: [
    {
      company: "Initech",
      position: "Backend Engineer",
      round: "Technical",
      date: "Tue, Apr 8 at 2:00 PM",
    },
  ],
}

describe("WeeklySummaryEmail", () => {
  test("addresses the user by name", () => {
    render(<WeeklySummaryEmail {...defaultProps} />)
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument()
  })

  test("shows the week date", () => {
    render(<WeeklySummaryEmail {...defaultProps} />)
    expect(screen.getByText(/Week of March 30, 2026/)).toBeInTheDocument()
  })

  test("shows the total application count", () => {
    render(<WeeklySummaryEmail {...defaultProps} />)
    expect(screen.getByText("12")).toBeInTheDocument()
  })

  test("lists new applications", () => {
    render(<WeeklySummaryEmail {...defaultProps} />)
    expect(screen.getByText(/Acme Corp — Software Engineer/)).toBeInTheDocument()
    expect(screen.getByText(/Globex — Frontend Developer/)).toBeInTheDocument()
  })

  test("lists upcoming interviews", () => {
    render(<WeeklySummaryEmail {...defaultProps} />)
    expect(screen.getByText(/Initech — Backend Engineer/)).toBeInTheDocument()
    expect(screen.getByText(/Technical · Tue, Apr 8 at 2:00 PM/)).toBeInTheDocument()
  })

  test("shows empty state when no new applications", () => {
    render(<WeeklySummaryEmail {...defaultProps} newApplications={[]} />)
    expect(screen.getByText("No new applications this week.")).toBeInTheDocument()
  })

  test("shows empty state when no upcoming interviews", () => {
    render(<WeeklySummaryEmail {...defaultProps} upcomingInterviews={[]} />)
    expect(screen.getByText("No upcoming interviews.")).toBeInTheDocument()
  })
})
