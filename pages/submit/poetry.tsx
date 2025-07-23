import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Send } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function SubmitPoetry() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    bio: '',
    socialHandle: '',
    substackUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle poetry submission
    console.log('Poetry submission:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/submit">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Submit
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FileText className="w-12 h-12 text-[var(--editorial)]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Submit Poetry & Writing</h1>
            <p className="text-muted-foreground">
              Share your poems, stories, and creative writing with the community
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Writing</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Give your piece a title..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Your Writing</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Share your poem, story, or creative writing here..."
                    className="min-h-[300px] resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    For poetry, make sure to include line breaks as you want them to appear
                  </p>
                </div>

                <div>
                  <Label htmlFor="bio">About You (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us a little about yourself or the inspiration behind this piece..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="substackUrl">Substack Article URL (Optional)</Label>
                  <Input
                    id="substackUrl"
                    value={formData.substackUrl}
                    onChange={(e) => setFormData({...formData, substackUrl: e.target.value})}
                    placeholder="https://yourname.substack.com/p/your-article"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Link to your Substack article for dynamic content pulling
                  </p>
                </div>

                <div>
                  <Label htmlFor="socialHandle">Social Handle (Optional)</Label>
                  <Input
                    id="socialHandle"
                    value={formData.socialHandle}
                    onChange={(e) => setFormData({...formData, socialHandle: e.target.value})}
                    placeholder="@yourhandle or instagram.com/yourhandle"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Your Writing
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}