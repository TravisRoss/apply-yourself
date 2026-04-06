import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export type InterviewReminderEmailProps = {
  userName: string
  company: string
  position: string
  interviewType: string
  interviewRound: string
  interviewDate: string
  interviewTime: string
}

export function InterviewReminderEmail({
  userName,
  company,
  position,
  interviewType,
  interviewRound,
  interviewDate,
  interviewTime,
}: InterviewReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Reminder: {interviewRound} interview at {company} tomorrow
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Interview Tomorrow</Heading>
          <Text style={styles.text}>Hi {userName},</Text>
          <Text style={styles.text}>
            Just a reminder that you have an interview coming up in 24 hours.
          </Text>
          <Section style={styles.detailsBlock}>
            <Text style={styles.detailsHeading}>Interview Details</Text>
            <Text style={styles.detail}>
              <strong>Company:</strong> {company}
            </Text>
            <Text style={styles.detail}>
              <strong>Position:</strong> {position}
            </Text>
            <Text style={styles.detail}>
              <strong>Type:</strong> {interviewType}
            </Text>
            <Text style={styles.detail}>
              <strong>Round:</strong> {interviewRound}
            </Text>
            <Text style={styles.detail}>
              <strong>Date:</strong> {interviewDate}
            </Text>
            <Text style={styles.detail}>
              <strong>Time:</strong> {interviewTime}
            </Text>
          </Section>
          <Text style={styles.text}>Good luck!</Text>
          <Text style={styles.footer}>
            You are receiving this because you enabled interview reminders in
            Apply Yourself. You can turn these off in your settings.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily: "sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "32px",
    maxWidth: "480px",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "24px",
    color: "#18181b",
    marginBottom: "16px",
  },
  text: {
    fontSize: "14px",
    color: "#3f3f46",
    lineHeight: "1.6",
  },
  detailsBlock: {
    backgroundColor: "#f4f4f5",
    borderRadius: "6px",
    padding: "16px",
    margin: "16px 0",
  },
  detailsHeading: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "8px",
  },
  detail: {
    fontSize: "14px",
    color: "#18181b",
    margin: "4px 0",
  },
  footer: {
    fontSize: "12px",
    color: "#a1a1aa",
    marginTop: "24px",
    borderTop: "1px solid #e4e4e7",
    paddingTop: "16px",
  },
}
