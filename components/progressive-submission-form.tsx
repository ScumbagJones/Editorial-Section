import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubmissionSchema, type InsertSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, ArrowRight, ArrowLeft, MessageCircle, Palette, Star, Heart, ExternalLink, Upload, FileText } from "lucide-react";
import { detectContentType, getPlatformIcon } from "./content-type-detector";

const submissionTypes = [
  {
    id: 'community-work',
    label: 'Submit Your Work',
    icon: Upload,
    description: 'Community-driven content (essays, photos, creative work)',
    prompt: 'What story are you telling? What questions are you exploring?',
    placeholder: 'Share your perspective, creative process, or discovery...',
    subtitle: 'For editorial consideration',
    flow: 'community'
  },
  {
    id: 'quick-share',
    label: 'Share Something Cool',
    icon: Heart,
    description: 'Quick discoveries, links, moments',
    prompt: 'What caught your attention?',
    placeholder: 'What drew you to this? How does it make you feel?',
    subtitle: 'Community highlights',
    flow: 'discovery'
  },
  {
    id: 'pitch-idea',
    label: 'Pitch an Idea',
    icon: Star,
    description: 'For interviews, profiles, photoshoots, bigger features',
    prompt: 'What\'s your vision for this feature?',
    placeholder: 'Describe your concept, who you\'d like to feature, or what story you want to tell...',
    subtitle: 'Editorial commission',
    flow: 'commission'
  }
];

interface ProgressiveSubmissionFormProps {
  onClose: () => void;
}

