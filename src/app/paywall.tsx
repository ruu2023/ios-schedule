import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PaywallScreen() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings()
        if (offerings.current?.availablePackages.length) {
          setPackages(offerings.current.availablePackages)
        }
      } catch (e) {
        console.error('Offerings error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchOfferings()
  }, [])

  const onPurchase = async (pkg: PurchasesPackage) => {
    setPurchasing(true)
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      if (customerInfo.entitlements.active['premium']) {
        Alert.alert('購入完了', 'プレミアムプランが有効になりました！')
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('エラー', '購入に失敗しました')
      }
    } finally {
      setPurchasing(false)
    }
  }

  const onRestore = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases()
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        Alert.alert('復元完了', '購入が復元されました')
      } else {
        Alert.alert('復元', '復元できる購入が見つかりませんでした')
      }
    } catch (e) {
      Alert.alert('エラー', '復元に失敗しました')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>プレミアムプラン</Text>
        <Text style={styles.subtitle}>すべての機能をアンロック</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#208AEF" style={styles.loader} />
        ) : packages.length === 0 ? (
          <Text style={styles.empty}>プランが見つかりませんでした</Text>
        ) : (
          <View style={styles.plans}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={styles.planCard}
                onPress={() => onPurchase(pkg)}
                disabled={purchasing}>
                <Text style={styles.planName}>
                  {pkg.product.title || pkg.product.identifier}
                </Text>
                <Text style={styles.planPrice}>{pkg.product.priceString} / {pkg.packageType === 'ANNUAL' ? '年' : '月'}</Text>
                <View style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>
                    {purchasing ? '処理中...' : '購入する'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={onRestore} style={styles.restore}>
          <Text style={styles.restoreText}>購入を復元する</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 40, gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15, color: '#666' },
  loader: { marginTop: 40 },
  empty: { color: '#999', textAlign: 'center', marginTop: 40 },
  plans: { gap: 12, marginTop: 16 },
  planCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  planName: { fontSize: 17, fontWeight: '600' },
  planPrice: { fontSize: 15, color: '#208AEF', fontWeight: '500' },
  buyButton: {
    backgroundColor: '#208AEF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buyButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  restore: { alignItems: 'center', marginTop: 8 },
  restoreText: { color: '#999', fontSize: 13 },
})
