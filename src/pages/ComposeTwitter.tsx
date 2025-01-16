import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ComposeTwitter = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const maxLength = 280;

  const handleSubmit = async () => {
    try {
      console.log("Attempting to post tweet with content:", content);
      
      const { data, error } = await supabase.functions.invoke('twitter', {
        body: { content },
        method: 'POST'
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log("Tweet posted successfully:", data);
      
      toast({
        title: "Success!",
        description: "Your tweet has been posted.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error posting tweet:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to post tweet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-2xl mx-auto mt-8 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Compose Tweet</h1>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="min-h-[150px] mb-4"
          maxLength={maxLength}
        />

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {content.length}/{maxLength}
          </span>
          <Button 
            onClick={handleSubmit}
            disabled={!content.trim() || content.length > maxLength}
          >
            Post Tweet
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ComposeTwitter;