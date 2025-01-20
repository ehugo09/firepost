import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin } from "lucide-react";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string) => void;
}

export const PlatformSelector = ({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium mb-3">Select Platforms</h2>
      <div className="flex gap-3">
        <Button
          variant={selectedPlatforms.includes("twitter") ? "default" : "outline"}
          onClick={() => onPlatformToggle("twitter")}
          className="flex items-center gap-2"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </Button>
        <Button
          variant={selectedPlatforms.includes("instagram") ? "default" : "outline"}
          onClick={() => onPlatformToggle("instagram")}
          className="flex items-center gap-2"
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </Button>
        <Button
          variant={selectedPlatforms.includes("linkedin") ? "default" : "outline"}
          onClick={() => onPlatformToggle("linkedin")}
          className="flex items-center gap-2"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
};