import Navigation from "@/components/navigation";
import LiveRadioNotice from "@/components/live-radio-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft, Palette, PenTool, Music } from "lucide-react";
import { Link } from "wouter";

export default function SubmitClean() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-[var(--editorial)]" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Share Your Work</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Show us what you've been creating - essays, art, photos, discoveries, whatever
            </p>
          </div>

          <LiveRadioNotice />

          {/* Content type selection cards - clickable and consistent */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/submit/poetry">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-[var(--editorial)]">
              <CardContent className="pt-6 text-center space-y-4">
                <PenTool className="w-8 h-8 text-purple-500 mx-auto" />
                <div>
                  <h3 className="text-foreground font-semibold mb-2">Writing & Poetry</h3>
                  <p className="text-muted-foreground text-sm">
                    Essays, poems, stories - whatever you've been writing
                  </p>
                </div>
                <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white w-full font-medium">
                  Submit Writing
                </Button>
              </CardContent>
            </Card>
            </Link>

            <Link href="/submit/art">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-[var(--editorial)]">
              <CardContent className="pt-6 text-center space-y-4">
                <Palette className="w-8 h-8 text-orange-500 mx-auto" />
                <div>
                  <h3 className="text-foreground font-semibold mb-2">Art & Visual Work</h3>
                  <p className="text-muted-foreground text-sm">
                    Sketches, photos, digital art - show us what you see
                  </p>
                </div>
                <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white w-full font-medium">
                  Submit Art
                </Button>
              </CardContent>
            </Card>
            </Link>

            <Link href="/submit/playlist">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-[var(--editorial)]">
              <CardContent className="pt-6 text-center space-y-4">
                <Music className="w-8 h-8 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-foreground font-semibold mb-2">Music & Playlists</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Songs you've been into, playlists you've made
                  </p>

                </div>
                <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white w-full font-medium">
                  Submit Playlist
                </Button>
              </CardContent>
            </Card>
            </Link>
          </div>

          {/* Editorial submissions - simple and casual */}
          <Card className="border-[var(--editorial)]/30 bg-[var(--editorial)]/5">
            <CardContent className="pt-6 pb-6 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Want to be in print?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you've got something bigger in mind - an interview, photo series, or deeper story - let us know
              </p>
              <Link href="/submit/editorial">
                <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium">
                  Tell us about it
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}