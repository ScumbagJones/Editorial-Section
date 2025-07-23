import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  PenTool, 
  Palette, 
  Music, 
  Camera,
  Upload,
  Link as LinkIcon,
  Tag
} from "lucide-react";
import SocialHandleInput from "./social-handle-input";

type ContentType = 'poetry' | 'art' | 'playlist' | 'fashion' | null;

export default function SubmissionWizard() {
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState<ContentType>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submitterHandle: '',
    submitterEmail: '',
    socialHandle: '',
    files: [] as string[],
    collaborationLinks: [] as string[],
    tags: [] as string[]
  });

  const contentTypes = [
    {
      id: 'poetry' as ContentType,
      title: 'Poetry & Writing',
      description: 'Share your poems, thoughts, or creative writing',
      icon: PenTool,
      color: 'text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      id: 'art' as ContentType,
      title: 'Art & Drawings',
      description: 'Show your sketches, digital art, or visual work',
      icon: Palette,
      color: 'text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      id: 'playlist' as ContentType,
      title: 'Playlists',
      description: 'Curated music collections and discoveries',
      icon: Music,
      color: 'text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      id: 'fashion' as ContentType,
      title: 'Fashion & Fits',
      description: 'Outfit photos, style inspiration, thrift finds',
      icon: Camera,
      color: 'text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950'
    }
  ];

  const getProgress = () => {
    if (step === 1) return 25;
    if (step === 2) return 50;
    if (step === 3) return 75;
    return 100;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Choose Content Type";
      case 2: return "Add Your Content";
      case 3: return "Add Details";
      case 4: return "Review & Submit";
      default: return "Submit";
    }
  };

  const renderContentForm = () => {
    switch (contentType) {
      case 'poetry':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title of your poem or piece"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Your Writing</Label>
              <Textarea
                id="content"
                placeholder="Share your poem, story, or creative writing here..."
                className="min-h-48 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-2">
                For poems, use line breaks to preserve formatting
              </p>
            </div>

            <div>
              <Label>Optional Author Bio or Context</Label>
              <Textarea
                placeholder="What inspired this piece? Any context you'd like to share..."
                className="min-h-24"
              />
            </div>
          </div>
        );

      case 'playlist':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Playlist Title</Label>
              <Input
                id="title"
                placeholder="Give your playlist a name"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="link">Playlist Link</Label>
              <div className="flex space-x-2">
                <LinkIcon className="w-5 h-5 text-muted-foreground mt-2" />
                <Input
                  id="link"
                  placeholder="Spotify, Apple Music, or YouTube playlist URL"
                  value={formData.collaborationLinks[0] || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    collaborationLinks: [e.target.value]
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Keep under 1 hour for radio consideration
              </p>
            </div>

            <div>
              <Label>Description & Story</Label>
              <Textarea
                placeholder="What's the story behind these songs? What mood or theme connects them?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-32"
              />
            </div>

            <div>
              <Label>Genre Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Electronic', 'Jazz', 'Indie', 'Pop', 'Hip-Hop', 'Alternative'].map(genre => (
                  <Badge key={genre} variant="outline" className="cursor-pointer hover:bg-[var(--editorial)]/10">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'art':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Artwork Title</Label>
              <Input
                id="title"
                placeholder="Title of your piece"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Upload Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop your images or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  High-resolution images (min 800px width). Multiple angles for 3D work.
                </p>
                <Button variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>

            <div>
              <Label>Medium & Process</Label>
              <Textarea
                placeholder="What medium did you use? Tell us about your creative process..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-32"
              />
            </div>
          </div>
        );

      case 'fashion':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Outfit Title</Label>
              <Input
                id="title"
                placeholder="Describe your look or occasion"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Upload Photos</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Clear, well-lit photos of your outfit
                </p>
                <p className="text-xs text-muted-foreground">
                  Multiple angles if possible. Include details and accessories.
                </p>
                <Button variant="outline" className="mt-4">
                  Choose Photos
                </Button>
              </div>
            </div>

            <div>
              <Label>Outfit Details</Label>
              <Textarea
                placeholder="Brands, where you got pieces, styling notes, occasion details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-32"
              />
            </div>

            <div>
              <Label>Style Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Casual', 'Formal', 'Streetwear', 'Vintage', 'Thrift', 'Designer'].map(tag => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-[var(--editorial)]/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {step} of 4: {getStepTitle()}
          </span>
          <span className="text-sm text-muted-foreground">
            {getProgress()}%
          </span>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      <Card>
        <CardContent className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  What would you like to share?
                </h2>
                <p className="text-muted-foreground">
                  Choose the type of content you're submitting
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`p-6 rounded-lg border-2 transition-all text-left hover:border-[var(--editorial)]/50 ${
                        contentType === type.id 
                          ? `border-[var(--editorial)] ${type.bgColor}` 
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <IconComponent className={`w-8 h-8 ${type.color} mb-3`} />
                      <h3 className="font-semibold text-foreground mb-2">
                        {type.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && contentType && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Add Your {contentTypes.find(t => t.id === contentType)?.title}
                </h2>
                <p className="text-muted-foreground">
                  Share your content with the community
                </p>
              </div>

              {renderContentForm()}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  About You
                </h2>
                <p className="text-muted-foreground">
                  Help the community connect with your work
                </p>
              </div>

              <div>
                <Label htmlFor="name">Your Name or Handle</Label>
                <Input
                  id="name"
                  placeholder="How should we credit you?"
                  value={formData.submitterHandle}
                  onChange={(e) => setFormData({...formData, submitterHandle: e.target.value})}
                />
              </div>

              <SocialHandleInput
                value={formData.socialHandle}
                onChange={(value) => setFormData({...formData, socialHandle: value})}
                label="Social Handle (Optional)"
                placeholder="@username or social profile link"
              />

              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="For submission updates only"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({...formData, submitterEmail: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Never shared publicly. Only for important updates about your submission.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !contentType}
                className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="bg-[var(--editorial)] hover:bg-[var(--editorial)]/90 text-white">
                Submit to Community
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}