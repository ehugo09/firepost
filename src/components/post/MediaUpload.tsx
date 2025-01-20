import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface MediaUploadProps {
  mediaPreview: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMedia: () => void;
}

export const MediaUpload = ({ mediaPreview, onFileChange, onRemoveMedia }: MediaUploadProps) => {
  return (
    <div className="space-y-3">
      <Label>Media</Label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Media
        </Button>
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          onChange={onFileChange}
          className="hidden"
        />
        {mediaPreview && (
          <div className="relative">
            <img
              src={mediaPreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={onRemoveMedia}
            >
              ×
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};