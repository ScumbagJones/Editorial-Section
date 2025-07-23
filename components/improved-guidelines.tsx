import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Music, 
  Palette, 
  Camera, 
  CheckCircle,
  Zap
} from "lucide-react";

export default function ImprovedGuidelines() {
  const contentTypes = [
    {
      type: "Poetry & Writing",
      icon: <FileText className="w-5 h-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      guidelines: [
        "Original poetry, short stories, or creative writing",
        "Clear formatting with line breaks for poems",
        "500-2000 words for longer pieces",
        "Include context about inspiration or meaning"
      ],
      examples: ["Personal Poetry", "Short Stories", "Creative Essays", "Song Lyrics"]
    },
    {
      type: "Art & Visual Work",
      icon: <Palette className="w-5 h-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      guidelines: [
        "High-resolution images (minimum 800px width)",
        "Multiple angles for 3D or sculptural work",
        "Brief description of medium and creative process",
        "Original work only - no copies or references"
      ],
      examples: ["Digital Art", "Pencil Sketches", "Paintings", "Photography"]
    },
    {
      type: "Playlists & Music",
      icon: <Music className="w-5 h-5" />,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      guidelines: [
        "Keep under 1 hour for live radio consideration",
        "Include the story behind your song choices",
        "Spotify, Apple Music, or YouTube playlist links",
        "Explain the mood, theme, or emotional journey"
      ],
      examples: ["Mood Playlists", "Themed Collections", "Genre Explorations", "Discovery Mixes"],
      special: "Radio Ready"
    },
    {
      type: "Fashion & Style",
      icon: <Camera className="w-5 h-5" />,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      guidelines: [
        "Clear, well-lit photos showing outfit details",
        "Include brands, thrift finds, or styling notes",
        "Multiple angles to show the complete look",
        "Context about the occasion or inspiration"
      ],
      examples: ["Daily Outfits", "Thrift Finds", "Special Occasions", "Street Style"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Submission Guidelines</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about sharing your creative work with the Enamorado community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {contentTypes.map((type) => (
          <Card key={type.type} className={`${type.borderColor} border-2 hover:shadow-md transition-shadow`}>
            <CardHeader className={`${type.bgColor} rounded-t-lg`}>
              <CardTitle className="flex items-center space-x-3">
                <div className={type.color}>
                  {type.icon}
                </div>
                <div>
                  <span className="text-foreground">{type.type}</span>
                  {type.special && (
                    <Badge className="ml-2 bg-green-600 text-white text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {type.special}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              {/* Guidelines with better contrast */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Guidelines</h4>
                <div className="space-y-2">
                  {type.guidelines.map((guideline, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90 text-sm leading-relaxed">{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real examples instead of empty bubbles */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Examples</h4>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example) => (
                    <Badge 
                      key={example} 
                      variant="outline" 
                      className={`${type.color.replace('text-', 'border-')} ${type.color.replace('text-', 'text-')} bg-background hover:${type.bgColor} cursor-default`}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community approach */}
      <Card className="border-[var(--editorial)]/20 bg-gradient-to-br from-[var(--editorial)]/5 to-background">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-foreground">Community-First Approach</h3>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              We believe in nurturing creativity over gatekeeping. Every submission goes directly to the community feed, 
              with editorial curation happening transparently to highlight exceptional work.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground pt-4">
              <span>✓ No rejection emails</span>
              <span>✓ Constructive feedback</span>
              <span>✓ Community celebration</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}