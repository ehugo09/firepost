import { Video, Image, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Post {
  type: 'video' | 'image' | 'text';
}

interface PostIndicatorsProps {
  posts: Post[];
}

export const PostIndicators = ({ posts }: PostIndicatorsProps) => {
  const getIcon = (type: Post['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-3 w-3" />;
      case 'image':
        return <Image className="h-3 w-3" />;
      case 'text':
        return <FileText className="h-3 w-3" />;
    }
  };

  const maxVisiblePosts = 4;
  const visiblePosts = posts.slice(0, maxVisiblePosts);
  const remainingCount = posts.length - maxVisiblePosts;

  return (
    <div className="flex flex-wrap gap-1">
      {visiblePosts.map((post, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <div className={`
                p-1 rounded-full bg-gray-100 dark:bg-gray-800
                ${index > 0 ? '-ml-1' : ''}
              `}>
                {getIcon(post.type)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{post.type}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {remainingCount > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};