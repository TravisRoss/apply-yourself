import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

export type WeeklySummaryApplication = {
  company: string
  position: string
  status: string
}

export type WeeklySummaryInterview = {
  company: string
  position: string
  round: string
  date: string
}

export type WeeklySummaryEmailProps = {
  userName: string
  weekOf: string
  totalApplications: number
  newApplications: WeeklySummaryApplication[]
  upcomingInterviews: WeeklySummaryInterview[]
}

export function WeeklySummaryEmail({
  userName,
  weekOf,
  totalApplications,
  newApplications,
  upcomingInterviews,
}: WeeklySummaryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your job search summary for the week of {weekOf}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Weekly Summary</Heading>
          <Text style={styles.subheading}>Week of {weekOf}</Text>
          <Text style={styles.text}>Hi {userName},</Text>
          <Text style={styles.text}>
            Here&apos;s a summary of your job search activity this week.
          </Text>

          <Section style={styles.statBlock}>
            <Text style={styles.statLabel}>Total Applications</Text>
            <Text style={styles.statValue}>{totalApplications}</Text>
          </Section>

          <Section>
            <Text style={styles.sectionHeading}>Applied This Week</Text>
            {newApplications.length === 0 ? (
              <Text style={styles.emptyText}>
                No new applications this week.
              </Text>
            ) : (
              newApplications.map((application, index) => (
                <Row key={index} style={styles.row}>
                  <Text style={styles.rowPrimary}>
                    {application.company} — {application.position}
                  </Text>
                  <Text style={styles.rowSecondary}>{application.status}</Text>
                </Row>
              ))
            )}
          </Section>

          <Section>
            <Text style={styles.sectionHeading}>Upcoming Interviews</Text>
            {upcomingInterviews.length === 0 ? (
              <Text style={styles.emptyText}>No upcoming interviews.</Text>
            ) : (
              upcomingInterviews.map((interview, index) => (
                <Row key={index} style={styles.row}>
                  <Text style={styles.rowPrimary}>
                    {interview.company} — {interview.position}
                  </Text>
                  <Text style={styles.rowSecondary}>
                    {interview.round} · {interview.date}
                  </Text>
                </Row>
              ))
            )}
          </Section>

          <Text style={styles.footer}>
            You are receiving this because you enabled weekly summaries in Apply
            Yourself. You can turn these off in your settings.
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
    marginBottom: "4px",
  },
  subheading: {
    fontSize: "14px",
    color: "#71717a",
    marginTop: "0",
    marginBottom: "16px",
  },
  text: {
    fontSize: "14px",
    color: "#3f3f46",
    lineHeight: "1.6",
  },
  statBlock: {
    backgroundColor: "#f4f4f5",
    borderRadius: "6px",
    padding: "16px",
    margin: "16px 0",
    textAlign: "center" as const,
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    margin: "0",
  },
  statValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#18181b",
    margin: "4px 0 0",
  },
  sectionHeading: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginTop: "24px",
    marginBottom: "8px",
    borderBottom: "1px solid #e4e4e7",
    paddingBottom: "8px",
  },
  row: {
    padding: "8px 0",
    borderBottom: "1px solid #f4f4f5",
  },
  rowPrimary: {
    fontSize: "14px",
    color: "#18181b",
    margin: "0",
  },
  rowSecondary: {
    fontSize: "12px",
    color: "#71717a",
    margin: "2px 0 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#a1a1aa",
    fontStyle: "italic",
  },
  footer: {
    fontSize: "12px",
    color: "#a1a1aa",
    marginTop: "24px",
    borderTop: "1px solid #e4e4e7",
    paddingTop: "16px",
  },
}
