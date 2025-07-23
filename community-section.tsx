import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Palette, Search, Grid, List, Filter, Music, PenTool, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Submission } from "@shared/schema";
import InlineContentCard from "./inline-content-card";
import CommunityGrid from "./community-grid";
import EmptyState from "./empty-state";



export default function CommunitySection() {
  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/community-submissions'],
  });

  if (isLoading) {
    return (
      <section id="community" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Community Archive</h2>
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--editorial)]"></div>
              <p className="text-muted-foreground mt-4">Loading community submissions...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="community" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">What We're Enamored With</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Poems, drawings, playlists, discoveries, moments - the spontaneous, the thoughtful, the beautiful
          </p>
        </div>


        
        {/* Community Submissions - Curated Gallery */}
        <div className="max-w-5xl mx-auto">
          {submissions.length === 0 ? (
            <EmptyState 
              type="community"
              title="Be the First to Share"
              description="Share your poems, art, playlists, or discoveries. Help build our community archive of beautiful moments and creative work."
              actionText="Submit Your Work"
              actionLink="/submit"
            />
          ) : (
            <div className="space-y-12">
              {/* Enhanced Community Grid */}
              <div className="relative">
                <CommunityGrid submissions={submissions.slice(0, 9)} />
                
                {/* View More with Smooth Animation */}
                <div className="mt-12 text-center space-y-4">
                  <Link href="/feed">
                    <Button 
                      className="bg-[var(--editorial)] text-white hover:bg-[var(--editorial)]/90 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-[var(--editorial)]/25"
                      size="lg"
                    >
                      View Community Feed
                    </Button>
                  </Link>
                  
                  <Link href="/editorials">
                    <Button variant="outline" className="border-[var(--editorial)]/30 text-[var(--editorial)] hover:bg-[var(--editorial)]/10 transition-all duration-300 ml-4">
                      View Editorial Archive
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-white border-gray-200 p-8">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4">Explore More</h3>
              <p className="text-[var(--charcoal)]/70 mb-6 max-w-2xl mx-auto">
                See all community submissions - browse the complete feed of art, writing, music, and discoveries.
              </p>
              <Link href="/feed">
                <Button 
                  className="bg-[var(--editorial)] text-white hover:bg-[var(--editorial)]/90 transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  View Full Community Feed
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
