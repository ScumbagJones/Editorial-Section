import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Submission } from "@shared/schema";

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const { toast } = useToast();

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/submissions', selectedTab],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/submissions/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          editorialStatus: status === 'approved' ? 'ready-to-publish' : 'different-direction',
          feedbackNotes: status === 'approved' ? 'Approved for community archive' : 'Not aligned with current editorial direction',
          reviewedBy: 'Editorial Team'
        })
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      toast({
        title: "Status Updated",
        description: "Submission status has been updated successfully",
      });
    },
  });

  const filteredSubmissions = submissions.filter(submission => {
    if (selectedTab === 'pending') return submission.status === 'pending';
    if (selectedTab === 'approved') return submission.status === 'approved';
    if (selectedTab === 'rejected') return submission.status === 'rejected';
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-[var(--charcoal)] hover:bg-[var(--charcoal)]/10 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Magazine
              </Button>
            </Link>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[var(--charcoal)] mb-4">Editorial Review Panel</h1>
              <p className="text-[var(--charcoal)]/70 text-lg max-w-2xl mx-auto">
                Manage submissions and curate content for the community archive
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              {['pending', 'approved', 'rejected', 'all'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-md capitalize transition-colors ${
                    selectedTab === tab 
                      ? 'bg-[var(--editorial)] text-white' 
                      : 'text-[var(--charcoal)] hover:bg-gray-100'
                  }`}
                >
                  {tab} ({filteredSubmissions.length})
                </button>
              ))}
            </div>
          </div>

          {/* Submissions Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--charcoal)]/50" />
              <p className="text-[var(--charcoal)]/70">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--charcoal)]/70 text-lg">No submissions found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        variant={submission.status === 'approved' ? 'default' : 
                                submission.status === 'rejected' ? 'destructive' : 'secondary'}
                        className="mb-2"
                      >
                        {submission.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {submission.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-[var(--charcoal)] line-clamp-2">
                      {submission.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--charcoal)]/70 text-sm mb-4 line-clamp-3">
                      {submission.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[var(--charcoal)]/50 mb-4">
                      <span>by @{submission.submitterHandle}</span>
                      <span>{new Date(submission.createdAt || '').toLocaleDateString()}</span>
                    </div>
                    
                    {submission.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          onClick={() => updateStatusMutation.mutate({ id: submission.id, status: 'approved' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => updateStatusMutation.mutate({ id: submission.id, status: 'rejected' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {submission.status !== 'pending' && (
                      <div className="flex justify-center">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
