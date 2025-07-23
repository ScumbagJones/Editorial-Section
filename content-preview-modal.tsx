import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ExternalLink, Calendar, User, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Submission } from "@shared/schema";

interface ContentPreviewModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentPreviewModal({ submission, isOpen, onClose }: ContentPreviewModalProps) {
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
        title: "Liked!",
        description: "Thank you for supporting community work.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community-submissions'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    if (submission && !isLiked) {
      likeMutation.mutate(submission.id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'art':
        return 'category-art';
      case 'fashion':
        return 'category-fashion';
      case 'photography':
        return 'category-photography';
      case 'mixed':
        return 'category-mixed';
      default:
        return 'category-art';
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-[var(--charcoal)] to-[var(--slate)] border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">{submission.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge className={getCategoryColor(submission.category)}>
                {submission.category}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <User className="w-4 h-4 mr-1" />
                <span>{submission.submitterHandle}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description */}
            <Card className="bg-[var(--navy)]/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg text-white">About This Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{submission.description}</p>
              </CardContent>
            </Card>

            {/* Files & Links */}
            {submission.files && submission.files.length > 0 && (
              <Card className="bg-[var(--navy)]/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Files & Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {submission.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[var(--slate)] rounded-lg">
                        <span className="text-white text-sm truncate flex-1">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openLink(file)}
                          className="text-editorial hover:text-blue-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            {submission.submitterEmail && (
              <Card className="bg-[var(--navy)]/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{submission.submitterEmail}</p>
                  {submission.socialHandle && (
                    <p className="text-muted-foreground">{submission.socialHandle}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            onClick={handleLike}
            disabled={isLiked || likeMutation.isPending}
            className={`flex items-center space-x-2 ${
              isLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--navy)] hover:bg-[var(--slate)]'
            } text-white`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{isLiked ? 'Liked' : 'Like'} ({submission.likes})</span>
          </Button>
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}