import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { Stack } from 'expo-router'
import { PostHogProvider } from 'posthog-react-native'

import { tokenCache } from '@/lib/token-cache'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!
const posthogKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!
const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

const convex = new ConvexReactClient(convexUrl, { unsavedChangesWarning: false })

export default function RootLayout() {
  return (
    <PostHogProvider
      apiKey={posthogKey}
      options={{
        host: posthogHost,
        enableSessionReplay: true,
        sessionReplayConfig: {
          maskAllTextInputs: true,
          maskAllImages: false,
          captureLog: true,
          captureNetworkTelemetry: true,
        },
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <Stack screenOptions={{ headerShown: false }} />
          </ConvexProviderWithClerk>
        </ClerkLoaded>
      </ClerkProvider>
    </PostHogProvider>
  )
}
