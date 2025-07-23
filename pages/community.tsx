import Navigation from "@/components/navigation";
import CommunitySection from "@/components/community-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, Trophy } from "lucide-react";
import { Link } from "wouter";

export default function Community() {
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
                <CardTitle className="text-2xl text-[var(--charcoal)]">What We're Enamored With</CardTitle>
                <p className="text-[var(--charcoal)]/70">
                  Work from our community - art, writing, music, and discoveries people wanted to share
                </p>
              </CardHeader>
            </Card>
          </div>

          {/* Featured Community Content - Popular picks from the feed */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[var(--charcoal)]">Featured from Community</h2>
              <Link href="/feed">
                <Button variant="outline" className="border-[var(--editorial)]/30 text-[var(--editorial)] hover:bg-[var(--editorial)]/10">
                  View Full Feed
                </Button>
              </Link>
            </div>
            
            {/* This will show curated/popular submissions from the full feed */}
            <CommunitySection />
          </div>

          {/* Add Your Work Call to Action */}
          <div className="text-center">
            <Card className="bg-white border-gray-200 p-8">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4">Add Your Work</h3>
                <p className="text-[var(--charcoal)]/70 mb-6 max-w-2xl mx-auto">
                  Share your art, writing, music, or discoveries with our community.
                </p>
                <Link href="/submit">
                  <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white">
                    Submit Your Work
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}