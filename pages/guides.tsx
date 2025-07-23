import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Headphones, Disc, Radio } from "lucide-react";
import { Link } from "wouter";

export default function Guides() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 pb-16 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-[var(--charcoal)]/70 hover:text-[var(--charcoal)] mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--charcoal)]">Cultural Guides</CardTitle>
                <p className="text-[var(--charcoal)]/70">
                  Deep-dives into music, art, and cultural movements
                </p>
              </CardHeader>
            </Card>
          </div>

          {/* Guide Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Music className="w-8 h-8 text-[var(--editorial)]" />
                  <h3 className="text-lg font-semibold text-[var(--charcoal)]">Music Essentials</h3>
                </div>
                <p className="text-[var(--charcoal)]/70 text-sm mb-4">
                  Genre guides, artist spotlights, and essential listening recommendations.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-[var(--charcoal)]/50">Coming Soon:</div>
                  <div className="text-sm text-[var(--charcoal)]">• Earl Sweatshirt Deep-dive</div>
                  <div className="text-sm text-[var(--charcoal)]">• Jazz Essentials for Beginners</div>
                  <div className="text-sm text-[var(--charcoal)]">• Electronic Underground</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Headphones className="w-8 h-8 text-[var(--editorial)]" />
                  <h3 className="text-lg font-semibold text-[var(--charcoal)]">Listening Guides</h3>
                </div>
                <p className="text-[var(--charcoal)]/70 text-sm mb-4">
                  How to discover new music and develop your taste.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-[var(--charcoal)]/50">Coming Soon:</div>
                  <div className="text-sm text-[var(--charcoal)]">• Building Your First Vinyl Collection</div>
                  <div className="text-sm text-[var(--charcoal)]">• Concert Etiquette Guide</div>
                  <div className="text-sm text-[var(--charcoal)]">• Streaming vs. Physical Media</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Radio className="w-8 h-8 text-[var(--editorial)]" />
                  <h3 className="text-lg font-semibold text-[var(--charcoal)]">Radio Culture</h3>
                </div>
                <p className="text-[var(--charcoal)]/70 text-sm mb-4">
                  Understanding independent radio and community broadcasting.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-[var(--charcoal)]/50">Coming Soon:</div>
                  <div className="text-sm text-[var(--charcoal)]">• Starting Your Own Radio Show</div>
                  <div className="text-sm text-[var(--charcoal)]">• Best Independent Stations</div>
                  <div className="text-sm text-[var(--charcoal)]">• Radio as Art Form</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty State with Call to Action */}
          <Card className="bg-[var(--editorial)]/5 border-[var(--editorial)]/20">
            <CardContent className="pt-6 pb-6 text-center">
              <Disc className="w-16 h-16 text-[var(--editorial)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-4">Guides Coming Soon</h3>
              <p className="text-[var(--charcoal)]/70 mb-6 max-w-2xl mx-auto">
                We're working on comprehensive cultural guides and music deep-dives. 
                Want to contribute a guide or suggest a topic?
              </p>
              <Link href="/submit">
                <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium">
                  Pitch a Guide
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}