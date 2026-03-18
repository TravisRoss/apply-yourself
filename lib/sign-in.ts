import { signIn } from "./auth-client"
import type { SocialProviderList } from "better-auth/social-providers"

export const signInWithProvider = (provider: SocialProviderList[number]) =>
  signIn.social({
    provider,
    callbackURL: "/",
    errorCallbackURL: "/sign-in",
  })
