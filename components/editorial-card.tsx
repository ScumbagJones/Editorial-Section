import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Heart } from "lucide-react";
import { Submission } from "@shared/schema";

interface EditorialCardProps {
  submission: Submission;
  featured?: boolean;
}

export default function EditorialCard({ submission, featured = false }: EditorialCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'creative-work':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'conversation':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'local-moment':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Hero Image/Visual - pi.fyi style with bold typography */}
        <div className="relative h-96 overflow-hidden">
          {submission.files && submission.files.length > 0 ? (
            <img 
              src={submission.files[0]} 
              alt={submission.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
              <Heart className="w-16 h-16 text-white/30" />
            </div>
          )}
          
          {/* Overlay gradient - more subtle like pi.fyi */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Category badge - minimal style */}
          <div className="absolute top-6 left-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white/90 text-sm font-medium">
                {submission.category === 'local-moment' ? 'Local Stories' : submission.category.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Content - bold typography inspired by pi.fyi */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center text-sm text-white/60 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(submission.createdAt)}
          </div>
          
          <h2 className="text-3xl font-bold mb-4 line-clamp-2 leading-tight">
            {submission.title}
          </h2>
          
          <p className="text-white/80 text-base line-clamp-3 mb-6 leading-relaxed">
            {submission.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              by {submission.submitterHandle}
            </div>
            <div className="flex items-center text-white/60 text-sm">
              <Eye className="w-4 h-4 mr-1" />
              {Math.floor(Math.random() * 100) + 50} views
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard editorial card (pi.fyi inspired)
  return (
    <Card className="group bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className={`${getCategoryStyle(submission.category)} text-xs`}>
            {submission.category === 'local-moment' ? 'Local Stories' : submission.category.replace('-', ' ')}
          </Badge>
          <div className="flex items-center text-white/50 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(submission.createdAt)}
          </div>
        </div>

        <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2 group-hover:text-pink-300 transition-colors">
          {submission.title}
        </h3>

        <p className="text-white/70 text-sm mb-4 line-clamp-3">
          {submission.description}
        </p>

        {submission.files && submission.files.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {submission.files.slice(0, 2).map((file, index) => (
                <div key={index} className="aspect-video bg-white/5 rounded-lg overflow-hidden">
                  <img 
                    src={file} 
                    alt={`${submission.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {submission.files.length > 2 && (
              <p className="text-white/50 text-xs mt-2">
                +{submission.files.length - 2} more files
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-white/60 text-sm">
            {submission.submitterHandle}
          </div>
          <div className="flex items-center text-white/50 text-sm">
            <Eye className="w-4 h-4 mr-1" />
            {Math.floor(Math.random() * 100) + 10}
          </div>
        </div>
      </div>
    </Card>
  );
}