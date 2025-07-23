import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Share2, BookOpen, Clock } from "lucide-react";
import { Submission } from "@shared/schema";
import SubstackEmbed from "./substack-embed";

interface EssayDisplayProps {
  submission: Submission;
  onClose: () => void;
}

export default function EssayDisplay({ submission, onClose }: EssayDisplayProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const estimatedReadTime = Math.ceil(submission.description.split(' ').length / 200); // 200 words per minute

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[var(--charcoal)] max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[var(--charcoal)] border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300">
                {submission.category === 'conversation' ? 'Essays' : 
                 submission.category === 'creative-work' ? 'Creative Work' :
                 submission.category === 'local-moment' ? 'Local Stories' : 'Editorial'}
              </Badge>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(submission.createdAt!)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{estimatedReadTime} min read</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              ×
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {submission.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {submission.submitterHandle.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {submission.submitterHandle}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contributing Writer
              </p>
            </div>
          </div>

          {/* Essay content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {showFullContent ? submission.description : `${submission.description.substring(0, 500)}...`}
            </div>
            
            {submission.description.length > 500 && (
              <Button
                variant="link"
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 p-0 h-auto font-medium"
              >
                {showFullContent ? 'Show less' : 'Read more'}
              </Button>
            )}
          </div>

          {/* Substack integration */}
          {submission.collaborationLinks && submission.collaborationLinks.length > 0 && (
            <div className="mt-8">
              {submission.collaborationLinks.map((link, index) => {
                if (link.includes('substack.com')) {
                  return (
                    <SubstackEmbed
                      key={index}
                      url={link}
                      title={submission.title}
                      author={submission.submitterHandle}
                      date={new Date(submission.createdAt!).toLocaleDateString()}
                      category={submission.category === 'conversation' ? 'Essays' : 
                               submission.category === 'creative-work' ? 'Creative Work' :
                               submission.category === 'local-moment' ? 'Local Stories' : 'Editorial'}
                      preview={submission.description}
                      embedded={true}
                    />
                  );
                }
                return (
                  <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      External Source
                    </h3>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 hover:underline"
                    >
                      {link}
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Social handle */}
          {submission.socialHandle && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Follow {submission.submitterHandle} on{' '}
                <a 
                  href={`https://instagram.com/${submission.socialHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
                >
                  {submission.socialHandle}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white dark:bg-[var(--charcoal)] border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Save for Later</span>
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published in Enamorado Editorial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}