import { useAuth, useUser } from '@clerk/clerk-expo'
import { useMutation } from 'convex/react'
import { DarkTheme, DefaultTheme, Redirect, ThemeProvider } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'

import { AnimatedSplashOverlay } from '@/components/animated-icon'
import AppTabs from '@/components/app-tabs'
import { api } from '@/convex/_generated/api'
import { initializePurchases } from '@/lib/purchases'

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const upsertUser = useMutation(api.users.upsertUser)

  useEffect(() => {
    if (!user) return
    upsertUser({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? '',
      name: user.fullName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
    })
    initializePurchases(user.id)
  }, [user?.id])

  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  const colorScheme = useColorScheme()
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  )
}
