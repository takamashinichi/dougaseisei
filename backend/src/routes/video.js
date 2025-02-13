import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';
import Video from '../models/Video.js';

const router = express.Router();

// 動画生成
router.post('/generate', protect, async (req, res, next) => {
  try {
    const { text, voice = 'ja-JP', subtitleStyle = 'default' } = req.body;

    // 入力の検証
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'テキストは必須です'
      });
    }

    // Vidnoz APIへのリクエスト
    const response = await axios.post(
      'https://api.vidnoz.com/generate_video',
      {
        text,
        voice,
        subtitleStyle
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VIDNOZ_API_KEY}`
        }
      }
    );

    // 動画情報の保存
    const video = await Video.create({
      text,
      url: response.data.video_url,
      userId: req.user._id,
      metadata: {
        voice,
        subtitleStyle,
        duration: response.data.duration
      }
    });

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
});

// ユーザーの動画一覧取得
router.get('/my-videos', protect, async (req, res, next) => {
  try {
    const videos = await Video.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    next(error);
  }
});

export default router; 