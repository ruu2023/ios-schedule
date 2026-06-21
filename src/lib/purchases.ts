import Purchases, { LOG_LEVEL } from 'react-native-purchases'

const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!

export function initializePurchases(userId: string) {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG)
  Purchases.configure({ apiKey, appUserID: userId })
}

export { Purchases }
