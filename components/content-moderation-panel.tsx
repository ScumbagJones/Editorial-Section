import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Flag, Check, X, Star, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Submission } from "@shared/schema";

interface ContentModerationPanelProps {
  submission: Submission;
  onClose: () => void;
}

const moderationFlags = [
  { id: "low_effort", label: "Low Effort", description: "Minimal content, poor quality, lacks substance" },
  { id: "inappropriate", label: "Inappropriate", description: "Content not suitable for magazine standards" },
  { id: "spam", label: "Spam", description: "Repetitive, promotional, or irrelevant content" },
  { id: "off_topic", label: "Off Topic", description: "Doesn't fit any of our content categories" },
  { id: "poor_quality", label: "Poor Quality", description: "Technical issues, blurry images, bad presentation" },
  { id: "duplicate", label: "Duplicate", description: "Similar content already exists in archive" },
];

const rejectionTemplates = [
  {
    id: "low_effort",
    title: "Content Quality Standards",
    message: "Thank you for your submission. We're looking for work that demonstrates thoughtful creative process and substantial effort. Please consider developing your concept further and resubmitting with more detailed work."
  },
  {
    id: "inappropriate",
    title: "Editorial Guidelines",
    message: "Your submission doesn't align with our editorial standards. Please review our community guidelines and consider how your work fits within our art, fashion, photography, or mixed media categories."
  },
  {
    id: "poor_quality",
    title: "Technical Standards",
    message: "We'd love to feature your work, but the current files don't meet our technical requirements. Please resubmit with higher quality images or clearer documentation."
  },
  {
    id: "off_topic",
    title: "Content Focus",
    message: "While we appreciate your creativity, this submission doesn't fit our current editorial focus on art, fashion, photography, and mixed media. Consider how your work might be reframed to fit these categories."
  }
];

export default function ContentModerationPanel({ submission, onClose }: ContentModerationPanelProps) {
  const [qualityScore, setQualityScore] = useState(submission.qualityScore || 50);
  const [selectedFlags, setSelectedFlags] = useState<string[]>(submission.moderationFlags || []);
  const [adminNotes, setAdminNotes] = useState(submission.adminNotes || "");
  const [rejectionReason, setRejectionReason] = useState(submission.rejectionReason || "");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSubmissionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/submissions/${submission.id}/moderate`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update submission.",
        variant: "destructive",
      });
    },
  });

  const handleFlagToggle = (flagId: string) => {
    setSelectedFlags(prev => 
      prev.includes(flagId) 
        ? prev.filter(f => f !== flagId)
        : [...prev, flagId]
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = rejectionTemplates.find(t => t.id === templateId);
    if (template) {
      setRejectionReason(template.message);
      setSelectedTemplate(templateId);
    }
  };

  const handleApprove = () => {
    updateSubmissionMutation.mutate({
      status: "approved",
      qualityScore,
      moderationFlags: selectedFlags,
      adminNotes,
      reviewedBy: "Editorial Team"
    });
    toast({
      title: "Submission Approved",
      description: "Content has been added to the community archive.",
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide feedback for the submitter.",
        variant: "destructive",
      });
      return;
    }
    
    updateSubmissionMutation.mutate({
      status: "rejected",
      qualityScore,
      moderationFlags: selectedFlags,
      adminNotes,
      rejectionReason,
      reviewedBy: "Editorial Team"
    });
    toast({
      title: "Submission Rejected",
      description: "Feedback has been sent to the submitter.",
    });
  };

  const handleFlag = () => {
    updateSubmissionMutation.mutate({
      status: "flagged",
      qualityScore,
      moderationFlags: selectedFlags,
      adminNotes,
      reviewedBy: "Editorial Team"
    });
    toast({
      title: "Submission Flagged",
      description: "Content has been flagged for further review.",
    });
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <Card className="w-full max-w-4xl bg-[var(--charcoal)] border-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Flag className="w-5 h-5" />
          <span>Content Moderation</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Reviewing: "{submission.title}" by {submission.submitterHandle}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quality Assessment */}
        <div>
          <Label className="text-white mb-2 block">
            Quality Score: <span className={getQualityColor(qualityScore)}>{qualityScore}/100</span>
          </Label>
          <div className="flex items-center space-x-4">
            <Input
              type="range"
              min="0"
              max="100"
              value={qualityScore}
              onChange={(e) => setQualityScore(Number(e.target.value))}
              className="flex-1"
            />
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {qualityScore >= 80 ? "Excellent" : 
                 qualityScore >= 60 ? "Good" : 
                 qualityScore >= 40 ? "Fair" : "Poor"}
              </span>
            </div>
          </div>
        </div>

        {/* Moderation Flags */}
        <div>
          <Label className="text-white mb-3 block">Content Issues</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {moderationFlags.map((flag) => (
              <div key={flag.id} className="flex items-start space-x-2 p-2 rounded bg-[var(--slate)]/30">
                <Checkbox
                  id={flag.id}
                  checked={selectedFlags.includes(flag.id)}
                  onCheckedChange={() => handleFlagToggle(flag.id)}
                />
                <div className="flex-1 min-w-0">
                  <Label htmlFor={flag.id} className="text-sm font-medium text-white cursor-pointer">
                    {flag.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flag.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rejection Templates */}
        <div>
          <Label className="text-white mb-2 block">Rejection Templates</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
            <SelectTrigger className="bg-[var(--slate)]/30 border-border">
              <SelectValue placeholder="Select a template for common issues" />
            </SelectTrigger>
            <SelectContent>
              {rejectionTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rejection Reason */}
        <div>
          <Label className="text-white mb-2 block">Feedback for Submitter</Label>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Provide constructive feedback to help the submitter improve..."
            className="bg-[var(--slate)]/30 border-border text-white resize-none"
            rows={4}
          />
        </div>

        {/* Admin Notes */}
        <div>
          <Label className="text-white mb-2 block">Internal Notes</Label>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal notes for editorial team..."
            className="bg-[var(--slate)]/30 border-border text-white resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Button
            onClick={handleApprove}
            disabled={updateSubmissionMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve & Publish
          </Button>
          
          <Button
            onClick={handleReject}
            disabled={updateSubmissionMutation.isPending}
            variant="destructive"
          >
            <X className="w-4 h-4 mr-2" />
            Reject with Feedback
          </Button>
          
          <Button
            onClick={handleFlag}
            disabled={updateSubmissionMutation.isPending}
            variant="outline"
            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Flag for Review
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-muted-foreground hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}