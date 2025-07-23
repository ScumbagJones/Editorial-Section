import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Clock, CheckCircle, Eye, Users, Check, X, Settings, AlertTriangle } from "lucide-react";
import { Submission } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CommunityModerationPanel from "./community-moderation-panel";

interface AdminStats {
  pending: number;
  approved: number;
  totalViews: number;
  contributors: number;
}

export default function AdminDashboard() {
  const [reviewerName, setReviewerName] = useState("Editorial Team");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModerationOpen, setIsModerationOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/stats'],
  });

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/submissions', filterStatus],
    queryFn: async () => {
      const url = filterStatus === 'all' ? '/api/submissions' : `/api/submissions?status=${filterStatus}`;
      const response = await fetch(url);
      return response.json();
    },
  });

  const approveSubmissionMutation = useMutation({
    mutationFn: async ({ id, reviewedBy }: { id: number; reviewedBy: string }) => {
      const response = await apiRequest('POST', `/api/submissions/${id}/approve`, { reviewedBy });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submission Approved",
        description: "Submission has been approved and published live!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/community-submissions'] });
    },
    onError: () => {
      toast({
        title: "Approval Failed",
        description: "Failed to approve submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectSubmissionMutation = useMutation({
    mutationFn: async ({ id, reviewedBy, adminNotes }: { id: number; reviewedBy: string; adminNotes?: string }) => {
      const response = await apiRequest('POST', `/api/submissions/${id}/status`, {
        status: 'rejected',
        reviewedBy,
        adminNotes,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submission Rejected",
        description: "Submission has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: () => {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: number) => {
    if (!reviewerName.trim()) {
      toast({
        title: "Reviewer Name Required",
        description: "Please enter your name as reviewer",
        variant: "destructive",
      });
      return;
    }
    approveSubmissionMutation.mutate({ id, reviewedBy: reviewerName });
  };

  const handleReject = (id: number) => {
    if (!window.confirm('Are you sure you want to reject this submission?')) {
      return;
    }
    const notes = window.prompt('Optional: Add a note for the submitter:') || '';
    rejectSubmissionMutation.mutate({ id, reviewedBy: reviewerName, adminNotes: notes });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'art':
        return 'category-art';
      case 'fashion':
        return 'category-fashion';
      case 'photography':
        return 'category-photography';
      case 'mixed':
        return 'category-mixed';
      default:
        return 'category-art';
    }
  };

  return (
    <div className="space-y-6">
      {/* Reviewer Name Input */}
      <Card className="bg-[var(--navy)]/50 border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Label htmlFor="reviewerName" className="text-white font-medium">
              Reviewer Name:
            </Label>
            <Input
              id="reviewerName"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your name"
              className="w-full sm:max-w-xs bg-[var(--charcoal)] border-border text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-[var(--navy)]/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--navy)]/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--navy)]/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Likes</p>
                  <p className="text-2xl font-bold text-editorial">{stats.totalViews}</p>
                </div>
                <Eye className="w-5 h-5 text-editorial" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--navy)]/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Contributors</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.contributors}</p>
                </div>
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submissions Management */}
      <Card className="bg-[var(--navy)]/30 border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-xl text-white">Recent Submissions</CardTitle>
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
              <TabsList className="bg-[var(--charcoal)] grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No submissions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="bg-[var(--slate)]/50 border-border">
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h4 className="text-white font-medium truncate">{submission.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getCategoryColor(submission.category)}>
                              {submission.category}
                            </Badge>
                            <Badge className={`status-${submission.status}`}>
                              {submission.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                          {submission.description}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {submission.submitterHandle} • {formatDate(submission.createdAt)}
                        </p>
                        {submission.status === 'approved' && submission.reviewedBy && (
                          <p className="text-green-400 text-xs mt-1">
                            ✓ Approved by {submission.reviewedBy} on {formatDate(submission.reviewedAt)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 w-full sm:w-auto sm:ml-4">
                        {/* Advanced Moderation Button - Always Available */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setIsModerationOpen(true);
                          }}
                          className="w-full sm:w-auto border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Advanced Moderation
                        </Button>
                        
                        {submission.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(submission.id)}
                              disabled={approveSubmissionMutation.isPending}
                              className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              {approveSubmissionMutation.isPending ? 'Approving...' : 'Quick Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(submission.id)}
                              disabled={rejectSubmissionMutation.isPending}
                              className="w-full sm:w-auto"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Quick Reject
                            </Button>
                          </div>
                        )}
                        
                        {submission.status === 'approved' && (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(submission.id)}
                              disabled={rejectSubmissionMutation.isPending}
                              className="w-full sm:w-auto border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                              Remove from Archive
                            </Button>
                          </div>
                        )}
                        
                        {/* Quality indicators */}
                        <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                          {submission.files && submission.files.length > 0 && (
                            <span>{submission.files.length} file{submission.files.length > 1 ? 's' : ''} attached</span>
                          )}
                          {submission.qualityScore && (
                            <span className={submission.qualityScore >= 60 ? 'text-green-400' : 'text-yellow-400'}>
                              Quality: {submission.qualityScore}/100
                            </span>
                          )}
                          {submission.moderationFlags && submission.moderationFlags.length > 0 && (
                            <span className="text-red-400 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {submission.moderationFlags.length} flag{submission.moderationFlags.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Content Moderation Dialog */}
      <Dialog open={isModerationOpen} onOpenChange={setIsModerationOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-transparent border-none">
          {selectedSubmission && (
            <CommunityModerationPanel
              submission={selectedSubmission}
              onClose={() => {
                setIsModerationOpen(false);
                setSelectedSubmission(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
