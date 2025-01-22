import { PostForm } from "@/types/post"

interface LinkedInPreviewProps {
  data: PostForm
  mediaPreview: string | null
}

export function LinkedInPreview({ data, mediaPreview }: LinkedInPreviewProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-medium">LinkedIn Preview</h3>
      <p className="text-sm text-gray-600">
        LinkedIn preview coming soon...
      </p>
    </div>
  )
}