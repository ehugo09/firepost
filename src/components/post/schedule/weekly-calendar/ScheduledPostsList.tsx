import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Video, Image, FileText } from "lucide-react";

interface ScheduledPostsListProps {
  date: Date | undefined;
}

export const ScheduledPostsList = ({ date }: ScheduledPostsListProps) => {
  if (!date) return null;

  // Mock data - will be replaced with real data from the database
  const mockPosts = [
    { 
      type: 'video',
      title: "Notre nouvelle vidéo produit",
      time: "10:00"
    },
    {
      type: 'image',
      title: "Photos de l'événement",
      time: "14:30"
    },
    {
      type: 'text',
      title: "Annonce importante",
      time: "16:00"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">
        Posts prévus le {format(date, 'EEEE d MMMM', { locale: fr })}
      </h3>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {mockPosts.map((post, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3"
            >
              {getIcon(post.type)}
              <div className="flex-1">
                <div className="text-sm font-medium">{post.title}</div>
                <div className="text-xs text-gray-500">{post.time}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};