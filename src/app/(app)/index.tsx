import { useAuth } from '@clerk/clerk-expo';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import { Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { pickImage, uploadFile, makeR2Key } from '@/lib/storage';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const { signOut, userId } = useAuth()
  const router = useRouter()
  const posthog = usePostHog()
  const generateUploadUrl = useAction(api.r2.generateUploadUrl)

  const onSignOut = async () => {
    posthog.capture('signed_out')
    posthog.reset()
    await signOut()
    router.replace('/(auth)/sign-in')
  }

  const onTestR2Upload = async () => {
    try {
      const file = await pickImage()
      if (!file || !userId) return
      const key = makeR2Key(userId, file.mimeType)
      const signedUrl = await generateUploadUrl({ key, contentType: file.mimeType })
      await uploadFile(signedUrl, file)
      posthog.capture('file_uploaded', { mimeType: file.mimeType })
      Alert.alert('成功', `R2 アップロード成功\nkey: ${key}`)
    } catch (e: any) {
      Alert.alert('エラー', e.message)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}

        <TouchableOpacity style={styles.paywallButton} onPress={onTestR2Upload}>
          <ThemedText type="small" style={styles.paywallText}>R2 画像アップロードテスト</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paywallButton} onPress={() => router.push('/paywall')}>
          <ThemedText type="small" style={styles.paywallText}>プレミアムプランを見る</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <ThemedText type="small" style={styles.signOutText}>サインアウト</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  paywallButton: {
    paddingVertical: Spacing.two,
  },
  paywallText: {
    color: '#208AEF',
  },
  signOutButton: {
    paddingVertical: Spacing.two,
  },
  signOutText: {
    color: '#e53e3e',
  },
});
