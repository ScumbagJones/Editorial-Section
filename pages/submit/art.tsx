import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Palette, Send, Upload } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function SubmitArt() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    process: '',
    socialHandle: '',
    images: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle art submission
    console.log('Art submission:', formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Handle image upload logic here
    console.log('Files to upload:', files);
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
              <Palette className="w-12 h-12 text-[var(--editorial)]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Submit Art & Visual Work</h1>
            <p className="text-muted-foreground">
              Share your drawings, digital art, photography, and creative visual work
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Artwork</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="images">Upload Your Images</Label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-muted-foreground/50 px-6 py-10 hover:border-[var(--editorial)]/50 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-[var(--editorial)] hover:text-[var(--editorial)]/80"
                        >
                          <span>Upload files</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title of Your Work</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Give your artwork a title..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell us about your artwork. What inspired you? What does it mean to you?"
                    className="min-h-[120px] resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medium">Medium/Tools Used</Label>
                    <Input
                      id="medium"
                      value={formData.medium}
                      onChange={(e) => setFormData({...formData, medium: e.target.value})}
                      placeholder="Digital art, pencil, watercolor, Procreate..."
                    />
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
                </div>

                <div>
                  <Label htmlFor="process">Creative Process (Optional)</Label>
                  <Textarea
                    id="process"
                    value={formData.process}
                    onChange={(e) => setFormData({...formData, process: e.target.value})}
                    placeholder="How long did this take? Any interesting techniques or challenges?"
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Your Artwork
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}