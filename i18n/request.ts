import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getRequestConfig } from "next-intl/server"
import { cookies, headers } from "next/headers"

const SUPPORTED_LOCALES = ["en", "de", "es", "ja"]
const DEFAULT_LOCALE = "en"

export default getRequestConfig(async () => {
  let locale = DEFAULT_LOCALE

  try {
    // Check cookie first (fast + works for guests)
    const cookieStore = await cookies()
    const cookieLocale = cookieStore.get("locale")?.value

    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
      locale = cookieLocale
    }

    // If logged in → override with DB preference
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { locale: true },
      })

      if (user?.locale && SUPPORTED_LOCALES.includes(user.locale)) {
        locale = user.locale
      }
    }
  } catch (err) {
    if (
      err !== null &&
      typeof err === "object" &&
      "digest" in err &&
      err.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw err
    }
    console.error("Locale resolution failed:", err)
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
