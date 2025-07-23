import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, Volume2, ExternalLink } from "lucide-react";

interface InlineMusicPlayerProps {
  url: string;
  title: string;
  description?: string;
  submitterHandle: string;
}

export default function InlineMusicPlayer({ url, title, description, submitterHandle }: InlineMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract platform and playlist ID from URL
  const getPlaylistInfo = (url: string) => {
    if (url.includes('spotify.com')) {
      return { platform: 'Spotify', color: 'bg-green-500', icon: '♫' };
    }
    if (url.includes('music.apple.com')) {
      return { platform: 'Apple Music', color: 'bg-red-500', icon: '🎵' };
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return { platform: 'YouTube', color: 'bg-red-600', icon: '▶' };
    }
    return { platform: 'Music', color: 'bg-purple-500', icon: '♪' };
  };

  const playlistInfo = getPlaylistInfo(url);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual playback
  };

  return (
    <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center">
          {/* Album Art / Visualization */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center relative overflow-hidden">
            <div className={`absolute inset-0 ${playlistInfo.color}/20`} />
            <span className="text-2xl text-white relative z-10">{playlistInfo.icon}</span>
            {/* Animated bars when playing */}
            {isPlaying && (
              <div className="absolute bottom-2 left-2 flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white/60 animate-pulse"
                    style={{
                      height: `${Math.random() * 12 + 4}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{title}</h4>
                <p className="text-gray-400 text-sm">by {submitterHandle}</p>
              </div>
              <Badge className={`${playlistInfo.color} text-white text-xs`}>
                {playlistInfo.platform}
              </Badge>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white p-0"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white p-0"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <div className="flex-1 flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-white/60 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Duration / Track Count */}
            <div className="mt-2 text-xs text-gray-500">
              Radio Ready • Under 1 hour
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}