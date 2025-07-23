import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Music, Palette, PenTool, Calendar, User, Sparkles, MessageCircle, Eye } from "lucide-react";
import { Submission } from "@shared/schema";
import EnhancedPlaylistEmbed from "./enhanced-playlist-embed";
import ContentModal from "./content-modal";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";

interface CommunityGridProps {
  submissions?: Submission[];
}

export default function CommunityGrid({ submissions: propSubmissions }: CommunityGridProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // WebSocket for real-time updates
  const { isConnected } = useWebSocket({
    onNewSubmission: (submission) => {
      toast({
        title: "New submission!",
        description: `${submission.submitterHandle} shared: ${submission.title}`,
        duration: 4000,
      });
    }
  });
  
  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/community-submissions'],
    enabled: !propSubmissions,
    refetchInterval: isConnected ? false : 10000, // Poll every 10s if WebSocket disconnected
  });

  const displaySubmissions = propSubmissions || submissions;

  const handleCardClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const getCategoryIcon = (category: string, contentType: string) => {
    if (contentType === 'playlist') return <Music className="w-16 h-16 text-green-400" />;
    switch (category) {
      case 'art':
        return <Palette className="w-16 h-16 text-amber-400" />;
      case 'poetry':
        return <PenTool className="w-16 h-16 text-[var(--editorial)]" />;
      case 'fashion':
        return <Sparkles className="w-16 h-16 text-rose-400" />;
      case 'in-conversation':
        return <MessageCircle className="w-16 h-16 text-[var(--deep-brown)]" />;
      default:
        return <Heart className="w-16 h-16 text-[var(--editorial)]" />;
    }
  };

  const getCategoryColor = (category: string, contentType: string) => {
    if (contentType === 'playlist') return 'bg-green-600/80 text-white border-green-500/50';
    switch (category) {
      case 'art':
        return 'bg-amber-600/80 text-white border-amber-500/50';
      case 'poetry':
        return 'bg-[var(--editorial)]/80 text-white border-[var(--editorial)]/50';
      case 'fashion':
        return 'bg-rose-600/80 text-white border-rose-500/50';
      case 'in-conversation':
        return 'bg-[var(--deep-brown)]/80 text-white border-[var(--deep-brown)]/50';
      default:
        return 'bg-[var(--editorial)]/80 text-white border-[var(--editorial)]/50';
    }
  };

  const formatDate = (date: string | Date) => {
    const now = new Date();
    const submissionDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - submissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return submissionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderCardContent = (submission: Submission) => {
    // For playlists, show the embedded player instead of the icon
    if (submission.contentType === 'playlist' && submission.collaborationLinks?.[0]) {
      return (
        <div className="relative aspect-square bg-black/20 rounded-t-lg overflow-hidden">
          <EnhancedPlaylistEmbed 
            url={submission.collaborationLinks[0]} 
            title={submission.title}
            description={submission.description}
            compact={true}
            trackCount={12} // Would be extracted from API
            duration="52 min"
            genre="Electronic"
          />
        </div>
      );
    }

    // For other content types, show the icon
    return (
      <div className="relative aspect-square bg-gradient-to-br from-[var(--editorial)]/20 to-amber-500/20 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          {getCategoryIcon(submission.category, submission.contentType)}
        </div>
        <div className="absolute top-2 right-2">
          <Badge className={`${getCategoryColor(submission.category, submission.contentType)} text-xs`}>
            {submission.contentType === 'playlist' ? 'Playlist' : submission.category}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-white/80">
          {formatDate(submission.createdAt || new Date())}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
        {[...Array(8)].map((_, i) => {
          // Vary skeleton sizes for visual interest
          const isLarge = i % 4 === 0;
          const isMedium = i % 3 === 0;
          return (
            <Card 
              key={i} 
              className={`${isLarge ? 'col-span-1 md:col-span-2 row-span-2' : isMedium ? 'col-span-1 md:col-span-2 row-span-1' : 'col-span-1 row-span-1'} bg-[var(--slate)]/20 border-border/30`}
            >
              <CardContent className="p-0">
                <div className={`${isLarge ? 'aspect-[4/5]' : isMedium ? 'aspect-[8/5]' : 'aspect-[5/4]'} bg-gradient-to-br from-gray-600/50 to-gray-700/50 animate-pulse`} />
                <div className="p-6">
                  <div className="h-5 bg-gray-600/50 rounded mb-2 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  <div className="h-4 bg-gray-600/30 rounded mb-2 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                  <div className="h-4 bg-gray-600/30 rounded w-2/3 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <div className="flex justify-between mt-4">
                    <div className="h-3 bg-gray-600/20 rounded w-20 animate-pulse" style={{ animationDelay: `${i * 0.25}s` }} />
                    <div className="h-3 bg-gray-600/20 rounded w-16 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  const getCardSize = (submission: Submission) => {
    // Different sizes based on content type
    if (submission.contentType === 'playlist') return 'col-span-1 row-span-1';
    if (submission.category === 'art' || submission.category === 'fashion') return 'col-span-1 md:col-span-2 row-span-2';
    if (submission.category === 'in-conversation') return 'col-span-1 md:col-span-2 row-span-1';
    return 'col-span-1 row-span-1';
  };

  const getCardAspect = (submission: Submission) => {
    if (submission.category === 'art' || submission.category === 'fashion') return 'aspect-[4/5]';
    if (submission.category === 'in-conversation') return 'aspect-[8/5]';
    return 'aspect-[5/4]';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
      {displaySubmissions.map((submission) => (
        <Card 
          key={submission.id}
          className={`${getCardSize(submission)} bg-card border-border transition-all duration-500 hover:bg-muted/50 hover:border-[var(--editorial)]/30 hover:shadow-lg cursor-pointer group overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1`}
          onClick={() => handleCardClick(submission)}
        >
          <CardContent className="p-0">
            {/* Dynamic Visual Header */}
            <div className={`relative ${getCardAspect(submission)} bg-gradient-to-br from-[var(--editorial)]/20 to-amber-500/20 overflow-hidden`}>
              {/* Image preview for visual content */}
              {(submission.category === 'art' || submission.category === 'fashion') && submission.files?.[0] ? (
                <div className="relative h-full">
                  <img 
                    src={submission.files[0]} 
                    alt={submission.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                  {/* Content preview overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-white text-sm font-medium">View Gallery</span>
                    </div>
                  </div>
                </div>
              ) : submission.contentType === 'playlist' && submission.collaborationLinks?.[0] ? (
                <div className="relative">
                  <PlaylistEmbed 
                    url={submission.collaborationLinks[0]} 
                    title={submission.title}
                    description={submission.description}
                    compact={true}
                  />
                  <div className="absolute top-2 left-2 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-full px-2 py-1">
                    <span className="text-green-400 text-xs font-medium">Radio Ready</span>
                  </div>
                  {/* Music player overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/10 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Text content preview */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <p className="text-white/90 text-sm line-clamp-3 mb-3">
                        {submission.description.substring(0, 120)}...
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                          <span className="text-white text-xs font-medium">
                            {submission.category === 'poetry' ? 'Read Poem' : 'Read Article'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                    {getCategoryIcon(submission.category, submission.contentType)}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 right-4">
                <Badge className={`${getCategoryColor(submission.category, submission.contentType)} text-sm font-medium transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                  {submission.contentType === 'playlist' ? 'Playlist' : submission.category}
                </Badge>
              </div>
              {submission.category !== 'quick-share' && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600/80 text-white text-xs font-medium border border-purple-500/50 transition-all duration-500 group-hover:bg-purple-500">
                    Editorial
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 transition-all duration-500">
              {/* Title with dynamic sizing */}
              <h3 className="text-foreground font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[var(--editorial)] transition-all duration-500">
                {submission.title}
              </h3>

              {/* Description with content-specific styling */}
              {submission.category !== 'art' && submission.category !== 'fashion' && (
                <p className={`text-muted-foreground leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-500 ${
                  submission.category === 'in-conversation' ? 'text-sm line-clamp-2' : 'text-sm line-clamp-3'
                }`}>
                  {submission.description}
                </p>
              )}

              {/* Content type indicators */}
              <div className="flex items-center space-x-3 mb-3">
                {submission.contentType === 'playlist' && (
                  <div className="flex items-center space-x-2 text-green-400 text-xs">
                    <Music className="w-3 h-3" />
                    <span>Radio Ready</span>
                  </div>
                )}
                {submission.category === 'poetry' && (
                  <div className="flex items-center space-x-2 text-purple-400 text-xs">
                    <PenTool className="w-3 h-3" />
                    <span>Original Poetry</span>
                  </div>
                )}
                {(submission.category === 'art' || submission.category === 'fashion') && (
                  <div className="flex items-center space-x-2 text-orange-400 text-xs">
                    <Palette className="w-3 h-3" />
                    <span>{submission.files?.length || 1} Image{(submission.files?.length || 0) > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="group-hover:text-[var(--editorial)] transition-colors duration-500">{submission.submitterHandle}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-4 h-4 text-[var(--editorial)] group-hover:text-[var(--editorial)]/70 transition-colors duration-500" />
                    <span>{submission.likes || 0}</span>
                  </div>
                  <span className="font-medium">
                    {formatDate(submission.createdAt || new Date())}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <ContentModal 
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Real-time connection indicator */}
      {!isConnected && (
        <div className="fixed bottom-4 right-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-3 py-2">
          <span className="text-yellow-400 text-xs">Reconnecting to live updates...</span>
        </div>
      )}
    </div>
  );
}