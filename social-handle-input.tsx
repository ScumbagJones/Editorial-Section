import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Twitter, Linkedin, ExternalLink } from "lucide-react";

interface SocialHandleInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function SocialHandleInput({ 
  value, 
  onChange, 
  label = "Social Handle", 
  placeholder = "@username or social link" 
}: SocialHandleInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const detectPlatform = (input: string) => {
    if (input.includes('instagram.com') || input.includes('instagr.am')) {
      return { platform: 'Instagram', icon: Instagram, color: 'bg-pink-600' };
    } else if (input.includes('twitter.com') || input.includes('x.com')) {
      return { platform: 'Twitter', icon: Twitter, color: 'bg-blue-600' };
    } else if (input.includes('linkedin.com')) {
      return { platform: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' };
    } else if (input.startsWith('@')) {
      return { platform: 'Handle', icon: ExternalLink, color: 'bg-[var(--editorial)]' };
    }
    return null;
  };

  const extractHandle = (input: string) => {
    // Extract username from various social media URL formats
    if (input.includes('instagram.com/')) {
      const match = input.match(/instagram\.com\/([^/?]+)/);
      return match ? `@${match[1]}` : input;
    } else if (input.includes('twitter.com/') || input.includes('x.com/')) {
      const match = input.match(/(?:twitter|x)\.com\/([^/?]+)/);
      return match ? `@${match[1]}` : input;
    } else if (input.includes('linkedin.com/in/')) {
      const match = input.match(/linkedin\.com\/in\/([^/?]+)/);
      return match ? `@${match[1]}` : input;
    }
    return input;
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    const cleanHandle = extractHandle(newValue);
    onChange(cleanHandle);
  };

  const platform = detectPlatform(inputValue);

  return (
    <div className="space-y-2">
      <Label htmlFor="social-handle">{label}</Label>
      <div className="space-y-2">
        <Input
          id="social-handle"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
        
        {platform && inputValue && (
          <div className="flex items-center space-x-2">
            <Badge className={`${platform.color} text-white flex items-center space-x-1`}>
              <platform.icon className="w-3 h-3" />
              <span>{platform.platform}</span>
            </Badge>
            <span className="text-sm text-muted-foreground">
              Will display as: {extractHandle(inputValue)}
            </span>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Paste your Instagram, Twitter, or LinkedIn profile, or just type @username
        </p>
      </div>
    </div>
  );
}