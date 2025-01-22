import { PostForm } from "@/types/post"

interface InstagramPreviewProps {
  data: PostForm
  mediaPreview: string | null
}

export function InstagramPreview({ data, mediaPreview }: InstagramPreviewProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-medium">Instagram Preview</h3>
      <p className="text-sm text-gray-600">
        Instagram preview coming soon...
      </p>
    </div>
  )
}