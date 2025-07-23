import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Palette, MapPin, Heart, Clock, BookOpen } from "lucide-react";

export default function EditorialSubmissionGuide() {
  return (
    <div className="space-y-6">
      <Card className="bg-[var(--charcoal)] border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-pink-400" />
            <span>Editorial vs Community Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editorial Content */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Editorial Content</h3>
              <p className="text-muted-foreground text-sm">
                Thoughtful, developed pieces that tell a story or explore ideas in depth
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">In Conversation</p>
                    <p className="text-muted-foreground text-xs">Interviews, cultural commentary, thoughtful discussions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Palette className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">Creative Work</p>
                    <p className="text-muted-foreground text-xs">Art series, photography projects, creative writing with context</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">Local Stories</p>
                    <p className="text-muted-foreground text-xs">Community features, local culture, neighborhood stories</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
                <p className="text-pink-300 text-xs">
                  <strong>What makes it editorial:</strong> Depth, context, storytelling, cultural insight
                </p>
              </div>
            </div>

            {/* Community Content */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Community Content</h3>
              <p className="text-muted-foreground text-sm">
                Spontaneous shares, quick discoveries, and casual enamored moments
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-pink-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">Quick Share</p>
                    <p className="text-muted-foreground text-xs">Songs, moments, discoveries, things that caught your eye</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">In the Moment</p>
                    <p className="text-muted-foreground text-xs">Real-time reactions, quick thoughts, immediate impressions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-300 text-xs">
                  <strong>What makes it community:</strong> Spontaneity, immediate reaction, casual sharing
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-white font-medium mb-3">Examples to Help You Choose:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <Badge className="bg-pink-500/20 text-pink-300">Editorial</Badge>
                <ul className="text-muted-foreground space-y-1">
                  <li>• "How this local artist is redefining..."</li>
                  <li>• "A photo series about gentrification in..."</li>
                  <li>• "Interview with the owner of..."</li>
                  <li>• "Why this album matters to our community"</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Badge className="bg-blue-500/20 text-blue-300">Community</Badge>
                <ul className="text-muted-foreground space-y-1">
                  <li>• "This song is stuck in my head"</li>
                  <li>• "Found this beautiful mural today"</li>
                  <li>• "Quick sketch from my morning walk"</li>
                  <li>• "This coffee shop has the best vibes"</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}