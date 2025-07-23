import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Submission } from "@shared/schema";

export default function Moderation() {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const { toast } = useToast();

  const { data: pendingSubmissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/submissions', 'pending'],
    queryFn: () => apiRequest('/api/submissions?status=pending'),
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/submissions/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          editorialStatus: 'ready-to-publish',
          feedbackNotes: feedbackText || 'Approved for community archive',
          reviewedBy: 'Editorial Team'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      toast({
        title: "Submission Approved",
        description: "Content has been added to the community archive",
      });
      setSelectedSubmission(null);
      setFeedbackText("");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/submissions/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          editorialStatus: 'different-direction',
          feedbackNotes: feedbackText || 'Not aligned with current editorial direction',
          reviewedBy: 'Editorial Team'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      toast({
        title: "Submission Declined",
        description: "Feedback has been recorded",
      });
      setSelectedSubmission(null);
      setFeedbackText("");
    },
  });

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'playlist': return '♪';
      case 'art': return '🎨';
      case 'writing': return '✍️';
      case 'link': return '🔗';
      default: return '📄';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 pb-16 bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-[var(--editorial)] mx-auto mb-4 animate-spin" />
              <p className="text-[var(--charcoal)]/70">Loading submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 pb-16 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Card className="bg-white border-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-[var(--charcoal)] flex items-center">
                <AlertTriangle className="w-6 h-6 text-[var(--editorial)] mr-2" />
                Editorial Review Queue
              </CardTitle>
              <p className="text-[var(--charcoal)]/70">
                {pendingSubmissions.length} submissions awaiting review
              </p>
            </CardHeader>
          </Card>

          {pendingSubmissions.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6 pb-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-2">All Caught Up!</h3>
                <p className="text-[var(--charcoal)]/70">No submissions pending review</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submissions List */}
              <div className="space-y-4">
                {pendingSubmissions.map((submission) => (
                  <Card 
                    key={submission.id} 
                    className={`bg-white border-gray-200 cursor-pointer transition-all ${
                      selectedSubmission?.id === submission.id ? 'ring-2 ring-[var(--editorial)]' : ''
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getContentTypeIcon(submission.contentType)}</span>
                          <Badge variant="outline">{submission.category}</Badge>
                          <Badge variant="secondary">{submission.contentType}</Badge>
                        </div>
                        <Clock className="w-4 h-4 text-[var(--charcoal)]/50" />
                      </div>
                      
                      <h3 className="font-semibold text-[var(--charcoal)] mb-2 line-clamp-1">
                        {submission.title}
                      </h3>
                      
                      <p className="text-sm text-[var(--charcoal)]/70 mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-[var(--charcoal)]/50">
                        <span>@{submission.submitterHandle}</span>
                        <span>{submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Review Panel */}
              <div className="lg:sticky lg:top-4">
                {selectedSubmission ? (
                  <Card className="bg-white border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-[var(--charcoal)] flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Review Submission
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-bold text-[var(--charcoal)] mb-2">{selectedSubmission.title}</h3>
                        <p className="text-[var(--charcoal)]/70 mb-4">{selectedSubmission.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--charcoal)]/50">Submitter:</span>
                            <span className="text-[var(--charcoal)]">@{selectedSubmission.submitterHandle}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--charcoal)]/50">Category:</span>
                            <span className="text-[var(--charcoal)]">{selectedSubmission.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--charcoal)]/50">Type:</span>
                            <span className="text-[var(--charcoal)]">{selectedSubmission.contentType}</span>
                          </div>
                        </div>

                        {selectedSubmission.submissionLinks && selectedSubmission.submissionLinks.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-[var(--charcoal)]/50 mb-2">Links:</p>
                            {selectedSubmission.submissionLinks.map((link, index) => (
                              <a 
                                key={index}
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-[var(--editorial)] hover:underline mb-1"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {link}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--charcoal)] mb-2 block">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          Feedback (optional)
                        </label>
                        <Textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Add feedback for the submitter..."
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button
                          onClick={() => approveMutation.mutate(selectedSubmission.id)}
                          disabled={approveMutation.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => rejectMutation.mutate(selectedSubmission.id)}
                          disabled={rejectMutation.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="pt-6 pb-6 text-center">
                      <Eye className="w-12 h-12 text-[var(--charcoal)]/30 mx-auto mb-4" />
                      <p className="text-[var(--charcoal)]/70">Select a submission to review</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}