import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Grid3X3, List, Heart } from "lucide-react";
import { Link } from "wouter";
import { Submission } from "@shared/schema";
import CommunityGrid from "@/components/community-grid";
import EmptyState from "@/components/empty-state";

export default function Feed() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/community-submissions'],
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || submission.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  const filters = [
    { id: 'all', label: 'All', count: submissions.length },
    { id: 'writing', label: 'Writing', count: submissions.filter(s => s.contentType === 'writing').length },
    { id: 'art', label: 'Art', count: submissions.filter(s => s.contentType === 'art').length },
    { id: 'playlist', label: 'Music', count: submissions.filter(s => s.contentType === 'playlist').length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--editorial)]"></div>
              <p className="text-muted-foreground mt-4">Loading community feed...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--charcoal)]">Community Feed</CardTitle>
                <p className="text-[var(--charcoal)]/70">
                  All community submissions - art, writing, music, and discoveries from our creative community
                </p>
              </CardHeader>
            </Card>
          </div>

          {submissions.length === 0 ? (
            <EmptyState 
              type="community"
              title="No Submissions Yet"
              description="Be the first to share your work with the community. Submit your art, writing, playlists, or discoveries."
              actionText="Submit Your Work"
              actionLink="/submit"
            />
          ) : (
            <>
              {/* Filter and Search Controls */}
              <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedFilter(filter.id);
                        setCurrentPage(1);
                      }}
                      className="whitespace-nowrap"
                    >
                      {filter.label} ({filter.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} submissions
                </p>
              </div>

              {/* Submissions Grid */}
              {paginatedSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No submissions match your search criteria.</p>
                </div>
              ) : (
                <CommunityGrid submissions={paginatedSubmissions} />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-white border-gray-200 p-8">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 text-[var(--editorial)] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4">Share Your Work</h3>
                <p className="text-[var(--charcoal)]/70 mb-6 max-w-2xl mx-auto">
                  Add to our community feed - share your art, writing, playlists, or anything you've been creating.
                </p>
                <Link href="/submit">
                  <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white">
                    Submit Your Work
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}