import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, Calendar, User, ChevronDown, ChevronUp, File, Music } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Submission } from "@shared/schema";
import PlaylistEmbed from "./playlist-embed";

interface InlineContentCardProps {
  submission: Submission;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function InlineContentCard({ submission, isExpanded, onToggle }: InlineContentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/submissions/${id}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      setIsLiked(true);
      toast({
        title: "Liked",
        description: "Thank you for supporting community work.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community-submissions'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like submission.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    if (!isLiked) {
      likeMutation.mutate(submission.id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'art':
        return 'bg-orange-500/20 text-orange-300';
      case 'fashion':
        return 'bg-purple-500/20 text-purple-300';
      case 'photography':
        return 'bg-blue-500/20 text-blue-300';
      case 'mixed':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderContent = () => {
    // Handle playlist content
    if (submission.contentType === 'playlist' && submission.collaborationLinks?.[0]) {
      return (
        <div className="mt-4">
          <PlaylistEmbed 
            url={submission.collaborationLinks[0]} 
            title={submission.title}
            description={submission.description}
          />
        </div>
      );
    }

    // Handle regular content
    return (
      <div className="mt-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {isExpanded ? submission.description : `${submission.description.substring(0, 150)}${submission.description.length > 150 ? '...' : ''}`}
        </p>
        
        {submission.description.length > 150 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className="mt-2 text-pink-400 hover:text-pink-300 p-0 h-auto"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Read More
              </>
            )}
          </Button>
        )}
        
        {submission.collaborationLinks && submission.collaborationLinks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {submission.collaborationLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-pink-400 hover:text-pink-300 transition-colors text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Source</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-[var(--slate)]/30 border-border/50 transition-all duration-200 hover:bg-[var(--slate)]/40">
      <CardContent className="p-4">
        {/* Collapsed View */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-white font-medium truncate">{submission.title}</h3>
                <Badge className={`${getCategoryColor(submission.category)} text-xs`}>
                  {submission.category}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{submission.submitterHandle}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(submission.createdAt)}</span>
                </div>
                {submission.files && submission.files.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <File className="w-3 h-3" />
                    <span>{submission.files.length} file{submission.files.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiked || likeMutation.isPending}
              className="h-8 px-2 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-400 text-red-400' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/30">
            {renderContent()}
          </div>
        )}

        {/* Show playlist indicator in collapsed view */}
        {!isExpanded && submission.contentType === 'playlist' && (
          <div className="mt-2 flex items-center space-x-2">
            <Music className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Playlist</span>
          </div>
        )}
                    {submission.collaborationLinks.map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link, '_blank')}
                        className="h-7 px-2 text-xs border-border/50 hover:border-border"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Link {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Status indicator for approved content */}
              {submission.status === 'approved' && (
                <div className="text-xs text-green-400">
                  ✓ Featured in community archive
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}