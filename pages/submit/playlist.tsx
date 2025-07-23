import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Send, Radio } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function SubmitPlaylist() {
  const [formData, setFormData] = useState({
    playlistLink: '',
    title: '',
    description: '',
    mood: '',
    genre: '',
    duration: '',
    socialHandle: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle playlist submission
    console.log('Playlist submission:', formData);
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
              <Music className="w-12 h-12 text-[var(--editorial)]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Submit Playlist & Music</h1>
            <p className="text-muted-foreground">
              Share your curated music collections and discoveries
            </p>
            <Badge className="mt-2 bg-green-100 text-green-700 border-green-300">
              <Radio className="w-3 h-3 mr-1" />
              Radio Ready - Keep under 1 hour for airtime!
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Playlist</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="playlistLink">Playlist Link</Label>
                  <Input
                    id="playlistLink"
                    value={formData.playlistLink}
                    onChange={(e) => setFormData({...formData, playlistLink: e.target.value})}
                    placeholder="Paste your Spotify, Apple Music, or YouTube playlist link here..."
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    We support Spotify, Apple Music, YouTube Music, and SoundCloud playlists
                  </p>
                </div>

                <div>
                  <Label htmlFor="title">Playlist Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="What do you call this collection?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Tell us about it</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Why do you love these songs? When do you listen to this? Just tell us what you want to share."
                    className="min-h-[120px] resize-none"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="genre">Genre (Optional)</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    placeholder="Indie, electronic, jazz, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (Optional)</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="45 minutes, 1.5 hours..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialHandle">Social Handle (Optional)</Label>
                    <Input
                      id="socialHandle"
                      value={formData.socialHandle}
                      onChange={(e) => setFormData({...formData, socialHandle: e.target.value})}
                      placeholder="@yourhandle"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Your Playlist
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}