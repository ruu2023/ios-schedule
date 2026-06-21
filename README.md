# my-ios-app

Expo ベースの iOS アプリ開発スターターキット（Mac 最適化済み）
**動作確認環境：iPhone 12 mini / iOS 26.5 / Xcode 26.5 / Mac**

---

## このテンプレートから新しいアプリを作る

### 1. リポジトリ作成

GitHub の [ios-schedule](https://github.com/ruu2023/ios-schedule) を開き、**「Use this template」** → 新しいリポジトリ名で作成してクローン。

### 2. アプリ名・Bundle ID を変更

`app.json` を編集：

```json
{
  "expo": {
    "name": "新しいアプリ名",
    "slug": "new-app-slug",
    "scheme": "newappscheme",
    "ios": {
      "bundleIdentifier": "com.yourname.newapp"
    }
  }
}
```

`package.json` の `name` も同様に変更。

### 3. 各サービスで新しいプロジェクトを作成し `.env` を差し替え

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
EXPO_PUBLIC_REVENUECAT_API_KEY=test_...
EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

| サービス | 作業 |
|---|---|
| [Clerk](https://clerk.com) | 新しいアプリを作成し Publishable Key を取得 |
| [Convex](https://convex.dev) | `npx convex dev` で新プロジェクトを作成（`.env` に自動追記される） |
| [RevenueCat](https://revenuecat.com) | 新しいプロジェクトを作成し Bundle ID を登録 |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | 新しいバケットを作成し Convex に環境変数を設定 |
| [PostHog](https://posthog.com) | 新しいプロジェクトを作成し API Key を取得 |

Convex の R2 環境変数は以下で設定：

```bash
npx convex env set CLOUDFLARE_ACCOUNT_ID <Account ID>
npx convex env set R2_ACCESS_KEY_ID <Access Key ID>
npx convex env set R2_SECRET_ACCESS_KEY <Secret Access Key>
npx convex env set R2_BUCKET_NAME <バケット名>
```

### 4. iOS プロジェクトを再生成してビルド

```bash
npx expo prebuild --clean
npx expo run:ios --device
```

---

## スタック

| カテゴリ | ツール | 詳細 |
|---|---|---|
| フロントエンド | [Expo](https://expo.dev) SDK 56 | Expo Router + NativeTabs |
| AI コーディング | [Claude Code](https://claude.ai/code) | ネイティブ Mac 対応 |
| 認証 | [Clerk](https://clerk.com) | Google OAuth、無料枠 5万 MAU |
| データベース | [Convex](https://convex.dev) | サーバー関数経由で安全にアクセス |
| ストレージ | [Cloudflare R2](https://developers.cloudflare.com/r2/) | 音声・画像保存用、10GB まで無料 |
| 課金 | [RevenueCat](https://revenuecat.com) | 2,500ドル/月まで無料、以降は手数料 1% |
| 分析 | [PostHog](https://posthog.com) | リテンション率・ユーザー行動分析 |
| 配信 | App Store | App Store Connect MCP サーバー連携（予定） |

---

## 事前準備

### 1. Homebrew のインストール

```bash
/bin/bash -c "$(curl -fsSL https://brew.sh/install.sh)"
```

### 2. Node.js のインストール

```bash
brew install fnm
fnm install --lts
```

### 3. Watchman のインストール

```bash
brew install watchman
```

### 4. CocoaPods のインストール

```bash
brew install cocoapods
```

### 5. Xcode のインストール

App Store から **Xcode** をインストール後、以下を実行：

```bash
sudo xcode-select --reset
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Xcode を一度起動してライセンス同意・コンポーネントインストールを完了させる。

---

## セットアップ

### 1. Expo プロジェクト作成

```bash
npx create-expo-app my-ios-app --yes
cd my-ios-app
```

### 2. 依存パッケージのインストール

```bash
npm install @clerk/clerk-expo expo-secure-store expo-web-browser
npm install convex
npm install react-native-purchases
npx expo install expo-dev-client
```

---

## 各サービスの設定

### Clerk（認証）

1. [clerk.com](https://clerk.com) でアプリを作成
2. **「User & Authentication」→「Social connections」** で Google を有効化
3. **API Keys** から `pk_test_...` の Publishable Key を取得

`.env` に追加：
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
```

### Convex（データベース）

```bash
npx convex dev
```

ブラウザでログイン・プロジェクト作成後、`.env.local` に自動で以下が追記される：
```
CONVEX_DEPLOYMENT=dev:xxxxx
EXPO_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
```

### RevenueCat（課金）

1. [app.revenuecat.com](https://app.revenuecat.com) でプロジェクトを作成
2. iOS アプリを追加、Bundle ID は `com.anonymous.my-ios-app`
3. SDK API Key（`test_...`）を取得

`.env` に追加：
```
EXPO_PUBLIC_REVENUECAT_API_KEY=test_xxxxxxxxxx
```

RevenueCat ダッシュボードで以下を順番に設定：

**Products（左メニュー → Product catalog → Products）**
- Identifier: `premium_monthly`、Type: Auto-renewing subscription
- Identifier: `premium_annually`、Type: Auto-renewing subscription

**Entitlements（左メニュー → Product catalog → Entitlements）**
- Identifier: `premium` を作成し、上記 2 商品を Attach

**Offerings（左メニュー → Product catalog → Offerings）**
- Identifier: `default` で作成
- `$rc_monthly` パッケージ → `premium_monthly` を紐付け
- `$rc_annual` パッケージ → `premium_annually` を紐付け

---

## 実機（iPhone）へのインストール

### iOS 26.5 について

iOS 26.5 は **Expo Go 非対応**のため、Development Build を使う。

### 1. iPhone を USB で Mac に接続

iPhone に「このコンピュータを信頼しますか？」が出たら「信頼」をタップ。

### 2. Xcode でコード署名を設定

```bash
open ~/my-ios-app/ios/myiosapp.xcworkspace
```

Xcode で：
1. 左ツリーの **「myiosapp」** をクリック
2. **「Signing & Capabilities」** タブ
3. **「Automatically manage signing」** にチェック
4. **Team** → **「Add an Account...」** → Apple ID でサインイン

### 3. 実機にビルド・インストール

```bash
npx expo run:ios --device
```

デバイス選択で iPhone を選ぶ。

iPhone に「Apple Development のアプリを使用することは許可されていません」と出た場合：

**iPhone の設定 → 一般 → VPN とデバイス管理 → Apple Development → 信頼する**

### 4. ワイヤレス開発（USB 不要）

初回インストール後はワイヤレスで開発できる：

```bash
npx expo start --dev-client
```

---

## RevenueCat 課金テスト（実機）

### StoreKit ローカル設定

Xcode でスキームを編集：

1. **Product → Scheme → Edit Scheme...**
2. **「Run」→「Options」タブ**
3. **「StoreKit Configuration」** → `LocalProducts.storekit` を選択して Close

### テスト購入の実行

1. `npx expo run:ios --device` でビルド
2. アプリ内の「プレミアムプランを見る」をタップ
3. 購入ボタンをタップ
4. **「Test valid purchase」** を選択
5. 「プレミアムプランが有効になりました！」が表示されれば成功

---

## 次回以降の開発フロー

```bash
# ターミナル 1：Convex サーバー
npx convex dev

# ターミナル 2：Expo 開発サーバー
npx expo start --dev-client
```

---

## ディレクトリ構成

```
my-ios-app/
├── src/
│   ├── app/
│   │   ├── _layout.tsx          # ClerkProvider + ConvexProvider
│   │   ├── paywall.tsx          # 課金画面
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx      # 認証済みなら (app) にリダイレクト
│   │   │   └── sign-in.tsx      # Google OAuth サインイン
│   │   └── (app)/
│   │       ├── _layout.tsx      # 未認証なら sign-in にリダイレクト
│   │       ├── index.tsx        # ホーム画面
│   │       └── explore.tsx      # Explore 画面
│   └── lib/
│       ├── token-cache.ts       # Clerk トークンキャッシュ
│       └── purchases.ts         # RevenueCat 初期化
├── convex/
│   ├── schema.ts                # DB スキーマ（users テーブル）
│   ├── users.ts                 # ユーザー CRUD 関数
│   └── auth.config.ts           # Clerk 認証設定
└── ios/
    └── LocalProducts.storekit   # StoreKit テスト商品定義
```

---

## トラブルシューティング

### `xcrun simctl` エラー

```bash
sudo xcode-select --reset
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### デバイスが Offline と表示される

iPhone のロックを解除した状態でケーブルを抜き差し。「このコンピュータを信頼しますか？」が出たら「信頼」。

### `No code signing certificates` エラー

Xcode の **Signing & Capabilities** で Apple ID を追加して Team を設定する。

### RevenueCat で「プランが見つかりませんでした」

RevenueCat ダッシュボードで Entitlements → Products → Offerings の順に設定されているか確認。
