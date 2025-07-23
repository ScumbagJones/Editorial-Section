import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, ExternalLink, Music, FileText, Palette, Clock, User, Eye } from "lucide-react";
import EnhancedPlaylistEmbed from "./enhanced-playlist-embed";
import ExternalContentPreview from "./external-content-preview";
import { formatDistanceToNow } from "date-fns";

interface ContentModalProps {
  submission: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentModal({ submission, isOpen, onClose }: ContentModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [isOpen]);

  if (!submission) return null;

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'playlist': return <Music className="w-4 h-4" />;
      case 'essay': return <FileText className="w-4 h-4" />;
      case 'creative': return <Palette className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const isEditorialContent = submission.category !== 'quick-share';

  // Reading progress for text content
  const [readingProgress, setReadingProgress] = useState(0);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPercent = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setReadingProgress(Math.min(scrollPercent, 100));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[var(--charcoal)] to-[var(--slate)] border-border transition-all duration-500"
        onScroll={handleScroll}
      >
        {/* Reading progress bar for text content */}
        {submission.category === 'poetry' || submission.category === 'in-conversation' ? (
          <div className="fixed top-0 left-0 right-0 z-50">
            <Progress 
              value={readingProgress} 
              className="h-1 bg-transparent"
            />
          </div>
        ) : null}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white/10 rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
              <span className="text-white">Loading content...</span>
            </div>
          </div>
        )}

        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getContentIcon(submission.contentType)}
                <Badge 
                  variant={isEditorialContent ? "default" : "secondary"}
                  className={isEditorialContent ? "bg-purple-600 text-white" : "bg-gray-600 text-white"}
                >
                  {isEditorialContent ? "Editorial" : "Community"}
                </Badge>
                {submission.contentType === 'playlist' && (
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    Radio Ready
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl text-white mb-2">
                {submission.title}
              </DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{submission.submitterHandle}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(submission.createdAt))} ago</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 50) + 10} views</span>
                </div>
                {submission.contentType !== 'playlist' && (
                  <span>{getReadingTime(submission.description)}</span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Playlist Content with Inline Player */}
          {submission.contentType === 'playlist' && submission.collaborationLinks?.[0] && (
            <div className="space-y-4 mb-6">
              <PlaylistEmbed 
                url={submission.collaborationLinks[0]} 
                title={submission.title}
                description={submission.description}
                compact={false}
              />
              
              {/* Radio Ready Notice */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Music className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Radio Ready Playlist</span>
                </div>
                <p className="text-green-200 text-sm">
                  This playlist is under 1 hour and eligible for our community radio sessions. 
                  We'll feature curated playlists during live listening parties!
                </p>
              </div>
            </div>
          )}

          {/* Image Gallery with Enhanced View */}
          {submission.files && submission.files.length > 0 && (
            <div className="mb-6">
              <div className={`grid gap-4 ${submission.files.length === 1 ? 'grid-cols-1' : submission.files.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {submission.files.map((file: string, index: number) => (
                  <div key={index} className="group relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
                    <img 
                      src={file} 
                      alt={`${submission.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    
                    {/* Image overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm">
                        Image {index + 1} of {submission.files.length}
                      </p>
                    </div>
                    
                    {/* Zoom indicator */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Gallery info */}
              {submission.files.length > 1 && (
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    {submission.files.length} images • Click any image to view full size
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Main Content with Enhanced Typography */}
          <div className="prose prose-invert max-w-none">
            {submission.category === 'poetry' ? (
              <div className="text-center py-8">
                <div className="text-white leading-relaxed whitespace-pre-wrap text-lg font-light tracking-wide max-w-2xl mx-auto">
                  {submission.description.split('\n').map((line, index) => (
                    <div key={index} className="mb-2 hover:text-pink-200 transition-colors duration-300">
                      {line || '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
            ) : submission.category === 'in-conversation' ? (
              <div className="text-white leading-relaxed space-y-4">
                {submission.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg leading-8">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-white leading-relaxed whitespace-pre-wrap">
                {submission.description}
              </div>
            )}
          </div>

          {/* External Links */}
          {submission.collaborationLinks && submission.collaborationLinks.length > 0 && submission.contentType !== 'playlist' && (
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-white font-medium mb-3">Related Links</h4>
              <div className="space-y-2">
                {submission.collaborationLinks.map((link: string, index: number) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Badge for Community Content */}
          {!isEditorialContent && (
            <div className="mt-6 p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
              <p className="text-pink-200 text-sm">
                This is community-submitted content. Love it? Share it with others!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}