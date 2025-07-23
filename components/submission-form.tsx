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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Palette, Heart, Camera, Layers, Upload, X, Info, MessageCircle, MapPin, Play, Volume2, ExternalLink } from "lucide-react";
import SubmissionGuidelines from "./submission-guidelines";
import EditorialSubmissionGuide from "./editorial-submission-guide";
import { detectContentType, getPlatformIcon } from "./content-type-detector";

const submissionTypes = [
  { 
    id: 'quick-share', 
    label: 'Quick Share', 
    icon: Heart, 
    description: 'Something you\'re enamored with right now',
    guidelines: 'What caught your eye? A song, a place, a person, a moment - tell us why it has your attention',
    format: 'casual'
  },
  { 
    id: 'creative-work', 
    label: 'Creative Work', 
    icon: Palette, 
    description: 'Your own art, writing, photography, or creative projects',
    guidelines: 'Share your process, inspiration, or what you discovered while making this',
    format: 'portfolio'
  },
  { 
    id: 'conversation', 
    label: 'In Conversation', 
    icon: MessageCircle, 
    description: 'Deeper thoughts, interviews, or cultural commentary',
    guidelines: 'What larger story are you telling? What questions are you exploring?',
    format: 'editorial'
  },
  { 
    id: 'local-moment', 
    label: 'Local Moment', 
    icon: MapPin, 
    description: 'Something happening in your community that has your attention',
    guidelines: 'What\'s the story here? Why does this moment matter to you or your community?',
    format: 'documentary'
  },
];

interface SubmissionFormProps {
  onClose: () => void;
}

