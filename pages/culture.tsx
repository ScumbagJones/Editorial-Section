import Navigation from "@/components/navigation";
import FeaturedStories from "@/components/featured-stories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Culture() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 pb-16 bg-gradient-to-br from-[var(--navy)] via-[var(--charcoal)] to-[var(--slate)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-white mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Card className="bg-[var(--charcoal)] border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Culture</CardTitle>
                <p className="text-muted-foreground">
                  Exploring the stories, voices, and movements that shape our cultural landscape
                </p>
              </CardHeader>
            </Card>
          </div>

          {/* Featured Stories */}
          <FeaturedStories />
        </div>
      </div>
    </div>
  );
}