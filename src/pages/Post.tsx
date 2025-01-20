import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PlatformSelector } from "@/components/post/PlatformSelector";
import { MediaUpload } from "@/components/post/MediaUpload";
import { PostScheduler } from "@/components/post/PostScheduler";
import type { PostForm } from "@/types/post";

const Post = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
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
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
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
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platform selected",
        description: "Please select at least one platform to post to",
        variant: "destructive",
      });
      return;
    }

    if (data.postType === "schedule" && !date) {
      toast({
        title: "No date selected",
        description: "Please select a date to schedule your post",
        variant: "destructive",
      });
      return;
    }

    const finalData = {
      ...data,
      platforms: selectedPlatforms,
      scheduledDate: date,
      mediaFile,
    };

    console.log("Form submitted:", finalData);
    
    toast({
      title: "Success!",
      description: data.postType === "now" 
        ? "Your post has been published" 
        : `Your post has been scheduled for ${date!.toLocaleDateString()}`,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 p-4">
        <Card className="max-w-3xl mx-auto mt-8 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Create Post</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share your content across multiple platforms
            </p>
          </div>

          <PlatformSelector 
            selectedPlatforms={selectedPlatforms}
            onPlatformToggle={togglePlatform}
          />

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

              <MediaUpload
                mediaPreview={mediaPreview}
                onFileChange={handleFileChange}
                onRemoveMedia={() => {
                  setMediaFile(null);
                  setMediaPreview(null);
                }}
              />

              <PostScheduler 
                form={form}
                date={date}
                onDateSelect={setDate}
              />

              <div className="flex justify-end gap-3">
                <Button type="submit" className="flex items-center gap-2">
                  {form.watch("postType") === "schedule" ? (
                    <>
                      <CalendarIcon className="w-4 h-4" />
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
    </div>
  );
};

export default Post;