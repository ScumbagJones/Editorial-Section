import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Play, Volume2, ExternalLink, FileText } from "lucide-react";

export default function ContentManagementGuide() {
  return (
    <div className="space-y-6">
      <Card className="bg-[var(--charcoal)] border-border">
        <CardHeader>
          <CardTitle className="text-white">Content Management System</CardTitle>
          <p className="text-muted-foreground">
            How Enamorado handles different types of submissions and editorial workflows
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Content Types */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Supported Content Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--navy)] rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium text-white">Text Content</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Essays, articles, poetry, creative writing uploaded directly or via Google Docs
                </p>
              </div>
              
              <div className="p-4 bg-[var(--navy)] rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <ExternalLink className="w-5 h-5 text-orange-500" />
                  <h4 className="font-medium text-white">Substack Essays</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  External essays from Substack with automatic attribution and linking
                </p>
              </div>
              
              <div className="p-4 bg-[var(--navy)] rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="w-5 h-5 text-red-500" />
                  <h4 className="font-medium text-white">Video Essays</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  YouTube, Vimeo, or other video platforms with embedded preview
                </p>
              </div>
              
              <div className="p-4 bg-[var(--navy)] rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium text-white">Audio Content</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  SoundCloud, podcasts, or other audio content with player integration
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Status */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Editorial Status System</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-[var(--navy)] rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    New submissions waiting for editorial review
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-[var(--navy)] rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <Badge className="bg-blue-100 text-blue-800">Ready to Publish</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Content is editorial-quality and ready for the Editorial Archive
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-[var(--navy)] rounded-lg">
                <CheckCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <Badge className="bg-orange-100 text-orange-800">Needs Minor Edits</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Good content that needs small improvements before publication
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-[var(--navy)] rounded-lg">
                <XCircle className="w-5 h-5 text-purple-500" />
                <div>
                  <Badge className="bg-purple-100 text-purple-800">Different Direction</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Content that doesn't fit current editorial direction but may be reconsidered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Editorial Workflow</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-pink-500 pl-4 py-2">
                <h4 className="font-medium text-white">1. Submission</h4>
                <p className="text-sm text-muted-foreground">
                  Users submit content via the submission form, including external links (Substack, YouTube, etc.)
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-white">2. Content Detection</h4>
                <p className="text-sm text-muted-foreground">
                  System automatically detects content type and platform for proper display and attribution
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-medium text-white">3. Editorial Review</h4>
                <p className="text-sm text-muted-foreground">
                  Editors review submissions in the Editorial Management panel, providing constructive feedback
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-medium text-white">4. Publication</h4>
                <p className="text-sm text-muted-foreground">
                  Approved content appears in Editorial Archive or Community section with proper attribution
                </p>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Special Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                <h4 className="font-medium text-white mb-2">Substack Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Automatic detection of Substack essays with special styling, attribution, and direct linking to original posts
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                <h4 className="font-medium text-white mb-2">Video Essay Support</h4>
                <p className="text-sm text-muted-foreground">
                  YouTube and Vimeo video essays with thumbnail previews and embedded player support
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                <h4 className="font-medium text-white mb-2">Community-Friendly Moderation</h4>
                <p className="text-sm text-muted-foreground">
                  Constructive feedback system that encourages diverse voices while maintaining editorial standards
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <h4 className="font-medium text-white mb-2">Dual Archive System</h4>
                <p className="text-sm text-muted-foreground">
                  Editorial Archive for curated content and Community Archive for all approved submissions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}