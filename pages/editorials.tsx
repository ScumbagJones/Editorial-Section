import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, PenTool, Plus, BookOpen, Users, Calendar, TrendingUp, Upload, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Submission } from "@shared/schema";
import Navigation from "@/components/navigation";
import EditorialCard from "@/components/editorial-card";
import ProgressiveSubmissionForm from "@/components/progressive-submission-form";
import EssayDisplay from "@/components/essay-display";
import { getCategoryLabel } from "@/utils/content-helpers";

const categories = [
  { id: 'all', label: 'All', color: 'bg-white/10 text-white', icon: Grid },
  { id: 'written-pieces', label: 'Written Pieces', color: 'bg-blue-500/20 text-blue-300', icon: BookOpen },
  { id: 'visual-work', label: 'Visual Work', color: 'bg-purple-500/20 text-purple-300', icon: PenTool },
  { id: 'featured-content', label: 'Featured Content', color: 'bg-green-500/20 text-green-300', icon: Users }
];

export default function Editorials() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState<Submission | null>(null);

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/editorial-submissions'],
  });

  const filteredSubmissions = submissions.filter(submission => {
    // Only show editorial-worthy content (exclude quick-share)
    const isEditorial = submission.category !== 'quick-share';
    const matchesCategory = selectedCategory === 'all' || submission.category === selectedCategory;
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.description.toLowerCase().includes(searchTerm.toLowerCase());
    return isEditorial && matchesCategory && matchesSearch;
  });

  const featuredSubmission = filteredSubmissions[0];
  const regularSubmissions = filteredSubmissions.slice(1);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navigation />
      
      {/* Header - Clean white, non-sticky */}
      <div className="pt-20 pb-16 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-[var(--charcoal)]/70 hover:text-[var(--charcoal)] mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-[var(--charcoal)] mb-2 tracking-tight">
              EDITORIAL
            </h1>
            <p className="text-lg text-[var(--charcoal)]/70 max-w-2xl mx-auto">
              Long-form articles, commissioned features, and editorial selections
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-3">{/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-[var(--navy)] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                  size="sm"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.label}</span>
                </Button>
              );
            })}
          </div>
        </div>





        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">No Editorial Content Yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Be the first to contribute editorial content to the community. Share your work and help build our magazine.
            </p>
            <Link href="/submit">
              <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white font-medium">
                Submit Your Work
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Featured essay */}
            {featuredSubmission && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Featured Essay</h2>
                <div 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedEssay(featuredSubmission)}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300">
                        {getCategoryLabel(featuredSubmission.category)}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(featuredSubmission.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {featuredSubmission.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {featuredSubmission.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        By {featuredSubmission.submitterHandle}
                      </span>
                      <Button variant="outline" size="sm">
                        Read Full Essay
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular submissions */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {regularSubmissions.map((submission) => (
                <div 
                  key={submission.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedEssay(submission)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(submission.category)}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(submission.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {submission.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {submission.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        By {submission.submitterHandle}
                      </span>
                      <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                        Read →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No submissions found matching your filters.</p>
              </div>
            )}
          </>
        )}
        </div>

        {/* Sidebar - Clean, no stats */}
        <div className="lg:col-span-1 space-y-8">
          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h3>
            <div className="space-y-2">
              {categories.slice(1).map((category) => {
                const IconComponent = category.icon;
                const count = filteredSubmissions.filter(s => s.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4" />
                      <span className="text-gray-900 dark:text-white">{category.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {filteredSubmissions.slice(0, 3).map((submission) => (
                <div 
                  key={submission.id}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedEssay(submission)}
                >
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {submission.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By {submission.submitterHandle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit prompt */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Join Our Editorial Platform
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Submit your work, share discoveries, or pitch feature ideas to our editorial team.
            </p>
            <Button 
              onClick={() => setShowSubmissionForm(true)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
      
      {/* Essay Display Modal */}
      {selectedEssay && (
        <EssayDisplay 
          submission={selectedEssay} 
          onClose={() => setSelectedEssay(null)} 
        />
      )}
      
      {/* Editorial Submission Form */}
      {showSubmissionForm && (
        <ProgressiveSubmissionForm onClose={() => setShowSubmissionForm(false)} />
      )}
    </div>
  );
}