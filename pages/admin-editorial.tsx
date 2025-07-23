import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  ExternalLink, 
  Edit3,
  Eye,
  Calendar,
  User,
  Filter,
  Search
} from "lucide-react";
import { Submission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ContentTypeDetector, { detectContentType } from "@/components/content-type-detector";

export default function AdminEditorial() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [editorialStatus, setEditorialStatus] = useState<string>('pending');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/submissions']
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest('POST', `/api/submissions/${id}/moderate`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/editorial-submissions'] });
      toast({
        title: "Success",
        description: "Submission updated successfully",
      });
      setSelectedSubmission(null);
      setFeedbackText('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || submission.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const handleModeration = (status: string, section: string = 'community') => {
    if (!selectedSubmission) return;
    
    const updates = {
      status,
      editorialStatus,
      feedbackNotes: feedbackText,
      section: section,
      reviewedBy: 'admin', // In real app, this would be the current user
      reviewedAt: new Date().toISOString()
    };

    moderateMutation.mutate({ id: selectedSubmission.id, updates });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEditorialStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'needs_edits':
        return 'bg-orange-100 text-orange-800';
      case 'not_suitable':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeInfo = (submission: Submission) => {
    if (submission.collaborationLinks && submission.collaborationLinks.length > 0) {
      return detectContentType(submission.collaborationLinks[0]);
    }
    return { type: 'text', platform: 'native' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editorial Management</h1>
          <p className="text-gray-600">Review and moderate content submissions</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="conversation">Essays</SelectItem>
              <SelectItem value="creative-work">Creative Work</SelectItem>
              <SelectItem value="local-moment">Local Stories</SelectItem>
              <SelectItem value="quick-share">Quick Share</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubmissions.map((submission) => {
            const contentInfo = getContentTypeInfo(submission);
            return (
              <Card key={submission.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      {submission.editorialStatus && (
                        <Badge variant="outline" className={getEditorialStatusColor(submission.editorialStatus)}>
                          {submission.editorialStatus.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <ContentTypeDetector
                      url={submission.collaborationLinks?.[0] || ''}
                      title={submission.title}
                      description={submission.description}
                      contentType={contentInfo.type}
                      platform={contentInfo.platform}
                    />
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{submission.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {submission.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{submission.submitterHandle}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(submission.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {submission.collaborationLinks && submission.collaborationLinks.length > 0 && (
                    <div className="mb-4">
                      <a
                        href={submission.collaborationLinks[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Original</span>
                      </a>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedSubmission(submission)}
                    className="w-full"
                    variant="outline"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Moderation Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Review Submission</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSubmission(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedSubmission.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedSubmission.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Author:</span> {selectedSubmission.submitterHandle}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {selectedSubmission.category}
                    </div>
                    <div>
                      <span className="font-medium">Current Status:</span> {selectedSubmission.status}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(selectedSubmission.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {selectedSubmission.collaborationLinks && selectedSubmission.collaborationLinks.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">External Content</h4>
                    <ContentTypeDetector
                      url={selectedSubmission.collaborationLinks[0]}
                      title={selectedSubmission.title}
                      description={selectedSubmission.description}
                      contentType={getContentTypeInfo(selectedSubmission).type}
                      platform={getContentTypeInfo(selectedSubmission).platform}
                      embedded={true}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Editorial Status
                  </label>
                  <Select value={editorialStatus} onValueChange={setEditorialStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready to Publish</SelectItem>
                      <SelectItem value="needs_edits">Needs Minor Edits</SelectItem>
                      <SelectItem value="not_suitable">Different Direction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Notes
                  </label>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Provide constructive feedback..."
                    rows={4}
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    onClick={() => handleModeration('approved', 'editorial')}
                    disabled={moderateMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve for Editorial
                  </Button>
                  
                  <Button
                    onClick={() => handleModeration('approved', 'community')}
                    disabled={moderateMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve for Community
                  </Button>
                  
                  <Button
                    onClick={() => handleModeration('rejected')}
                    disabled={moderateMutation.isPending}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}