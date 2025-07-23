import { useState } from "react";
import Navigation from "@/components/navigation";
import SubmissionForm from "@/components/submission-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Submission() {
  const [isFormOpen, setIsFormOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 pb-16 bg-gradient-to-br from-[var(--navy)] via-[var(--charcoal)] to-[var(--slate)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-white mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Magazine
              </Button>
            </Link>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Editorial Open Call</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Submit to Enamorado Community Archive Vol. 1
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <Card className="bg-gradient-to-br from-[var(--charcoal)] to-[var(--slate)] border-border mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Every quarter, we collect submissions from our community to create a collaborative 
                zine/archive. Your work becomes part of a living collection showcasing local artists, 
                style, and creative voices. With your approval, your submission joins others in 
                "Enamorado Radio Community Submissions Vol. 1" — a collective showcase of our 
                community's creativity.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-editorial text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 mx-auto">
                    1
                  </div>
                  <h4 className="text-white font-semibold mb-2">Submit Your Work</h4>
                  <p className="text-muted-foreground text-sm">
                    Upload sketches, paintings, fashion looks, or creative projects
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-editorial text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 mx-auto">
                    2
                  </div>
                  <h4 className="text-white font-semibold mb-2">Editorial Review</h4>
                  <p className="text-muted-foreground text-sm">
                    Our team reviews submissions for the quarterly archive
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-editorial text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 mx-auto">
                    3
                  </div>
                  <h4 className="text-white font-semibold mb-2">Community Archive</h4>
                  <p className="text-muted-foreground text-sm">
                    Approved works are featured in our collective zine
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-editorial text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 mx-auto">
                    4
                  </div>
                  <h4 className="text-white font-semibold mb-2">Living Collection</h4>
                  <p className="text-muted-foreground text-sm">
                    Your work becomes part of our ongoing community showcase
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Submission Button */}
          <div className="text-center">
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-editorial text-white hover:bg-blue-600 text-lg px-8 py-3"
              size="lg"
            >
              Start Your Submission
            </Button>
          </div>
        </div>
      </div>

      {/* Submission Form Modal */}
      {isFormOpen && (
        <SubmissionForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
