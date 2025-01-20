import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Twitter, Instagram, Linkedin, Upload, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostForm {
  title: string;
  content: string;
  postType: "now" | "schedule";
  platforms: string[];
}

const Post = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<PostForm>({
    defaultValues: {
      title: "",
      content: "",
      postType: "now",
      platforms: [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setMediaFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const onSubmit = async (data: PostForm) => {
    console.log("Form submitted:", { ...data, platforms: selectedPlatforms, mediaFile });
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platform selected",
        description: "Please select at least one platform to post to",
        variant: "destructive",
      });
      return;
    }

    // Here we would handle the post creation
    toast({
      title: "Success!",
      description: data.postType === "now" 
        ? "Your post has been published" 
        : "Your post has been scheduled",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-3xl mx-auto mt-8 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Share your content across multiple platforms
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-medium mb-3">Select Platforms</h2>
          <div className="flex gap-3">
            <Button
              variant={selectedPlatforms.includes("twitter") ? "default" : "outline"}
              onClick={() => togglePlatform("twitter")}
              className="flex items-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button
              variant={selectedPlatforms.includes("instagram") ? "default" : "outline"}
              onClick={() => togglePlatform("instagram")}
              className="flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
            <Button
              variant={selectedPlatforms.includes("linkedin") ? "default" : "outline"}
              onClick={() => togglePlatform("linkedin")}
              className="flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your post title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What would you like to share?" 
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                  onChange={handleFileChange}
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
                      onClick={() => {
                        setMediaFile(null);
                        setMediaPreview(null);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="postType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When to post</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="now" id="now" />
                        <Label htmlFor="now">Post now</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="schedule" id="schedule" />
                        <Label htmlFor="schedule">Schedule</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="submit" className="flex items-center gap-2">
                {form.watch("postType") === "schedule" ? (
                  <>
                    <Calendar className="w-4 h-4" />
                    Schedule Post
                  </>
                ) : (
                  "Post Now"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Post;