export default function SubmissionForm({ onClose }: SubmissionFormProps) {
  const [activeCategory, setActiveCategory] = useState(submissionTypes[0].id);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [collaborationLinks, setCollaborationLinks] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [detectedContentType, setDetectedContentType] = useState<string>('text');
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
      category: activeCategory,
      files: [],
    },
  });

  const createSubmissionMutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const response = await apiRequest('POST', '/api/submissions', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submission Successful!",
        description: "Your work has been submitted for editorial review.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    // Simulate file upload process - in production, upload to cloud storage
    const newFiles: string[] = [];
    Array.from(files).forEach((file, index) => {
      // Generate placeholder URLs - replace with actual upload logic
      const fileUrl = `https://storage.enamorado.com/uploads/${Date.now()}_${index}_${file.name}`;
      newFiles.push(fileUrl);
    });
    
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      
      toast({
        title: "Files uploaded successfully",
        description: `${newFiles.length} file(s) ready for submission`,
      });
    }, 2000);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: InsertSubmission) => {
    createSubmissionMutation.mutate({
      ...data,
      category: activeCategory,
      contentType: detectedContentType,
      files: uploadedFiles,
      collaborationLinks: collaborationLinks,
    });
  };

  const getCategoryIcon = (CategoryIcon: any) => <CategoryIcon className="w-5 h-5" />;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[var(--charcoal)] to-[var(--slate)] border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white">What Are You Enamored With?</CardTitle>
              <p className="text-muted-foreground">Share what has your attention right now - the spontaneous, the thoughtful, the beautiful</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <CardContent className="p-6">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-5 bg-[var(--navy)]/50">
                {submissionTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-2">
                    {getCategoryIcon(type.icon)}
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                ))}
                <TabsTrigger value="guidelines" className="flex items-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Guidelines</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="guidelines" className="mt-6">
                <div className="space-y-6">
                  <EditorialSubmissionGuide />
                  <SubmissionGuidelines />
                </div>
              </TabsContent>
              
              {submissionTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="mt-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{type.label}</h3>
                    <p className="text-muted-foreground">{type.description}</p>
                  </div>
                  
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="submitterHandle" className="text-white font-medium">
                          Your Handle/Name *
                        </Label>
                        <Input
                          {...form.register('submitterHandle')}
                          placeholder="@artlover22 or Sam Chen"
                          className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-editorial"
                        />
                        {form.formState.errors.submitterHandle && (
                          <p className="text-red-400 text-sm">{form.formState.errors.submitterHandle.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="submitterEmail" className="text-white font-medium">
                          Email (optional)
                        </Label>
                        <Input
                          type="email"
                          {...form.register('submitterEmail')}
                          placeholder="your@email.com"
                          className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-editorial"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white font-medium">
                        {type.format === 'casual' ? 'What caught your attention?' : 'Title'} *
                      </Label>
                      <Input
                        {...form.register('title')}
                        placeholder={type.format === 'casual' ? 'A song I can\'t stop playing' : 'What do you call this?'}
                        className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-editorial"
                      />
                      {form.formState.errors.title && (
                        <p className="text-red-400 text-sm">{form.formState.errors.title.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white font-medium">
                        {type.format === 'casual' ? 'Why are you enamored with this?' : 'Tell us more'} *
                      </Label>
                      <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 mb-3">
                        <p className="text-pink-400 text-sm font-medium mb-1">What we're looking for:</p>
                        <p className="text-pink-300 text-sm">{type.guidelines}</p>
                      </div>
                      <Textarea
                        {...form.register('description')}
                        placeholder={type.format === 'casual' ? 'What drew you to this? How does it make you feel?' : 'What inspired this? What\'s the story behind it?'}
                        rows={type.format === 'casual' ? 3 : 4}
                        className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-editorial resize-none"
                      />
                      {form.formState.errors.description && (
                        <p className="text-red-400 text-sm">{form.formState.errors.description.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="socialHandle" className="text-white font-medium">
                        Instagram/Social Handle (optional)
                      </Label>
                      <Input
                        {...form.register('socialHandle')}
                        placeholder="@yourusername"
                        className="bg-[var(--navy)] border-border text-white placeholder:text-muted-foreground focus:border-editorial"
                      />
                    </div>
                    
                    {/* File Upload and Workflow Integration */}
                    <div className="space-y-4">
                      <Label className="text-white font-medium">Upload Files or Share Links</Label>
                      
                      {/* File Upload Section */}
                      <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-editorial/50 transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-muted-foreground mb-3 mx-auto" />
                          <h3 className="text-white font-medium mb-2">Upload Your {type.label}</h3>
                          <p className="text-muted-foreground text-sm mb-4">JPG, PNG, PDF, AI, INDD up to 25MB each</p>
                          
                          <input
                            type="file"
                            id="fileUpload"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf,.ai,.indd,.psd,.sketch"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button 
                            type="button" 
                            onClick={() => document.getElementById('fileUpload')?.click()}
                            className="bg-editorial text-white hover:bg-blue-600"
                            disabled={isUploading}
                          >
                            {isUploading ? 'Uploading...' : 'Choose Files'}
                          </Button>
                        </div>
                      </div>

                      {/* Workflow Integration Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-[var(--navy)] rounded-lg border border-border">
                          <h4 className="text-white font-medium mb-2">Google Drive Integration</h4>
                          <p className="text-muted-foreground text-sm mb-3">Share Google Docs, Sheets, or Drive folders</p>
                          <Input
                            placeholder="https://docs.google.com/..."
                            className="bg-[var(--charcoal)] border-border text-white placeholder:text-muted-foreground"
                            onChange={(e) => {
                              if (e.target.value.trim()) {
                                setUploadedFiles(prev => [...prev, e.target.value.trim()]);
                                e.target.value = '';
                              }
                            }}
                          />
                        </div>
                        
                        <div className="p-4 bg-[var(--navy)] rounded-lg border border-border">
                          <h4 className="text-white font-medium mb-2">External Content</h4>
                          <p className="text-muted-foreground text-sm mb-3">Substack, YouTube, SoundCloud, etc.</p>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="https://..."
                              className="bg-[var(--charcoal)] border-border text-white placeholder:text-muted-foreground"
                              onChange={(e) => {
                                if (e.target.value.trim()) {
                                  const url = e.target.value.trim();
                                  const contentInfo = detectContentType(url);
                                  setDetectedContentType(contentInfo.type);
                                  setCollaborationLinks(prev => [...prev, url]);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <div className="flex items-center space-x-1">
                              {detectedContentType === 'video' && <Play className="w-4 h-4 text-blue-500" />}
                              {detectedContentType === 'audio' && <Volume2 className="w-4 h-4 text-orange-500" />}
                              {detectedContentType === 'substack' && <ExternalLink className="w-4 h-4 text-orange-500" />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Uploaded Files Display */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-white font-medium">Attached Files & Links</Label>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-[var(--navy)] rounded-lg border border-border">
                                <span className="text-white text-sm truncate flex-1">{file}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Staff Workflow Notes */}
                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                        <h4 className="text-white font-medium mb-2">For Editorial Staff</h4>
                        <p className="text-muted-foreground text-sm">
                          Use Google Drive links for collaborative editing, Adobe CC links for design files, or upload finals directly. 
                          All submissions go through our editorial review process before publication.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        className="flex-1 border-border text-muted-foreground hover:bg-muted/10"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createSubmissionMutation.isPending}
                        className="flex-1 bg-pink-600 text-white hover:bg-pink-700" 
                      >
                        {createSubmissionMutation.isPending ? 'Sharing...' : 'Share What You\'re Enamored With'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
