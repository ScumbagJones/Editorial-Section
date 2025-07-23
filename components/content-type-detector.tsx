import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, Volume2, FileText, Image, Globe } from "lucide-react";

interface ContentTypeDetectorProps {
  url: string;
  title: string;
  description: string;
  contentType: string;
  platform?: string;
  embedded?: boolean;
}

export function detectContentType(url: string): { type: string; platform: string } {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('substack.com')) {
    return { type: 'substack', platform: 'substack' };
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { type: 'video', platform: 'youtube' };
  }
  if (lowerUrl.includes('vimeo.com')) {
    return { type: 'video', platform: 'vimeo' };
  }
  if (lowerUrl.includes('soundcloud.com')) {
    return { type: 'audio', platform: 'soundcloud' };
  }
  if (lowerUrl.includes('docs.google.com')) {
    return { type: 'text', platform: 'google-docs' };
  }
  if (lowerUrl.includes('medium.com')) {
    return { type: 'text', platform: 'medium' };
  }
  
  return { type: 'text', platform: 'external' };
}

export function getPlatformIcon(platform: string) {
  switch (platform) {
    case 'substack':
      return <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xs">S</span>
      </div>;
    case 'youtube':
      return <Play className="w-4 h-4 text-red-500" />;
    case 'vimeo':
      return <Play className="w-4 h-4 text-blue-500" />;
    case 'soundcloud':
      return <Volume2 className="w-4 h-4 text-orange-400" />;
    case 'google-docs':
      return <FileText className="w-4 h-4 text-blue-600" />;
    case 'medium':
      return <Image className="w-4 h-4 text-gray-600" />;
    default:
      return <Globe className="w-4 h-4 text-gray-500" />;
  }
}

export function getPlatformColor(platform: string) {
  switch (platform) {
    case 'substack':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'youtube':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'vimeo':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'soundcloud':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'google-docs':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'medium':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function ContentTypeDetector({ 
  url, 
  title, 
  description, 
  contentType, 
  platform = 'external',
  embedded = false 
}: ContentTypeDetectorProps) {
  const { type, platform: detectedPlatform } = detectContentType(url);
  const finalPlatform = platform || detectedPlatform;
  
  if (embedded) {
    return (
      <div className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 rounded-r-lg">
        <div className="flex items-center space-x-2 mb-2">
          {getPlatformIcon(finalPlatform)}
          <span className="text-sm font-medium text-gray-700">
            External Content • {finalPlatform}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        <Button size="sm" asChild className="text-xs">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3 mr-1" />
            View Original
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {getPlatformIcon(finalPlatform)}
      <Badge variant="outline" className={getPlatformColor(finalPlatform)}>
        {finalPlatform}
      </Badge>
    </div>
  );
}