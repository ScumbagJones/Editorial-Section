import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";

interface ArchiveIssue {
  issue: number;
  season: string;
  year: number;
  theme: string;
  description: string;
  coverImage?: string;
  featured: string[];
}

export default function CleanArchive() {
  const archiveIssues: ArchiveIssue[] = [
    {
      issue: 14,
      season: "Winter",
      year: 2025,
      theme: "Tender Moments",
      description: "Stories of quiet intimacy, gentle discoveries, and the soft spaces between heartbeats",
      featured: ["Poetry", "Photography", "Community Voices"]
    },
    {
      issue: 13,
      season: "Fall",
      year: 2024,
      theme: "Urban Landscapes",
      description: "City rhythms, street art, and the hidden beauty in metropolitan moments",
      featured: ["Street Photography", "Music", "Local Stories"]
    },
    {
      issue: 12,
      season: "Summer",
      year: 2024,
      theme: "Digital Connections",
      description: "How we love, create, and find each other across screens and distances",
      featured: ["Digital Art", "Essays", "Playlists"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Clean header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Archive</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Quarterly themes exploring the intersections of culture, creativity, and community
        </p>
      </div>

      {/* Magazine grid - clean and focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {archiveIssues.map((issue) => (
          <Card 
            key={issue.issue} 
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Magazine cover area */}
              <div className="aspect-[3/4] bg-gradient-to-br from-[var(--editorial)]/20 to-[var(--editorial)]/5 flex items-center justify-center relative overflow-hidden">
                <div className="text-center p-6">
                  <div className="text-6xl font-bold text-[var(--editorial)] mb-2">
                    {issue.issue}
                  </div>
                  <div className="text-sm font-medium text-foreground/60 uppercase tracking-wider">
                    Issue
                  </div>
                </div>
                
                {/* Season badge */}
                <Badge 
                  className="absolute top-4 right-4 bg-background/90 text-foreground border"
                >
                  {issue.season} {issue.year}
                </Badge>
              </div>

              {/* Content details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[var(--editorial)] transition-colors">
                    {issue.theme}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Featured content types */}
                <div className="flex flex-wrap gap-2">
                  {issue.featured.map((feature) => (
                    <Badge 
                      key={feature} 
                      variant="outline" 
                      className="text-xs border-[var(--editorial)]/30 text-[var(--editorial)]"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{issue.season} {issue.year}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span>Issue #{issue.issue}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simple call to action */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-muted-foreground mb-4">
          New issues published quarterly featuring community submissions and editorial content
        </p>
        <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
          <span>Next Issue: Spring 2025</span>
          <span>•</span>
          <span>Theme: TBD by Community</span>
        </div>
      </div>
    </div>
  );
}