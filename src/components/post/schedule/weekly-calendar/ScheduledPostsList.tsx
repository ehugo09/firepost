import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Video, Image, FileText, Twitter, Instagram, Linkedin } from "lucide-react";

interface ScheduledPostsListProps {
  date: Date;
}

export const ScheduledPostsList = ({ date }: ScheduledPostsListProps) => {
  // Mock data - will be replaced with real data from the database
  const mockPosts = [
    { 
      type: 'video',
      title: "Notre nouvelle vidéo produit",
      time: "10:00",
      platforms: ["twitter", "instagram"]
    },
    {
      type: 'image',
      title: "Photos de l'événement",
      time: "14:30",
      platforms: ["instagram", "linkedin"]
    },
    {
      type: 'text',
      title: "Annonce importante",
      time: "16:00",
      platforms: ["twitter", "linkedin"]
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">
        Posts prévus le {format(date, 'EEEE d MMMM', { locale: fr })}
      </h3>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {mockPosts.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucun post prévu pour cette date
            </div>
          ) : (
            mockPosts.map((post, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3"
              >
                {getIcon(post.type)}
                <div className="flex-1">
                  <div className="text-sm font-medium">{post.title}</div>
                  <div className="text-xs text-gray-500">{post.time}</div>
                </div>
                <div className="flex gap-2">
                  {post.platforms.map((platform, idx) => (
                    <div 
                      key={idx} 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      {getPlatformIcon(platform)}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};