import { Button } from "@/components/ui/button"
import { platformConfig } from "./config/platformConfig"

interface PlatformSelectorProps {
  selectedPlatforms: string[]
  onPlatformToggle: (platform: string) => void
}

export const PlatformSelector = ({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium mb-3">Select Platforms</h2>
      <div className="flex gap-3">
        {Object.entries(platformConfig).map(([platform, { icon }]) => (
          <Button
            key={platform}
            variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
            onClick={() => onPlatformToggle(platform)}
            className={`flex items-center gap-2 ${
              selectedPlatforms.includes(platform) ? "bg-[#E86643] hover:bg-[#E86643]/90" : ""
            }`}
          >
            {icon}
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  )
}