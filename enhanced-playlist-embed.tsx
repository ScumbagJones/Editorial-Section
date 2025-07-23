import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Play, Clock, Hash, ExternalLink } from "lucide-react";

interface EnhancedPlaylistEmbedProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
  trackCount?: number;
  duration?: string;
  genre?: string;
}

export default function EnhancedPlaylistEmbed({ 
  url, 
  title, 
  description, 
  compact = false,
  trackCount,
  duration,
  genre 
}: EnhancedPlaylistEmbedProps) {
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const getPlaylistInfo = (url: string) => {
    if (url.includes('spotify')) {
      return { platform: 'Spotify', color: 'bg-green-600' };
    } else if (url.includes('apple') || url.includes('music.apple')) {
      return { platform: 'Apple Music', color: 'bg-black' };
    } else if (url.includes('youtube') || url.includes('youtu.be')) {
      return { platform: 'YouTube', color: 'bg-red-600' };
    }
    return { platform: 'Playlist', color: 'bg-[var(--editorial)]' };
  };

  const { platform, color } = getPlaylistInfo(url);

  if (compact) {
    return (
      <div className="relative bg-gradient-to-br from-black/80 to-black/60 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--editorial)]/20 to-transparent" />
        
        <div className="relative p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${color} text-white text-xs`}>
              {platform}
            </Badge>
            {genre && (
              <Badge variant="outline" className="text-xs border-white/30 text-white/80">
                {genre}
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{title}</h3>
          
          <div className="flex items-center space-x-4 text-xs text-white/70">
            {trackCount && (
              <div className="flex items-center space-x-1">
                <Hash className="w-3 h-3" />
                <span>{trackCount} tracks</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullPlayer(true)}
              className="text-white hover:bg-white/10 p-2 h-auto"
            >
              <Play className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(url, '_blank')}
              className="text-white hover:bg-white/10 p-2 h-auto"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Full player modal */}
        {showFullPlayer && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowFullPlayer(false)}
                  >
                    ✕
                  </Button>
                </div>
                
                {description && (
                  <p className="text-muted-foreground mb-4">{description}</p>
                )}
                
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Music className="w-12 h-12 text-[var(--editorial)] mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Full playlist embed would load here
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => window.open(url, '_blank')}
                    >
                      Open in {platform}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Non-compact version for detailed view
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-black/80 to-black/60 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Badge className={`${color} text-white`}>
              {platform}
            </Badge>
            {genre && (
              <Badge variant="outline" className="border-white/30 text-white/80">
                {genre}
              </Badge>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          {description && (
            <p className="text-white/80 text-sm line-clamp-3 mb-4">{description}</p>
          )}
          
          <div className="flex items-center space-x-6 text-sm text-white/70 mb-4">
            {trackCount && (
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>{trackCount} tracks</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          <Button
            className="bg-white text-black hover:bg-white/90"
            onClick={() => window.open(url, '_blank')}
          >
            Open in {platform}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}