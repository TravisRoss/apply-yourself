import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import { InterviewReminderEmail } from "./InterviewReminderEmail"

const defaultProps = {
  userName: "Jane Smith",
  company: "Acme Corp",
  position: "Software Engineer",
  interviewType: "Video Call",
  interviewRound: "Technical",
  interviewDate: "Tuesday, April 8, 2026",
  interviewTime: "2:00 PM",
}

describe("InterviewReminderEmail", () => {
  test("addresses the user by name", () => {
    render(<InterviewReminderEmail {...defaultProps} />)
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument()
  })

  test("shows the company and position", () => {
    render(<InterviewReminderEmail {...defaultProps} />)
    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
    expect(screen.getByText("Software Engineer")).toBeInTheDocument()
  })

  test("shows the interview type and round", () => {
    render(<InterviewReminderEmail {...defaultProps} />)
    expect(screen.getByText("Video Call")).toBeInTheDocument()
    expect(screen.getByText("Technical")).toBeInTheDocument()
  })

  test("shows the interview date and time", () => {
    render(<InterviewReminderEmail {...defaultProps} />)
    expect(screen.getByText("Tuesday, April 8, 2026")).toBeInTheDocument()
    expect(screen.getByText("2:00 PM")).toBeInTheDocument()
  })
})
