"use server"

import { ReactElement } from "react"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = "Apply Yourself <notifications@applyyourself.app>"

export async function sendEmail({
  to,
  subject,
  template,
}: {
  to: string
  subject: string
  template: ReactElement
}) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    react: template,
  })
}
