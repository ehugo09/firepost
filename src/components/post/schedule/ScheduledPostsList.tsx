import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface ScheduledPost {
  date: Date;
  title: string;
  platforms: string[];
}

interface ScheduledPostsListProps {
  posts: ScheduledPost[];
}

export const ScheduledPostsList = ({ posts }: ScheduledPostsListProps) => {
  return (
    <ScrollArea className="h-[150px] p-4 border rounded-md">
      <div className="space-y-2">
        <h4 className="text-sm font-medium mb-2">Scheduled Posts</h4>
        {posts.map((post, index) => (
          <div 
            key={index}
            className="p-2 text-sm rounded-md bg-accent/10 border border-accent/20"
            style={{ borderColor: '#E86643', backgroundColor: 'rgba(232, 102, 67, 0.1)' }}
          >
            <div className="font-medium">{format(post.date, 'HH:mm')}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {post.title}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};