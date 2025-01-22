import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MediaUploadProps {
  mediaPreview: string | null;
  onFileChange: (url: string) => void;
  onRemoveMedia: () => void;
}

export const MediaUpload = ({ mediaPreview, onFileChange, onRemoveMedia }: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log("[MediaUpload] Starting file upload...");
      const formData = new FormData();
      formData.append('file', file);

      const response = await supabase.functions.invoke('media-upload', {
        body: formData,
      });

      console.log("[MediaUpload] Upload response:", response);

      if (response.error) {
        console.error("[MediaUpload] Upload error from edge function:", response.error);
        throw response.error;
      }

      if (!response.data?.url) {
        console.error("[MediaUpload] No URL in response data:", response.data);
        throw new Error("No URL returned from upload");
      }

      console.log("[MediaUpload] Upload successful, calling onFileChange with URL:", response.data.url);
      onFileChange(response.data.url);
      
      toast({
        title: "Upload successful",
        description: "Your media has been uploaded successfully.",
      });
    } catch (error) {
      console.error("[MediaUpload] Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Media</Label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="flex items-center gap-2"
          disabled={isUploading}
        >
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload Media"}
        </Button>
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
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