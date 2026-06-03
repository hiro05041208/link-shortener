# LinkShort - URL短縮サービス

Next.js 16 + Clerk + Prisma + Supabase で構築したURL短縮サービスのテンプレートです。

## 機能

- 🔗 **リンク短縮** — カスタムスラッグ対応
- 📊 **アクセス解析** — クリック数、デバイス、ブラウザ別の統計
- 📱 **QRコード生成** — リンクごとにPNGダウンロード可能
- 📋 **リンク管理** — 一覧、削除、詳細分析
- 🔒 **認証** — Clerkによる安全なユーザー管理
- 🌙 **ダークモード** — システム設定連動
- 📱 **レスポンシブ** — モバイル対応

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| UIコンポーネント | Radix UI + shadcn/ui風カスタム |
| 認証 | Clerk |
| ORM | Prisma |
| データベース | Supabase (PostgreSQL) |
| チャート | Recharts |
| QRコード | qrcode |

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd link-shortener
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開いて以下の値を設定します。

#### Clerk の設定

1. [Clerk](https://clerk.com) にアクセスしてアカウントを作成
2. 新しいアプリケーションを作成
3. **API Keys** ページから以下を取得してコピー：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

#### Supabase の設定

1. [Supabase](https://supabase.com) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成（リージョン: `ap-northeast-1` 推奨）
3. **Settings > Database** から接続文字列を取得：
   - `DATABASE_URL`: Transaction pooler (ポート 6543)
   - `DIRECT_URL`: Session pooler またはダイレクト接続 (ポート 5432)

### 3. データベースのセットアップ

```bash
# Prisma クライアントの生成
npx prisma generate

# データベースへのマイグレーション適用
npx prisma db push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## プロジェクト構造

```
link-shortener/
├── app/
│   ├── (auth)/                    # 認証ページ（Clerk）
│   │   ├── sign-in/[[...sign-in]]/
│   │   └── sign-up/[[...sign-up]]/
│   ├── [slug]/route.ts            # リダイレクトハンドラ
│   ├── api/
│   │   ├── links/                 # リンクCRUD API
│   │   └── qr/[id]/               # QRコード生成API
│   ├── dashboard/
│   │   ├── analytics/[id]/        # リンク別解析ページ
│   │   └── links/                 # リンク管理ページ
│   ├── layout.tsx                 # ルートレイアウト
│   └── page.tsx                   # ランディングページ
├── components/
│   ├── analytics/                 # 解析コンポーネント
│   ├── layout/                    # レイアウトコンポーネント
│   ├── links/                     # リンク関連コンポーネント
│   └── ui/                        # 基本UIコンポーネント
├── lib/
│   ├── prisma.ts                  # Prismaクライアント
│   └── utils.ts                   # ユーティリティ関数
├── prisma/
│   └── schema.prisma              # データベーススキーマ
├── middleware.ts                  # Clerk認証ミドルウェア
└── .env.example                   # 環境変数テンプレート
```

## デプロイ（Vercel）

1. [Vercel](https://vercel.com) にログイン
2. GitHub リポジトリをインポート
3. 環境変数を Vercel ダッシュボードで設定
4. `NEXT_PUBLIC_APP_URL` を実際のドメインに変更
5. デプロイ

## API リファレンス

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | `/api/links` | リンク一覧取得 |
| POST | `/api/links` | リンク作成 |
| GET | `/api/links/:id` | リンク詳細取得 |
| PATCH | `/api/links/:id` | リンク更新 |
| DELETE | `/api/links/:id` | リンク削除 |
| GET | `/api/qr/:id` | QRコード取得 |
| GET | `/:slug` | リダイレクト（公開） |

## ライセンス

MIT
