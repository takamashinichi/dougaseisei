import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'テキストは必須です'],
    trim: true,
    maxlength: [5000, 'テキストは5000文字以内である必要があります']
  },
  url: {
    type: String,
    required: [true, '動画URLは必須です'],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ユーザーIDは必須です']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    voice: String,
    subtitleStyle: String,
    duration: Number
  }
});

// インデックスの作成
VideoSchema.index({ userId: 1, createdAt: -1 });

const Video = mongoose.model('Video', VideoSchema);

export default Video; 