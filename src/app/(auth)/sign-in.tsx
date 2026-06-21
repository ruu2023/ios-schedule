import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(app)', { scheme: 'myiosapp' }),
      })
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
      }
    } catch (err) {
      console.error('OAuth error:', err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ようこそ</Text>
        <Text style={styles.subtitle}>続けるには Google アカウントでサインインしてください</Text>

        <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignIn}>
          <Text style={styles.googleButtonText}>Google でサインイン</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
})
