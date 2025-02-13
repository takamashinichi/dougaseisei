import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import { errorHandler } from './middleware/auth.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS設定
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// ミドルウェア
app.use(cors(corsOptions));
app.use(express.json());

// データベース接続
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB接続成功'))
.catch(err => console.error('MongoDB接続エラー:', err));

// ルート
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes);

// ヘルスチェック
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 本番環境でのフロントエンド配信
if (process.env.NODE_ENV === 'production') {
  // フロントエンドのビルドファイルのパス
  const frontendBuildPath = path.join(__dirname, '../../frontend/.next');
  const frontendPublicPath = path.join(__dirname, '../../frontend/public');

  // 静的ファイルの提供
  app.use(express.static(frontendPublicPath));
  app.use('/_next', express.static(frontendBuildPath));

  // その他のルートをフロントエンドにリダイレクト
  app.get('*', (req, res) => {
    // APIリクエスト以外はフロントエンドにリダイレクト
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(frontendBuildPath, 'server/pages/index.html'));
    }
  });
}

// エラーハンドリング
app.use(errorHandler);

// 404ハンドリング
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'リクエストされたリソースが見つかりません'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
}); 