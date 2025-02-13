# テキスト to ビデオ ジェネレーター API

テキストから動画を自動生成するRESTful APIサービス

## 機能

- ユーザー認証（登録・ログイン）
- テキストから動画生成
- 生成した動画の管理
- JWT認証による保護されたエンドポイント

## 技術スタック

- Node.js
- Express.js
- MongoDB
- JWT認証
- Vidnoz AI API

## 必要条件

- Node.js 14.0.0以上
- MongoDB 4.0.0以上
- npm または yarn

## インストール

```bash
# リポジトリのクローン
git clone [リポジトリURL]

# プロジェクトディレクトリに移動
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
```

## 環境変数の設定

`.env`ファイルを作成し、以下の変数を設定してください：

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/video-generator
JWT_SECRET=your_jwt_secret_here
VIDNOZ_API_KEY=your_vidnoz_api_key_here
NODE_ENV=development
```

## 起動方法

```bash
# 開発モード
npm run dev

# 本番モード
npm start
```

## APIエンドポイント

### 認証

- POST `/api/auth/register` - ユーザー登録
- POST `/api/auth/login` - ログイン

### 動画

- POST `/api/video/generate` - 動画生成
- GET `/api/video/my-videos` - ユーザーの動画一覧取得

## セキュリティ

- パスワードはbcryptでハッシュ化
- JWTによる認証
- 環境変数による機密情報の管理
- CORSの設定

## ライセンス

MIT 