export default function ProgressiveSubmissionForm({ onClose }: ProgressiveSubmissionFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string>('');
  const [collaborationLinks, setCollaborationLinks] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [detectedContentType, setDetectedContentType] = useState<string>('text');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSubmission>({
    resolver: zodResolver(insertSubmissionSchema),
    defaultValues: {
      title: '',
      description: '',
      submitterHandle: '',
      submitterEmail: '',
      socialHandle: '',
      category: selectedType,
      contentType: 'text',
      files: [],
      collaborationLinks: [],
      substackUrl: '',
    },
  });

  const createSubmissionMutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const response = await apiRequest('POST', '/api/submissions', data);
      return response.json();
    },
    onSuccess: () => {
      const selectedTypeData = submissionTypes.find(t => t.id === selectedType);
      const successMessage = selectedTypeData?.flow === 'commission' ? 
        "Your pitch has been submitted. Editorial team will review and may reach out." :
        selectedTypeData?.flow === 'discovery' ? 
        "Thanks for sharing! Your discovery is now live in the community." :
        "Your work has been submitted for editorial review.";
        
      toast({
        title: "Submission Successful",
        description: successMessage,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleNext = () => {
    if (currentStep === 0 && selectedType) {
      form.setValue('category', selectedType);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleAddLink = (url: string) => {
    if (url.trim()) {
      const contentInfo = detectContentType(url);
      setDetectedContentType(contentInfo.type);
      setCollaborationLinks(prev => [...prev, url]);
    }
  };

  const onSubmit = (data: InsertSubmission) => {
    // Map submission flows to internal categories
    const categoryMapping = {
      'community-work': 'written-pieces', // Default, can be refined based on content
      'quick-share': 'quick-share',
      'pitch-idea': 'featured-content'
    };
    
    createSubmissionMutation.mutate({
      ...data,
      category: categoryMapping[selectedType as keyof typeof categoryMapping] || selectedType,
      contentType: detectedContentType,
      files: uploadedFiles,
      collaborationLinks: collaborationLinks,
    });
  };

  const selectedTypeData = submissionTypes.find(t => t.id === selectedType);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[var(--charcoal)] to-[var(--slate)] border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white">
                {currentStep === 0 ? 'What Are You Sharing?' : 
                 currentStep === 1 ? `${selectedTypeData?.label}` : 
                 'Final Details'}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {currentStep === 0 ? 'Choose the type of content you want to share' :
                 currentStep === 1 ? selectedTypeData?.description :
                 'Add any additional information'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex space-x-2 mt-4">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  step <= currentStep ? 'bg-pink-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <CardContent className="p-6">
            {/* Step 1: Content Type Selection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {submissionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-5 rounded-lg border-2 transition-all text-left ${
                          selectedType === type.id
                            ? 'border-pink-500 bg-pink-500/10'
                            : 'border-border hover:border-gray-600 bg-[var(--navy)]'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <Icon className={`w-6 h-6 mt-1 ${selectedType === type.id ? 'text-pink-400' : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white text-lg">{type.label}</h3>
                              <span className="text-xs text-muted-foreground bg-gray-800 px-2 py-1 rounded">
                                {type.subtitle}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Core Content */}
            {currentStep === 1 && selectedTypeData && (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
                  <p className="text-pink-300 text-sm font-medium mb-1">
                    {selectedTypeData.flow === 'commission' ? 'Pitch Guidelines:' : 
                     selectedTypeData.flow === 'discovery' ? 'Share:' : 'Focus:'}
                  </p>
                  <p className="text-pink-200 text-sm">{selectedTypeData.prompt}</p>
                  {selectedTypeData.flow === 'commission' && (
                    <p className="text-pink-200/80 text-xs mt-2">
                      Editorial team will review and may reach out for collaboration
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white font-medium">
                      Title *
                    </Label>
                    <Input
                      {...form.register('title')}
                      placeholder="What do you call this?"
                      className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white font-medium">
                      {selectedTypeData.flow === 'commission' ? 'Your Pitch *' : 
                       selectedTypeData.flow === 'discovery' ? 'What\'s Cool About It *' : 
                       'Your Story *'}
                    </Label>
                    <Textarea
                      {...form.register('description')}
                      placeholder={selectedTypeData.placeholder}
                      rows={selectedTypeData.flow === 'commission' ? 6 : 5}
                      className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500 resize-none"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="submitterHandle" className="text-white font-medium">
                      Your Name/Handle *
                    </Label>
                    <Input
                      {...form.register('submitterHandle')}
                      placeholder="@artlover22 or Sam Chen"
                      className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
                    />
                    {form.formState.errors.submitterHandle && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.submitterHandle.message}</p>
                    )}
                  </div>

                  {/* Substack URL field for written submissions */}
                  {(selectedType === 'community-work' || selectedType === 'quick-share') && (
                    <div>
                      <Label htmlFor="substackUrl" className="text-white font-medium">
                        Substack Article URL (Optional)
                      </Label>
                      <Input
                        {...form.register('substackUrl')}
                        placeholder="https://yourname.substack.com/p/your-article"
                        className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
                      />
                      <p className="text-muted-foreground text-xs mt-1">
                        Link to your Substack article for dynamic content pulling
                      </p>
                    </div>
                  )}

                  {/* External Content Quick Add */}
                  <div>
                    <Label className="text-white font-medium">
                      {selectedTypeData.flow === 'discovery' ? 'Link (Optional)' : 'External Content (Optional)'}
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder={selectedTypeData.flow === 'discovery' ? 
                          "Link to what you're sharing..." : 
                          "Substack, YouTube, SoundCloud URL..."}
                        className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddLink(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="border-border text-white hover:bg-white/10"
                      >
                        {showAdvanced ? 'Less' : 'More'}
                      </Button>
                    </div>
                    
                    {collaborationLinks.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {collaborationLinks.map((link, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {getPlatformIcon(detectContentType(link).platform)}
                            <span className="truncate">{link}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Step 3: Advanced Options */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submitterEmail" className="text-white font-medium">
                      Email (Optional)
                    </Label>
                    <Input
                      type="email"
                      {...form.register('submitterEmail')}
                      placeholder="your@email.com"
                      className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="socialHandle" className="text-white font-medium">
                      Social Handle (Optional)
                    </Label>
                    <Input
                      {...form.register('socialHandle')}
                      placeholder="@yourusername"
                      className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-pink-500"
                    />
                  </div>
                </div>

                {showAdvanced && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2 mx-auto" />
                      <p className="text-white font-medium mb-1">Upload Files</p>
                      <p className="text-muted-foreground text-sm">JPG, PNG, PDF up to 25MB</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-[var(--navy)] rounded-lg">
                        <h4 className="text-white font-medium mb-1">Google Drive</h4>
                        <Input
                          placeholder="https://docs.google.com/..."
                          className="bg-[var(--charcoal)] border-border text-white placeholder:text-muted-foreground"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddLink(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                      
                      <div className="p-3 bg-[var(--navy)] rounded-lg">
                        <h4 className="text-white font-medium mb-1">Other Links</h4>
                        <Input
                          placeholder="https://..."
                          className="bg-[var(--charcoal)] border-border text-white placeholder:text-muted-foreground"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddLink(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6">
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={currentStep === 0 ? onClose : () => setCurrentStep(currentStep - 1)}
              className="text-muted-foreground hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            
            {currentStep < 2 ? (
              <Button
                onClick={handleNext}
                disabled={currentStep === 0 && !selectedType}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={createSubmissionMutation.isPending}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                {createSubmissionMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}