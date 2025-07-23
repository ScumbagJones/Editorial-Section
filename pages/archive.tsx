import Navigation from "@/components/navigation";
import ArchiveSection from "@/components/archive-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Download } from "lucide-react";
import { Link } from "wouter";

export default function Archive() {
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
                <CardTitle className="text-2xl text-[var(--charcoal)]">Archive</CardTitle>
                <p className="text-[var(--charcoal)]/70">
                  Browse our complete collection of past issues and curated community showcases. Each season represents the best of our creative community.
                </p>
              </CardHeader>
            </Card>
          </div>

          {/* Archive Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-3">
                  <BookOpen className="w-5 h-5 text-[var(--editorial)]" />
                  <h3 className="text-[var(--charcoal)] font-semibold">Full Issues</h3>
                </div>
                <p className="text-[var(--charcoal)]/70 text-sm">
                  Complete magazine issues available to read online via Issuu integration.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-5 h-5 text-[var(--editorial)]" />
                  <h3 className="text-[var(--charcoal)] font-semibold">Seasonal Releases</h3>
                </div>
                <p className="text-[var(--charcoal)]/70 text-sm">
                  Community submissions are curated quarterly into themed collections.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Download className="w-5 h-5 text-[var(--editorial)]" />
                  <h3 className="text-[var(--charcoal)] font-semibold">Accessible</h3>
                </div>
                <p className="text-[var(--charcoal)]/70 text-sm">
                  All issues are freely accessible online with options for offline reading.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Archive Grid */}
          <ArchiveSection />
        </div>
      </div>
    </div>
  );
}