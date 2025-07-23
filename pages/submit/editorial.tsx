import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function SubmitEditorial() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submitterHandle: '',
    submitterEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Editorial submission:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/submit">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Submit
              </Button>
            </Link>
          </div>

          <Card className="border-[var(--editorial)]/30 bg-[var(--editorial)]/5">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Pitch for Print</CardTitle>
              <p className="text-muted-foreground">
                Got something bigger in mind? Tell us about your idea for an interview, photo series, or deeper story.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">What's your idea?</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Interview with local artist, photo series on..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Tell us more</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="What's the story? Why should we feature this? What makes it interesting?"
                    className="min-h-[120px] resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submitterHandle">Your Name</Label>
                    <Input
                      id="submitterHandle"
                      value={formData.submitterHandle}
                      onChange={(e) => setFormData({...formData, submitterHandle: e.target.value})}
                      placeholder="How should we credit you?"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="submitterEmail">Email</Label>
                    <Input
                      id="submitterEmail"
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => setFormData({...formData, submitterEmail: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Pitch
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}