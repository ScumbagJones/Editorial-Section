import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Palette, Music, Image } from "lucide-react";
import { FeaturedStory } from "@shared/schema";
import EmptyState from "./empty-state";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'art':
      return <Palette className="w-6 h-6" />;
    case 'music':
      return <Music className="w-6 h-6" />;
    default:
      return <Image className="w-6 h-6" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'art':
      return 'category-art';
    case 'music':
      return 'category-fashion';
    case 'culture':
      return 'category-photography';
    default:
      return 'category-mixed';
  }
};

export default function FeaturedStories() {
  const { data: stories = [], isLoading } = useQuery<FeaturedStory[]>({
    queryKey: ['/api/featured-stories'],
  });

  // Hide section entirely if less than 3 stories
  if (isLoading) {
    return null; // Don't show loading state for featured stories
  }

  if (stories.length < 3) {
    return null; // Hide section until we have real content
  }

  const featuredStory = stories.find(s => s.isFeatured && s.title.includes('Clairo')); // Use Clairo as main feature
  const otherStories = stories.filter(s => s.isFeatured && !s.title.includes('Clairo')).slice(0, 2); // Other featured stories

  return (
    <section id="culture" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Featured Stories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated editorial content showcasing the voices and creativity of our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Large Featured Story */}
          {featuredStory && (
            <Card 
              className="md:col-span-2 lg:col-span-2 bg-white border-border hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => featuredStory.externalUrl && window.open(featuredStory.externalUrl, '_blank')}
            >
              <CardHeader className="pb-4">
                <div className="h-64 rounded-lg overflow-hidden mb-4">
                  {featuredStory.imageUrl ? (
                    <img 
                      src={featuredStory.imageUrl} 
                      alt={featuredStory.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-[var(--muted)] to-[var(--slate)] flex items-center justify-center">
                      <div className="text-center">
                        {getCategoryIcon(featuredStory.category)}
                        <p className="text-muted-foreground text-lg mt-2">Feature Story</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge className={getCategoryColor(featuredStory.category)}>
                    {featuredStory.category}
                  </Badge>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm">Featured</span>
                </div>
                <CardTitle className="text-2xl text-[var(--charcoal)] mb-3">
                  {featuredStory.title}
                </CardTitle>
                <CardDescription className="text-[var(--charcoal)]/70 mb-4">
                  {featuredStory.excerpt}
                </CardDescription>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[var(--charcoal)] text-white">
                      {featuredStory.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[var(--charcoal)] text-sm font-medium">{featuredStory.author}</p>
                    <p className="text-[var(--charcoal)]/70 text-xs">External Contributor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Smaller Featured Stories */}
          <div className="space-y-8">
            {otherStories.map((story) => (
              <Card 
                key={story.id} 
                className="bg-white border-border hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => story.externalUrl && window.open(story.externalUrl, '_blank')}
              >
                <CardHeader className="pb-2">
                  <div className="h-32 rounded-lg overflow-hidden">
                    {story.imageUrl ? (
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-[var(--muted)] to-[var(--slate)] flex items-center justify-center">
                        {getCategoryIcon(story.category)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className={`${getCategoryColor(story.category)} mb-2`}>
                    {story.category}
                  </Badge>
                  <CardTitle className="text-lg text-[var(--charcoal)] mb-2">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="text-[var(--charcoal)]/70 text-sm">
                    {story.excerpt.substring(0, 80)}...
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
