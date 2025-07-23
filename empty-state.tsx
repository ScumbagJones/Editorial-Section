import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface EmptyStateProps {
  type: 'featured' | 'community' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
}

export default function EmptyState({ 
  type, 
  title, 
  description, 
  actionText, 
  actionLink 
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'featured':
        return {
          icon: Sparkles,
          title: title || "No Featured Stories Yet",
          description: description || "Featured stories will appear here once we have real editorial content to showcase.",
          actionText: actionText || "Submit Your Work",
          actionLink: actionLink || "/submit"
        };
      case 'community':
        return {
          icon: Upload,
          title: title || "Be the First to Share",
          description: description || "No community submissions yet. Share your art, writing, music, or discoveries with the community.",
          actionText: actionText || "Submit Something",
          actionLink: actionLink || "/submit"
        };
      default:
        return {
          icon: Plus,
          title: title || "Nothing Here Yet",
          description: description || "Content will appear here once submissions are made.",
          actionText: actionText || "Get Started",
          actionLink: actionLink || "/submit"
        };
    }
  };

  const content = getContent();
  const IconComponent = content.icon;

  return (
    <Card className="border-dashed border-2 border-border/50">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <IconComponent className="w-8 h-8 text-[var(--editorial)]" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {content.title}
        </h3>
        
        <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
          {content.description}
        </p>
        
        <Link href={content.actionLink}>
          <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white">
            {content.actionText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}