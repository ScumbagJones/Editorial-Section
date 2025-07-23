import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubmissionSchema, type InsertSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, Heart, ExternalLink } from "lucide-react";

interface SimpleCommunityFormProps {
  onClose: () => void;
}

export default function SimpleCommunityForm({ onClose }: SimpleCommunityFormProps) {
  const [externalLink, setExternalLink] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSubmission>({
    resolver: zodResolver(insertSubmissionSchema),
    defaultValues: {
      title: '',
      description: '',
      submitterHandle: '',
      submitterEmail: '',
      category: 'quick-share',
      contentType: 'text',
      files: [],
      collaborationLinks: [],
    },
  });

  const createSubmissionMutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const response = await apiRequest('POST', '/api/submissions', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Shared Successfully!",
        description: "Your discovery is now live in the community feed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community-submissions'] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Helper function to detect playlist URLs
  const detectContentType = (url: string): string => {
    if (!url.trim()) return 'text';
    
    // Spotify playlist detection
    if (url.includes('open.spotify.com/playlist/')) return 'playlist';
    
    // Apple Music playlist detection
    if (url.includes('music.apple.com') && url.includes('playlist')) return 'playlist';
    
    // YouTube playlist detection
    if (url.includes('youtube.com/playlist') || url.includes('youtu.be/playlist')) return 'playlist';
    
    // Default to link for other URLs
    return 'link';
  };

  const onSubmit = (data: InsertSubmission) => {
    const links = externalLink.trim() ? [externalLink.trim()] : [];
    const contentType = detectContentType(externalLink);
    
    createSubmissionMutation.mutate({
      ...data,
      collaborationLinks: links,
      contentType,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gradient-to-br from-[var(--charcoal)] to-[var(--slate)] border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <CardTitle className="text-xl text-white">Share Something Cool</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Poems, drawings, discoveries, links, moments - whatever caught your attention
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white font-medium">
                What is it? *
              </Label>
              <Input
                {...form.register('title')}
                placeholder="A poem, a drawing, a song, a moment..."
                className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
              />
              {form.formState.errors.title && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-white font-medium">
                Why are you enamored? *
              </Label>
              <Textarea
                {...form.register('description')}
                placeholder="Share your poem, describe your drawing, or tell us what drew you to this..."
                rows={4}
                className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500 resize-none"
              />
              {form.formState.errors.description && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="link" className="text-white font-medium">
                Link or Image (Optional)
              </Label>
              <div className="flex space-x-2">
                <ExternalLink className="w-4 h-4 text-gray-400 mt-3" />
                <Input
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="Link to your drawing, playlist, or source..."
                  className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
                />
              </div>
              {detectContentType(externalLink) === 'playlist' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-2">
                  <p className="text-green-400 text-xs font-medium">
                    🎵 Playlist detected! Keep it under 1 hour for potential live radio airtime
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="submitterHandle" className="text-white font-medium">
                Your handle *
              </Label>
              <Input
                {...form.register('submitterHandle')}
                placeholder="@yourname"
                className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
              />
              {form.formState.errors.submitterHandle && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.submitterHandle.message}</p>
              )}
            </div>

            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
              <p className="text-pink-200 text-sm">
                This goes straight to the community feed - no editorial review needed!
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-muted-foreground hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createSubmissionMutation.isPending}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                {createSubmissionMutation.isPending ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}