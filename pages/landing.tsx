import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturedStories from "@/components/featured-stories";
import CommunitySection from "@/components/community-section";
import ArchiveSection from "@/components/archive-section";

export default function Landing() {
  useEffect(() => {
    // Handle hash navigation when landing on the page
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedStories />
      <CommunitySection />
      <ArchiveSection />
      
      {/* Footer */}
      <footer className="bg-[var(--navy)] border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4">Enamorado</h3>
              <p className="text-muted-foreground mb-4">
                Independent culture and creative archive showcasing community voices, art, 
                and the stories that define our generation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-editorial transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-muted-foreground hover:text-editorial transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-editorial transition-colors">
                  TikTok
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><a href="#featured" className="text-muted-foreground hover:text-editorial transition-colors">Featured Stories</a></li>
                <li><a href="#community" className="text-muted-foreground hover:text-editorial transition-colors">Community Archive</a></li>
                <li><a href="#archive" className="text-muted-foreground hover:text-editorial transition-colors">Past Issues</a></li>
                <li><a href="/submit" className="text-muted-foreground hover:text-editorial transition-colors">Submit Work</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-editorial transition-colors">Live Radio</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-editorial transition-colors">Newsletter</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-editorial transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-editorial transition-colors">About</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">&copy; 2024 Enamorado. Independent publishing platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
