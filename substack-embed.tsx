import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Clock, Share2 } from "lucide-react";

interface SubstackEmbedProps {
  url: string;
  title: string;
  author: string;
  date: string;
  category: string;
  preview?: string;
  embedded?: boolean;
}

export default function SubstackEmbed({ 
  url, 
  title, 
  author, 
  date, 
  category, 
  preview = "",
  embedded = false 
}: SubstackEmbedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extract Substack publication info from URL
  const getSubstackInfo = (url: string) => {
    const match = url.match(/https:\/\/([^.]+)\.substack\.com/);
    return match ? match[1] : 'substack';
  };

  const publicationName = getSubstackInfo(url);
  const readTime = Math.ceil(preview.split(' ').length / 200);

  if (embedded) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {publicationName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  via Substack
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
              {category}
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
            {title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          </div>
          
          {preview && (
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {isExpanded ? preview : `${preview.substring(0, 200)}...`}
              </p>
              {preview.length > 200 && (
                <Button
                  variant="link"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-orange-600 hover:text-orange-700 p-0 h-auto text-sm mt-2"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </Button>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              By {author}
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
              <Button size="sm" asChild className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Read on Substack
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Inline preview version
  return (
    <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/10 rounded-r-lg">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">S</span>
        </div>
        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
          Originally published on Substack
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </p>
      <Button size="sm" asChild className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-3 h-3 mr-1" />
          View Original Post
        </a>
      </Button>
    </div>
  );
}