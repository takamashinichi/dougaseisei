import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ユーザー登録
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ユーザーの存在確認
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'このメールアドレスは既に登録されています'
      });
    }

    // ユーザーの作成
    const user = await User.create({
      email,
      password
    });

    // トークンの生成
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
});

// ログイン
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ユーザーの検索
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }

    // パスワードの検証
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }

    // トークンの生成
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
});

export default router; 