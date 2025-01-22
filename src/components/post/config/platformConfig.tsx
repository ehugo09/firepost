import { Twitter, Instagram, Linkedin } from "lucide-react"
import { TwitterPreview } from "../previews/TwitterPreview"
import { InstagramPreview } from "../previews/InstagramPreview"
import { LinkedInPreview } from "../previews/LinkedInPreview"

export const platformConfig = {
  twitter: {
    icon: <Twitter className="w-4 h-4" />,
    component: TwitterPreview,
  },
  instagram: {
    icon: <Instagram className="w-4 h-4" />,
    component: InstagramPreview,
  },
  linkedin: {
    icon: <Linkedin className="w-4 h-4" />,
    component: LinkedInPreview,
  },
} as const;