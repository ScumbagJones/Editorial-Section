import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Heart, Edit, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Submission } from "@shared/schema";

interface CommunityModerationPanelProps {
  submission: Submission;
  onClose: () => void;
}

export default function CommunityModerationPanel({ submission, onClose }: CommunityModerationPanelProps) {
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [section, setSection] = useState<string>(submission.section || "community");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSubmissionMutation = useMutation({
    mutationFn: async (data: { editorialStatus: string; feedbackNotes?: string; section?: string }) => {
      const response = await apiRequest(`/api/submissions/${submission.id}/status`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({
        title: "Submission updated",
        description: "Editorial status has been updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error updating submission",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (editorialStatus: string) => {
    updateSubmissionMutation.mutate({
      editorialStatus,
      feedbackNotes: feedbackNotes.trim() || undefined,
      section,
    });
  };

  const statusOptions = [
    {
      status: "ready",
      label: "Ready to Publish",
      icon: CheckCircle,
      color: "text-green-400",
      description: "Great work that goes straight to the community archive",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      status: "needs_edits",
      label: "Needs Minor Edits",
      icon: Edit,
      color: "text-yellow-400",
      description: "Good content that could use a small touch-up",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      status: "not_suitable",
      label: "Different Direction",
      icon: MessageCircle,
      color: "text-blue-400",
      description: "Not quite right for this issue, but we'll suggest alternatives",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  const sectionOptions = [
    { value: "community", label: "Community Voices", description: "Personal stories and local perspectives" },
    { value: "creative", label: "Creative Work", description: "Art, photography, and creative projects" },
    { value: "editorial", label: "Editorial Features", description: "In-depth articles and interviews" }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[var(--charcoal)] to-[var(--slate)] border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-pink-400" />
              <div>
                <CardTitle className="text-xl text-white">Community Review</CardTitle>
                <p className="text-muted-foreground">Supporting our contributors with constructive feedback</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Preview */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{submission.title}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {submission.category}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400">
                    {submission.submitterHandle}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {submission.description}
                </p>
              </div>
              
              {submission.files && submission.files.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Attached Files</h4>
                  <div className="space-y-2">
                    {submission.files.map((file, index) => (
                      <div key={index} className="p-2 bg-[var(--navy)] rounded text-sm text-muted-foreground">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Review Actions */}
            <div className="space-y-6">
              <div>
                <Label className="text-white font-medium mb-3 block">Editorial Status</Label>
                <div className="space-y-3">
                  {statusOptions.map((option) => (
                    <div key={option.status} className="p-3 bg-[var(--navy)] rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <option.icon className={`w-4 h-4 ${option.color}`} />
                          <span className="text-white font-medium">{option.label}</span>
                        </div>
                        <Button
                          size="sm"
                          className={option.buttonColor}
                          onClick={() => handleStatusUpdate(option.status)}
                          disabled={updateSubmissionMutation.isPending}
                        >
                          Select
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{option.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-medium mb-3 block">Section Assignment</Label>
                <div className="space-y-2">
                  {sectionOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={option.value}
                        value={option.value}
                        checked={section === option.value}
                        onChange={(e) => setSection(e.target.value)}
                        className="text-blue-600"
                      />
                      <div>
                        <label htmlFor={option.value} className="text-white font-medium cursor-pointer">
                          {option.label}
                        </label>
                        <p className="text-muted-foreground text-sm">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="feedback" className="text-white font-medium mb-2 block">
                  Feedback Notes (Optional)
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Share constructive feedback to help the contributor improve..."
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  rows={4}
                  className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground"
                />
                <p className="text-muted-foreground text-sm mt-1">
                  Be encouraging and specific - help our community grow!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}