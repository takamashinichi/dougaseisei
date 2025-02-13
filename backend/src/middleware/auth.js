import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // トークンの取得
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証が必要です'
      });
    }

    try {
      // トークンの検証
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ユーザーの取得
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'ユーザーが見つかりません'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'トークンが無効です'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'サーバーエラーが発生しました',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}; 