import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";


export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/editorials", label: "Editorials", description: "Long-form articles and featured content" },
    { href: "/guides", label: "Guides", description: "Music guides and cultural deep-dives" },
    { href: "/community", label: "Community", description: "What we're enamored with" },
    { href: "/archive", label: "Archive", description: "Past issues and collections" },
  ];

  const handleNavigation = (link: { href: string; label: string; description: string }) => {
    setIsMobileMenuOpen(false);
    
    // If it's a route (starts with /), navigate to that page
    if (link.href.startsWith('/')) {
      window.location.href = link.href;
      return;
    }
    
    // If we're not on the home page, navigate to home with hash
    if (location !== '/') {
      window.location.href = `/${link.href}`;
      return;
    }
    
    // If we're on the home page, scroll to the section
    const targetId = link.href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL hash without triggering navigation
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-decoration-none">
            <h1 className="text-2xl font-bold text-foreground tracking-wide">
              Enamorado
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Independent Culture</p>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link)}
                  className="text-muted-foreground hover:text-editorial transition-colors font-medium relative group"
                  title={link.description}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-editorial transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              <Link href="/submit">
                <Button size="sm" className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  Submit
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Live Radio & Controls */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-slow"></div>
              <span className="text-red-400 text-sm font-medium">Live Radio</span>
            </div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            

          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--charcoal)]/95 backdrop-blur-md border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link)}
                className="block px-3 py-2 text-muted-foreground hover:text-editorial w-full text-left"
              >
                {link.label}
              </button>
            ))}
            <Link href="/submit" className="block px-3 py-2 text-editorial font-medium">
              Submit Work
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
