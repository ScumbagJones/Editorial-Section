import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Music, 
  Palette, 
  Camera, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function SubmissionGuidelines() {
  const contentTypes = [
    {
      type: "Poems & Writing",
      icon: <FileText className="w-5 h-5" />,
      color: "text-purple-400",
      guidelines: [
        "Original poetry, short stories, or creative writing",
        "Clear formatting with line breaks for poems",
        "500-2000 words for longer pieces",
        "Include context about inspiration or meaning"
      ],
      examples: ["Personal poems", "Short creative pieces", "Reflective writing"]
    },
    {
      type: "Art & Sketches",
      icon: <Palette className="w-5 h-5" />,
      color: "text-orange-400",
      guidelines: [
        "High-resolution images (min 800px width)",
        "Multiple angles for 3D work",
        "Brief description of medium and process",
        "Original work only - no copies or references"
      ],
      examples: ["Digital art", "Pencil sketches", "Paintings", "Mixed media"]
    },
    {
      type: "Playlists",
      icon: <Music className="w-5 h-5" />,
      color: "text-green-400",
      guidelines: [
        "Keep under 1 hour for radio consideration",
        "Include story behind song choices",
        "Spotify, Apple Music, or YouTube links",
        "Explain the mood or theme"
      ],
      examples: ["Mood playlists", "Themed collections", "Discovery mixes"],
      special: "Radio Ready"
    },
    {
      type: "Fashion & Fits",
      icon: <Camera className="w-5 h-5" />,
      color: "text-pink-400",
      guidelines: [
        "Clear, well-lit photos",
        "Include outfit details and brands",
        "Multiple angles if possible",
        "Context about the look or occasion"
      ],
      examples: ["Daily outfits", "Thrift finds", "Special occasion looks"]
    }
  ];

  const submissionFlow = [
    {
      step: "Community Feed",
      description: "Direct to community - no review needed",
      icon: <Users className="w-4 h-4" />,
      color: "text-blue-400"
    },
    {
      step: "Editorial Review",
      description: "For longer pieces and formal submissions",
      icon: <Star className="w-4 h-4" />,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Content Type Guidelines */}
      <Card className="bg-[var(--charcoal)] border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Content Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {contentTypes.map((content, index) => (
            <div key={index} className="border border-border/50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={content.color}>
                  {content.icon}
                </div>
                <h3 className="text-white font-semibold">{content.type}</h3>
                {content.special && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    {content.special}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Guidelines:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {content.guidelines.map((guideline, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-pink-400 mt-0.5">•</span>
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {content.examples.map((example, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submission Flow */}
      <Card className="bg-[var(--charcoal)] border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            <span>Submission Paths</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissionFlow.map((flow, index) => (
              <div key={index} className="border border-border/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={flow.color}>
                    {flow.icon}
                  </div>
                  <h3 className="text-white font-semibold">{flow.step}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {flow.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Standards */}
      <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Star className="w-6 h-6 text-pink-400 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Community Standards</h3>
              <p className="text-muted-foreground text-sm mb-3">
                We're building a thoughtful, supportive creative community. Quality over quantity always.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Original Work</Badge>
                <Badge variant="outline" className="text-xs">Thoughtful Curation</Badge>
                <Badge variant="outline" className="text-xs">Constructive Community</Badge>
                <Badge variant="outline" className="text-xs">Creative Expression</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}