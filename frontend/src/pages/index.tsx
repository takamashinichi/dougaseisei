import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/api/video/generate`, {
        text,
        voice: 'ja-JP',
        subtitleStyle: 'default'
      });

      setVideoUrl(response.data.data.url);
    } catch (err) {
      setError('動画の生成中にエラーが発生しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          テキストから動画を生成
        </h1>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="テキストを入力してください..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={generateVideo}
            disabled={loading || !text.trim()}
            className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium
              ${loading || !text.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {loading ? '生成中...' : '動画を生成'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {videoUrl && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">生成された動画:</h2>
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 