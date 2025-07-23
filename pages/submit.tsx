import { useState } from "react";
import Navigation from "@/components/navigation";
import SubmissionWizard from "@/components/submission-wizard";
import LiveRadioNotice from "@/components/live-radio-notice";
import SubmissionGuidelines from "@/components/submission-guidelines";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ArrowLeft, Palette, PenTool, Music, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function Submit() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-white mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-pink-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Share What You're Enamored With</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Poems, drawings, discoveries, moments - whatever caught your attention and made you feel something
            </p>
          </div>

          <LiveRadioNotice />

          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[var(--slate)]/20 border-border">
              <TabsTrigger value="submit" className="text-white data-[state=active]:bg-pink-600">
                Submit Content
              </TabsTrigger>
              <TabsTrigger value="guidelines" className="text-white data-[state=active]:bg-pink-600">
                <BookOpen className="w-4 h-4 mr-2" />
                Guidelines
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-[var(--charcoal)] border-border">
              <CardContent className="pt-6 text-center">
                <PenTool className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Poems & Writing</h3>
                <p className="text-muted-foreground text-sm">
                  Share your original poems, thoughts, or creative writing pieces
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--charcoal)] border-border">
              <CardContent className="pt-6 text-center">
                <Palette className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Art & Drawings</h3>
                <p className="text-muted-foreground text-sm">
                  Show us your drawings, digital art, or creative visual work
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--charcoal)] border-border border-green-500/30">
              <CardContent className="pt-6 text-center">
                <Music className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Playlists & Discoveries</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Share playlists, links, moments, or discoveries that moved you
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-3">
                  <p className="text-green-400 text-xs font-medium">
                    ◉ Live Radio Feature: Keep playlists under 1 hour for potential airtime!
                  </p>
                </div>
              </CardContent>
            </Card>
              </div>

              <div className="text-center">
                <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30 p-8">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to Share?</h3>
                    <p className="text-muted-foreground mb-6">
                      This goes straight to the community feed - no waiting, no complex review process. 
                      Just you sharing what you're passionate about.
                    </p>
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="bg-pink-600 text-white hover:bg-pink-700 transition-all duration-300 transform hover:scale-105"
                      size="lg"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Share Now
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground text-sm">
                  Looking to submit more formal work for editorial consideration?{" "}
                  <Link href="/editorials">
                    <span className="text-pink-400 hover:text-pink-300 cursor-pointer">
                      Visit our Editorial section
                    </span>
                  </Link>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="guidelines" className="mt-8">
              <SubmissionGuidelines />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showForm && (
        <SimpleCommunityForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}