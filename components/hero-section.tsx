import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function HeroSection() {
  const openIssue = () => {
    window.open('https://issuu.com/marine-zine/docs/octopus_zine', '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="featured" className="pt-20 pb-20 bg-background min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <p className="text-[var(--editorial)] font-semibold text-base tracking-wide uppercase">
                Featured Issue - Marine Zine
              </p>
              <h1 className="text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Octopus Zine
              </h1>
              <p className="text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl">
                Community voices exploring identity, creativity, and the spaces between digital and physical worlds.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={openIssue}
                className="bg-[var(--editorial)] text-white hover:bg-[var(--editorial)]/90 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
                size="lg"
              >
                Read Full Issue
              </Button>
              <Button 
                onClick={() => scrollToSection('archive')}
                className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white transition-all duration-300 text-lg px-8 py-4 font-medium"
                size="lg"
              >
                Browse Archive
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div 
              className="bg-[var(--cream)] h-[500px] rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-[var(--editorial)] shadow-lg overflow-hidden"
              onClick={openIssue}
            >
              {/* Styled magazine preview - no embed issues */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--cream)] to-white">
                <div className="text-center">
                  <div className="w-48 h-64 bg-[var(--charcoal)] rounded-lg shadow-2xl mb-6 mx-auto flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">OCTOPUS</h3>
                      <p className="text-sm opacity-80">MARINE ZINE</p>
                      <div className="mt-4 space-y-1">
                        <div className="w-16 h-0.5 bg-white/40 mx-auto"></div>
                        <div className="w-12 h-0.5 bg-white/40 mx-auto"></div>
                        <div className="w-20 h-0.5 bg-white/40 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--charcoal)] text-lg font-medium mb-2">Featured Issue Preview</p>
                  <p className="text-[var(--editorial)] text-sm">Click to read on Issuu →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
