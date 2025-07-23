import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, User } from "lucide-react";
import { Submission } from "@shared/schema";

interface ExternalContentPreviewProps {
  submission: Submission;
}

export default function ExternalContentPreview({ submission }: ExternalContentPreviewProps) {
  const getPlatformInfo = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'substack':
        return { name: 'Substack', color: 'bg-orange-600' };
      case 'youtube':
        return { name: 'YouTube', color: 'bg-red-600' };
      case 'vimeo':
        return { name: 'Vimeo', color: 'bg-blue-600' };
      case 'soundcloud':
        return { name: 'SoundCloud', color: 'bg-orange-500' };
      default:
        return { name: 'External', color: 'bg-[var(--editorial)]' };
    }
  };

  const platform = getPlatformInfo(submission.externalPlatform || '');
  
  // Use original excerpt if available, otherwise fall back to description
  const previewText = submission.originalExcerpt || submission.description;
  
  // Use original author if available, otherwise fall back to submitter
  const authorName = submission.originalAuthor || submission.submitterHandle;
  
  // Format original date if available
  const displayDate = submission.originalDate 
    ? new Date(submission.originalDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date(submission.createdAt || new Date()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  return (
    <div className="space-y-4">
      {/* Platform Badge */}
      <div className="flex items-center justify-between">
        <Badge className={`${platform.color} text-white`}>
          {platform.name}
        </Badge>
        {submission.section === 'editorial' && (
          <Badge variant="outline" className="text-[var(--editorial)] border-[var(--editorial)]">
            Editorial
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-foreground line-clamp-2">
        {submission.title}
      </h3>

      {/* Original excerpt - first 2-3 sentences from source */}
      <p className="text-muted-foreground leading-relaxed line-clamp-3">
        {previewText}
      </p>

      {/* Author and date info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>By {authorName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{displayDate}</span>
        </div>
      </div>

      {/* Read more button */}
      {submission.collaborationLinks?.[0] && (
        <Button
          variant="outline"
          className="w-full flex items-center space-x-2 hover:bg-[var(--editorial)]/10 hover:border-[var(--editorial)]"
          onClick={() => window.open(submission.collaborationLinks![0], '_blank')}
        >
          <span>Read Full Article</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      )}

      {/* Submitter attribution if different from original author */}
      {submission.originalAuthor && submission.originalAuthor !== submission.submitterHandle && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Shared by {submission.socialHandle || submission.submitterHandle}
          </p>
        </div>
      )}
    </div>
  );
}